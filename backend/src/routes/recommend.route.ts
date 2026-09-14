import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { expandQuery, generateRecommendation } from '../services/gemini.service';
import { fetchBisStandardEncIds } from '../services/bis.service';
import { fetchBisDetailData } from '../services/bis-detail.service';
import type { RecommendRequest, ApiError } from '../types';

export const recommendRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

recommendRouter.post('/', upload.single('file'), async (req: Request, res: Response) => {
  const query: string | undefined =
    (req.body as Partial<RecommendRequest>).query;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    const errBody: ApiError = { error: 'query is required and must be a non-empty string' };
    res.status(400).json(errBody);
    return;
  }

  const trimmedQuery = query.trim();
  const uploadedFile = req.file;

  console.log('\n[recommend] ═══ New request ═══');
  console.log('[recommend] Query:', trimmedQuery);
  if (uploadedFile) {
    console.log(`[recommend] File: ${uploadedFile.originalname} (${uploadedFile.mimetype}, ${uploadedFile.size} bytes)`);
  }

  try {
    console.log('[recommend] Step 1 — Expanding query with Gemini...');
    const expandedQueries = await expandQuery(
      trimmedQuery,
      uploadedFile?.buffer,
      uploadedFile?.mimetype
    );

    console.log('[recommend] Step 2 — Searching BIS portal...');
    const encIds = await fetchBisStandardEncIds(expandedQueries);
    console.log(`[recommend] Got ${encIds.length} unique BIS standard encIds`);

    console.log('[recommend] Step 3 — Fetching BIS standard details (6 endpoints per encId)...');
    const sourceData = await fetchBisDetailData(encIds);

    console.log('[recommend] Step 4 — Generating IS recommendation...');
    const recommendation = await generateRecommendation(
      trimmedQuery,
      sourceData,
      uploadedFile?.buffer,
      uploadedFile?.mimetype
    );

    console.log('[recommend] ✓ Done\n');
    res.status(200).json(recommendation);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[recommend] ✗ Pipeline error:', message);
    const errBody: ApiError = {
      error: 'Internal server error during recommendation pipeline',
      details: message,
    };
    res.status(500).json(errBody);
  }
});
