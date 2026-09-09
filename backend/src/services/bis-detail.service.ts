const BIS_ADMIN_BASE = 'https://standardsadmin.bis.gov.in/review-service/';

const DETAIL_ENDPOINTS = [
  'getWebsiteStandardDetails',
  'getCrossRefDetails',
  'getAmendmentDetails',
  'getProductManualDetails',
  'getCorrigendumDetails',
  'getGazettedetails',
] as const;

type EndpointName = typeof DETAIL_ENDPOINTS[number];

const REQUEST_HEADERS: Record<string, string> = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'en-US,en;q=0.9',
  'content-type': 'application/json',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'origin': 'https://standards.bis.gov.in',
  'referer': 'https://standards.bis.gov.in/',
};

function buildRequestBody(encId: string): string {
  return JSON.stringify({
    encId,
    fromPage: 'guestUserPage',
    token: null,
    refreshToken: null,
    clientId: null,
    clientSecret: null,
    sub: null,
  });
}

async function fetchEndpoint(
  encId: string,
  endpoint: EndpointName
): Promise<unknown | null> {
  const url = `${BIS_ADMIN_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: REQUEST_HEADERS,
      body: buildRequestBody(encId),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.warn(
        `[bis-detail] ${endpoint} returned HTTP ${response.status} for encId ${encId.slice(0, 20)}...`
      );
      return null;
    }

    const json = await response.json();
    return json;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[bis-detail] ${endpoint} failed for encId ${encId.slice(0, 20)}: ${msg}`);
    return null;
  }
}

async function fetchAllDetailsForEncId(
  encId: string
): Promise<Record<EndpointName, unknown | null>> {
  const results = await Promise.allSettled(
    DETAIL_ENDPOINTS.map((endpoint) => fetchEndpoint(encId, endpoint))
  );

  const combined = {} as Record<EndpointName, unknown | null>;

  DETAIL_ENDPOINTS.forEach((endpoint, i) => {
    const result = results[i];
    combined[endpoint] =
      result.status === 'fulfilled' ? result.value : null;
  });

  return combined;
}

export async function fetchBisDetailData(encIds: string[]): Promise<string> {
  if (encIds.length === 0) {
    console.warn('[bis-detail] No encIds to fetch — returning empty source data');
    return '';
  }

  console.log(`[bis-detail] Fetching details for ${encIds.length} standards (6 endpoints each)...`);

  const allDetailResults = await Promise.allSettled(
    encIds.map((encId) => fetchAllDetailsForEncId(encId))
  );

  const parts: string[] = [];

  allDetailResults.forEach((result, index) => {
    const encId = encIds[index];

    if (result.status === 'rejected') {
      console.warn(`[bis-detail] All endpoints failed for encId ${encId.slice(0, 20)}`);
      return;
    }

    const details = result.value;

    const hasData = Object.values(details).some((v) => v !== null);
    if (!hasData) return;

    const block = [
      `\n\n${'─'.repeat(60)}`,
      `## STANDARD BLOCK — encId: ${encId.slice(0, 32)}...`,
      `${'─'.repeat(60)}`,
      '',
      `### getWebsiteStandardDetails`,
      JSON.stringify(details.getWebsiteStandardDetails, null, 2),
      '',
      `### getCrossRefDetails`,
      JSON.stringify(details.getCrossRefDetails, null, 2),
      '',
      `### getAmendmentDetails`,
      `# NOTE: In amendmentDetails, the key "is_documents" contains the download URL for that amendment.`,
      JSON.stringify(details.getAmendmentDetails, null, 2),
      '',
      `### getProductManualDetails`,
      `# NOTE: In productManualDetails, the key "file_path" contains the download URL for that manual.`,
      JSON.stringify(details.getProductManualDetails, null, 2),
      '',
      `### getCorrigendumDetails`,
      JSON.stringify(details.getCorrigendumDetails, null, 2),
      '',
      `### getGazettedetails`,
      `# NOTE: In gazetteDetails, the key "migratedFiles" is an array of gazette document download URLs.`,
      JSON.stringify(details.getGazettedetails, null, 2),
    ].join('\n');

    parts.push(block);
  });

  const combined = parts.join('');

  console.log(
    `[bis-detail] Fetch complete — ${parts.length} standards with data, ${combined.length} chars of source data`
  );

  return combined;
}
