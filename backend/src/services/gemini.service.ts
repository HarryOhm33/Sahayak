import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env';
import type { RecommendationResponse } from '../types';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: config.gemini.apiKey });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION_PATH = path.resolve(
  __dirname,
  '../../../docs/system_instruction.md'
);

let cachedSystemInstruction: string | null = null;

function getSystemInstruction(): string {
  if (!cachedSystemInstruction) {
    if (!fs.existsSync(SYSTEM_INSTRUCTION_PATH)) {
      throw new Error(
        `[gemini] system_instruction.md not found at: ${SYSTEM_INSTRUCTION_PATH}`
      );
    }
    cachedSystemInstruction = fs.readFileSync(SYSTEM_INSTRUCTION_PATH, 'utf-8');
    console.log(
      `[gemini] Loaded system instruction (${cachedSystemInstruction.length} chars)`
    );
  }
  return cachedSystemInstruction;
}

const EXPANSION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    queries: {
      type: Type.ARRAY,
      description:
        '5 to 6 short, precise 1–3 word search terms targeting different aspects of the product for BIS catalog search.',
      items: { type: Type.STRING },
    },
  },
  required: ['queries'],
};

const RECOMMENDATION_SCHEMA = {
  type: Type.OBJECT,
  required: ['queryAnalysis', 'standards'],
  properties: {
    queryAnalysis: {
      type: Type.OBJECT,
      required: ['originalQuery', 'parsedProduct', 'productCategory', 'ambiguityFlag'],
      properties: {
        originalQuery: { type: Type.STRING },
        parsedProduct: { type: Type.STRING },
        productCategory: { type: Type.STRING },
        ambiguityFlag: { type: Type.BOOLEAN },
        ambiguityNote: { type: Type.STRING },
      },
    },
    standards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ['id', 'number', 'title', 'edition', 'status', 'relevance', 'relationship', 'description'],
        properties: {
          id: {
            type: Type.STRING,
            description: 'Lowercase hyphen-separated slug, e.g. is-1180-part-1',
          },
          number: {
            type: Type.STRING,
            description: 'Official BIS notation, e.g. IS 1180 (Part 1)',
          },
          title: { type: Type.STRING },
          edition: {
            type: Type.STRING,
            description: '4-digit year string, e.g. 2014',
          },
          status: {
            type: Type.STRING,
            enum: ['active', 'superseded'],
          },
          relevance: {
            type: Type.INTEGER,
            description: 'Integer 1–100. See scoring rules in system instruction.',
          },
          relationship: {
            type: Type.STRING,
            enum: ['primary', 'normative', 'testing', 'safety', 'installation', 'related'],
          },
          description: {
            type: Type.STRING,
            description:
              '2–4 sentence expert explanation mentioning the specific product. No generic text.',
          },
          amendments: {
            type: Type.ARRAY,
            description: 'List of amendments and their download URLs. Omit if none.',
            items: {
              type: Type.OBJECT,
              required: ['label'],
              properties: {
                label: { type: Type.STRING, description: 'e.g. Amendment 2 — 2019' },
                downloadUrl: { type: Type.STRING, description: 'Direct download URL from is_documents, if available' }
              }
            },
          },
          certifications: {
            type: Type.ARRAY,
            description: 'List of applicable certifications for this standard.',
            items: {
              type: Type.OBJECT,
              required: ['name', 'status'],
              properties: {
                name: { type: Type.STRING },
                status: {
                  type: Type.STRING,
                  enum: ['APPLICABLE', 'NOT APPLICABLE', 'CHECK REQUIRED'],
                },
              },
            },
          },
          missingParams: {
            type: Type.ARRAY,
            description:
              'Actionable statements about missing tender parameters or compliance gaps.',
            items: { type: Type.STRING },
          },
          gazetteDocuments: {
            type: Type.ARRAY,
            description: 'List of gazette notifications and their download URLs. Omit if none.',
            items: {
              type: Type.OBJECT,
              required: ['label'],
              properties: {
                label: { type: Type.STRING, description: 'e.g. Gazette Notification 2021' },
                downloadUrls: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Array of URLs from migratedFiles' }
              }
            }
          },
          productManuals: {
            type: Type.ARRAY,
            description: 'List of product manuals and their download URLs. Omit if none.',
            items: {
              type: Type.OBJECT,
              required: ['label'],
              properties: {
                label: { type: Type.STRING, description: 'e.g. Product Manual 2020' },
                downloadUrl: { type: Type.STRING, description: 'URL from file_path' }
              }
            }
          }
        },
      },
    },
  },
};

export async function expandQuery(userQuery: string): Promise<string[]> {
  console.log('[gemini:expand] Expanding query:', userQuery);

  const ai = getAiClient();

  const response = await ai.models.generateContent({
    model: config.gemini.expansionModel,
    config: {
      responseMimeType: 'application/json',
      responseSchema: EXPANSION_SCHEMA,
      systemInstruction: [
        {
          text: `You are a BIS Standards search query generator for an Indian government procurement tool.

Given a product description, equipment specification, or procurement query, your task is to generate 5–6 short, precise search terms (1–3 words each) that will be entered into the Bureau of Indian Standards (BIS) searchKnowStandards API.

Rules:
- Each term must target a DIFFERENT aspect: the product type itself, a key component, a material, a safety/testing aspect, an installation aspect.
- Keep every term to 1–3 words maximum.
- Use technical BIS/IS terminology (e.g. "distribution transformer", "insulating oil", "dielectric test").
- Do NOT repeat the same concept.
- Do NOT include the word "standard" or "IS" in the terms — the search engine knows it's searching standards.
- Output ONLY valid JSON matching the schema. No prose.`,
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userQuery }],
      },
    ],
  });

  const rawText = response.text ?? '{"queries":[]}';

  let parsed: { queries: string[] };
  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error('[gemini:expand] Failed to parse response JSON:', rawText);
    parsed = { queries: [userQuery] };
  }

  const queries = Array.isArray(parsed.queries) ? parsed.queries : [userQuery];
  console.log('[gemini:expand] Expanded queries:', queries);
  return queries;
}

export async function generateRecommendation(
  userQuery: string,
  sourceData: string
): Promise<RecommendationResponse> {
  console.log('[gemini:recommend] Generating recommendation for:', userQuery);
  console.log(
    `[gemini:recommend] Source data length: ${sourceData.length} chars`
  );

  const ai = getAiClient();

  const userPrompt =
    sourceData.trim().length > 0
      ? `USER QUERY:\n${userQuery}\n\n---\n\nSOURCE DATA RETRIEVED FROM BIS PORTAL (use this as your primary reference for IS numbers, titles, editions, and scope):\n\n${sourceData}`
      : `USER QUERY:\n${userQuery}\n\n(No BIS portal source data was retrieved. Use your training knowledge to generate the best possible IS recommendation. Mark ambiguityFlag as true if uncertain.)`;

  const response = await ai.models.generateContent({
    model: config.gemini.recommendationModel,
    config: {
      responseMimeType: 'application/json',
      responseSchema: RECOMMENDATION_SCHEMA,
      systemInstruction: [
        {
          text: getSystemInstruction(),
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
  });

  const rawText = response.text ?? '{}';

  let parsed: RecommendationResponse;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error('[gemini:recommend] Failed to parse response JSON:', rawText);
    throw new Error('Gemini returned malformed JSON for recommendation');
  }

  console.log(
    `[gemini:recommend] Recommendation generated — ${parsed.standards?.length ?? 0} standards`
  );

  return parsed;
}
