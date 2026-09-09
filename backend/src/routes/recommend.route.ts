import { Router, type Request, type Response } from 'express';
import { expandQuery, generateRecommendation } from '../services/gemini.service';
import { fetchBisStandardEncIds } from '../services/bis.service';
import { fetchBisDetailData } from '../services/bis-detail.service';
import type { RecommendRequest, ApiError } from '../types';

export const recommendRouter = Router();

recommendRouter.post('/', async (req: Request, res: Response) => {
  const { query } = req.body as Partial<RecommendRequest>;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    const errBody: ApiError = { error: 'query is required and must be a non-empty string' };
    res.status(400).json(errBody);
    return;
  }

  const trimmedQuery = query.trim();
  console.log('\n[recommend] ═══ New request ═══');
  console.log('[recommend] Query:', trimmedQuery);

  try {
    console.log('[recommend] Step 1 — Expanding query with Gemini...');
    const expandedQueries = await expandQuery(trimmedQuery);

    console.log('[recommend] Step 2 — Searching BIS portal...');
    const encIds = await fetchBisStandardEncIds(expandedQueries);
    console.log(`[recommend] Got ${encIds.length} unique BIS standard encIds`);

    console.log('[recommend] Step 3 — Fetching BIS standard details (6 endpoints per encId)...');
    const sourceData = await fetchBisDetailData(encIds);

    console.log('[recommend] Step 4 — Generating IS recommendation...');
    const recommendation = await generateRecommendation(trimmedQuery, sourceData);

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
