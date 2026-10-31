import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  classifyStatus,
  collectUrls,
  extractUrls,
  formatResult,
  shouldRetry,
  uniqueUrls,
} from './check-external-links.mjs';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const PROJECTS_FILE = 'apps/site/src/app/projects/projects.data.ts';
const HTML_FILE = 'apps/site/src/app/app.html';
const README_FILE = 'README.md';
const NPM_URL = 'https://www.npmjs.com/package/@gurezo/web-serial-rxjs';

describe('extractUrls', () => {
  it('reads project card url fields and ignores other text', () => {
    const text = `
      links: [
        { label: 'Documentation', url: 'https://gurezo.net/web-serial-rxjs/', kind: 'docs' },
        { label: 'npm', url: '${NPM_URL}', kind: 'npm' },
      ],
      note: 'see https://example.test/ignored',
    `;

    assert.deepEqual(extractUrls(text, PROJECTS_FILE), [
      'https://gurezo.net/web-serial-rxjs/',
      NPM_URL,
    ]);
  });

  it('reads https hrefs from the page and skips relative links', () => {
    const text = `
      <a href="/">home</a>
      <a href="#projects-heading">Projects</a>
      <a href="https://github.com/gurezo">GitHub</a>
      <a href="https://lifewood.net/">lifewood.net</a>
    `;

    assert.deepEqual(extractUrls(text, HTML_FILE), [
      'https://github.com/gurezo',
      'https://lifewood.net/',
    ]);
  });

  it('reads markdown links from the README', () => {
    const text = `
      See [Nx](https://nx.dev) and [docs](https://gurezo.net/web-serial-rxjs/).
      Not a link: https://example.test/bare
    `;

    assert.deepEqual(extractUrls(text, README_FILE), [
      'https://nx.dev',
      'https://gurezo.net/web-serial-rxjs/',
    ]);
  });
});

describe('uniqueUrls', () => {
  it('drops duplicate URLs and keeps the first occurrence', () => {
    assert.deepEqual(
      uniqueUrls([
        'https://github.com/gurezo',
        'https://gurezo.net/',
        'https://github.com/gurezo',
      ]),
      ['https://github.com/gurezo', 'https://gurezo.net/'],
    );
  });
});

describe('classifyStatus', () => {
  it('accepts final 2xx responses', () => {
    const url = 'https://gurezo.net/web-serial-rxjs/';
    assert.equal(classifyStatus(url, 200), 'ok');
    assert.equal(classifyStatus(url, 204), 'ok');
    assert.equal(classifyStatus(url, 299), 'ok');
  });

  it('warns when npm responds 403 or 429', () => {
    assert.equal(classifyStatus(NPM_URL, 403), 'warn');
    assert.equal(classifyStatus(NPM_URL, 429), 'warn');
    assert.equal(
      classifyStatus('https://npmjs.com/package/example', 403),
      'warn',
    );
  });

  it('fails npm 404 and other client errors', () => {
    assert.equal(classifyStatus(NPM_URL, 404), 'fail');
    assert.equal(classifyStatus('https://github.com/gurezo', 404), 'fail');
    assert.equal(classifyStatus('https://github.com/gurezo', 403), 'fail');
    assert.equal(
      classifyStatus('https://chirimen-lite-console.web.app/', 500),
      'fail',
    );
  });
});

describe('shouldRetry', () => {
  it('retries rate limits and non-npm 403, and not npm 403 or 404', () => {
    assert.equal(shouldRetry('https://github.com/gurezo', 403), true);
    assert.equal(shouldRetry('https://github.com/gurezo', 429), true);
    assert.equal(shouldRetry(NPM_URL, 429), true);
    assert.equal(shouldRetry('https://gurezo.net/', 503), true);
    assert.equal(shouldRetry(NPM_URL, 403), false);
    assert.equal(shouldRetry('https://github.com/gurezo', 404), false);
  });
});

describe('formatResult', () => {
  it('asks for a manual check on npm warnings', () => {
    const line = formatResult({
      url: NPM_URL,
      outcome: 'warn',
      status: 403,
    });
    assert.match(line, /^warn /);
    assert.match(line, /verify in a browser/);
    assert.equal(line.includes('403'), true);
  });
});

describe('collectUrls', () => {
  it('collects published https URLs from the three sources without duplicates', async () => {
    const urls = await collectUrls(repoRoot);

    assert.ok(urls.includes('https://gurezo.net/web-serial-rxjs/'));
    assert.ok(urls.includes(NPM_URL));
    assert.ok(urls.includes('https://lifewood.net/'));
    assert.ok(urls.includes('https://github.com/gurezo/portal/issues'));
    assert.ok(urls.includes('https://nx.dev'));
    assert.equal(new Set(urls).size, urls.length);
    assert.ok(urls.every((url) => url.startsWith('https://')));
    assert.equal(
      urls.some((url) => url.includes('example.test')),
      false,
    );
  });
});
