import FirecrawlApp from '@mendable/firecrawl-js';
import { config } from '../config/env';

let firecrawlClient: FirecrawlApp | null = null;

function getFirecrawlClient(): FirecrawlApp {
  if (!firecrawlClient) {
    firecrawlClient = new FirecrawlApp({ apiKey: config.firecrawl.apiKey });
  }
  return firecrawlClient;
}

export async function batchScrapeStandards(urls: string[]): Promise<string> {
  if (urls.length === 0) {
    console.warn('[firecrawl] No URLs to scrape — returning empty source data');
    return '';
  }

  console.log(`[firecrawl] Starting batch scrape of ${urls.length} URLs`);

  const client = getFirecrawlClient();

  const job = await client.batchScrapeUrls(urls, {
    formats: ['markdown'],
  });

  const jobAny = (job as unknown) as Record<string, unknown>;
  if (!jobAny['data']) {
    console.error('[firecrawl] Batch scrape returned no data:', job);
    return '';
  }

  const markdownParts: string[] = [];

  const data = (jobAny['data'] as { markdown?: string; metadata?: { sourceURL?: string } }[]) ?? [];

  for (const page of data) {
    if (!page.markdown || page.markdown.trim().length === 0) continue;

    const sourceUrl = page.metadata?.sourceURL ?? 'unknown';
    markdownParts.push(
      `\n\n---\n## SOURCE: ${sourceUrl}\n\n${page.markdown.trim()}\n`
    );
  }

  const combined = markdownParts.join('');
  console.log(
    `[firecrawl] Scrape complete — ${data.length} pages, ${combined.length} chars of source data`
  );

  return combined;
}
