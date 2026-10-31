import { realpathSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const MAX_ATTEMPTS = 3;
const CONCURRENCY = 4;
const TIMEOUT_MS = 20_000;
const USER_AGENT = 'gurezo-portal-link-check';

export const SOURCE_FILES = [
  'apps/site/src/app/projects/projects.data.ts',
  'apps/site/src/app/app.html',
  'apps/site/src/app/home/home-page.html',
  'README.md',
];

const HTML_HREF = /href="(https:\/\/[^"]+)"/g;

const URL_PATTERNS = new Map([
  [
    'apps/site/src/app/projects/projects.data.ts',
    /url:\s*'(https:\/\/[^']+)'/g,
  ],
  ['apps/site/src/app/app.html', HTML_HREF],
  ['apps/site/src/app/home/home-page.html', HTML_HREF],
  ['README.md', /\[[^\]]*\]\((https:\/\/[^)\s]+)\)/g],
]);

function patternFor(file) {
  const normalized = file.replaceAll('\\', '/');
  for (const [name, pattern] of URL_PATTERNS) {
    if (normalized === name || normalized.endsWith(`/${name}`)) {
      return pattern;
    }
  }
  throw new Error(`No URL extractor for ${file}`);
}

export function extractUrls(text, file) {
  const pattern = patternFor(file);
  const expression = new RegExp(pattern.source, pattern.flags);
  return [...text.matchAll(expression)].map((match) => match[1]);
}

export function uniqueUrls(urls) {
  return [...new Set(urls)];
}

export function isNpmHost(url) {
  const hostname = new URL(url).hostname;
  return hostname === 'npmjs.com' || hostname.endsWith('.npmjs.com');
}

function isGitHubHost(url) {
  const hostname = new URL(url).hostname;
  return hostname === 'github.com' || hostname.endsWith('.github.com');
}

export function classifyStatus(url, status) {
  if (status >= 200 && status < 300) {
    return 'ok';
  }
  if (isNpmHost(url) && (status === 403 || status === 429)) {
    return 'warn';
  }
  return 'fail';
}

export function shouldRetry(url, status) {
  if (status === 429 || status === 503) {
    return true;
  }
  return status === 403 && !isNpmHost(url);
}

export async function collectUrls(rootDir) {
  const found = [];
  for (const file of SOURCE_FILES) {
    const text = await readFile(path.join(rootDir, file), 'utf8');
    found.push(...extractUrls(text, file));
  }
  return uniqueUrls(found).sort();
}

function githubToken() {
  const token = process.env.GITHUB_TOKEN;
  return token ? token : undefined;
}

function redact(message) {
  const token = githubToken();
  if (!token) {
    return message;
  }
  return message.split(token).join('[redacted]');
}

async function fetchStatus(url) {
  const headers = {
    accept: 'text/html,application/xhtml+xml',
    'user-agent': USER_AGENT,
  };
  const token = githubToken();
  if (token && isGitHubHost(url)) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return response.status;
}

function delay(attempt) {
  return new Promise((resolve) => {
    setTimeout(resolve, attempt * 1000);
  });
}

export async function checkUrl(url) {
  let failure = { url, outcome: 'fail', error: 'unknown error' };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const status = await fetchStatus(url);
      if (shouldRetry(url, status) && attempt < MAX_ATTEMPTS) {
        await delay(attempt);
        continue;
      }
      return { url, outcome: classifyStatus(url, status), status };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failure = { url, outcome: 'fail', error: redact(message) };
      if (attempt < MAX_ATTEMPTS) {
        await delay(attempt);
      }
    }
  }

  return failure;
}

async function mapPool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]);
    }
  }

  const workers = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workers }, () => run()));
  return results;
}

export function formatResult(result) {
  if (result.outcome === 'ok') {
    return `ok   ${result.url}`;
  }
  if (result.outcome === 'warn') {
    return `warn ${result.url} (npm returned ${result.status}; automated clients may be blocked, verify in a browser)`;
  }
  const detail = result.status ?? result.error ?? 'unknown error';
  return `fail ${result.url} (${detail})`;
}

export async function checkLinks(rootDir = repoRoot) {
  const urls = await collectUrls(rootDir);
  return mapPool(urls, CONCURRENCY, (url) => checkUrl(url));
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(entry);
  } catch {
    return import.meta.url === pathToFileURL(entry).href;
  }
}

async function main() {
  const results = await checkLinks();
  for (const result of results) {
    console.log(formatResult(result));
  }

  const counts = { ok: 0, warn: 0, fail: 0 };
  for (const result of results) {
    counts[result.outcome] += 1;
  }
  console.log(
    `checked ${results.length}, ok ${counts.ok}, warn ${counts.warn}, fail ${counts.fail}`,
  );
  if (counts.fail > 0) {
    process.exitCode = 1;
  }
}

if (isDirectRun()) {
  await main();
}
