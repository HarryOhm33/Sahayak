import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[config] Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const config = {
  port: parseInt(optionalEnv('PORT', '3001'), 10),

  gemini: {
    apiKey: requireEnv('GEMINI_API_KEY'),
    expansionModel: optionalEnv('EXPANSION_MODEL', 'gemini-2.0-flash-lite'),
    recommendationModel: optionalEnv('RECOMMENDATION_MODEL', 'gemini-2.5-flash'),
  },

  firecrawl: {
    apiKey: requireEnv('FIRECRAWL_API_KEY'),
  },

  bis: {
    searchUrl: optionalEnv(
      'BIS_SEARCH_URL',
      'https://standardsadmin.bis.gov.in/review-service//searchKnowStandards'
    ),
    detailBaseUrl: optionalEnv(
      'BIS_DETAIL_BASE_URL',
      'https://standards.bis.gov.in/website/standard-details'
    ),
    resultsPerQuery: 3,
  },
} as const;
