import { config } from '../config/env';
import type { BisSearchResponse, BisStandard } from '../types';

async function searchBisForQuery(searchText: string): Promise<BisStandard[]> {
  const body = JSON.stringify({
    searchText,
    token: null,
    refreshToken: null,
    clientId: null,
    clientSecret: null,
    sub: null,
  });

  const response = await fetch(config.bis.searchUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    console.warn(`[bis] Query "${searchText}" returned HTTP ${response.status} — skipping`);
    return [];
  }

  const json = (await response.json()) as BisSearchResponse;

  if (json.status !== 'SUCCESS' || !Array.isArray(json.data)) {
    console.warn(`[bis] Query "${searchText}" returned non-success status — skipping`);
    return [];
  }

  return json.data.slice(0, config.bis.resultsPerQuery);
}

export async function fetchBisStandardEncIds(queries: string[]): Promise<string[]> {
  console.log(`[bis] Searching BIS portal with ${queries.length} queries:`, queries);

  const allResults = await Promise.allSettled(queries.map(searchBisForQuery));

  const encIdSet = new Set<string>();

  for (const result of allResults) {
    if (result.status === 'rejected') {
      console.warn('[bis] A query promise rejected:', result.reason);
      continue;
    }

    for (const std of result.value) {
      if (std.standardEncId) {
        encIdSet.add(std.standardEncId);
      }
    }
  }

  const encIds = [...encIdSet];
  console.log(`[bis] Collected ${encIds.length} unique standardEncIds`);

  return encIds;
}
