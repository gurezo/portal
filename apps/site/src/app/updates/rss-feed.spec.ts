import { GithubReleaseSummary } from './github-releases';
import { renderRssFeed } from './rss-feed';

const publishedAt = '2026-10-30T13:08:06Z';

function release(
  overrides: Partial<GithubReleaseSummary> = {},
): GithubReleaseSummary {
  return {
    projectName: 'web-serial-rxjs',
    owner: 'gurezo',
    repo: 'web-serial-rxjs',
    name: 'Release v4.2.1',
    tagName: 'v4.2.1',
    publishedAt,
    htmlUrl: 'https://github.com/gurezo/web-serial-rxjs/releases/tag/v4.2.1',
    ...overrides,
  };
}

describe('renderRssFeed', () => {
  it('renders an empty channel when there are no releases', () => {
    const xml = renderRssFeed([]);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<title>gurezo.net updates</title>');
    expect(xml).toContain('<link>https://gurezo.net/updates</link>');
    expect(xml).toContain(
      '<description>Latest GitHub releases for projects on gurezo.net.</description>',
    );
    expect(xml).toContain(
      '<atom:link href="https://gurezo.net/rss.xml" rel="self" type="application/rss+xml"/>',
    );
    expect(xml).not.toContain('<item>');
  });

  it('renders items in the given order with escaped text and an RFC 822 date', () => {
    const xml = renderRssFeed([
      release({
        projectName: 'A & B',
        name: 'Release <1>',
        htmlUrl: 'https://github.com/gurezo/web-serial-rxjs/releases/tag/v1',
      }),
      release({
        projectName: 'mdn-translation-ja-mcp',
        name: 'Older',
        publishedAt: '2026-07-01T00:00:00.000Z',
        htmlUrl:
          'https://github.com/gurezo/mdn-translation-ja-mcp/releases/tag/v0.1.0',
      }),
    ]);

    const first = xml.indexOf('A &amp; B: Release &lt;1&gt;');
    const second = xml.indexOf('mdn-translation-ja-mcp: Older');

    expect(first).toBeGreaterThan(-1);
    expect(second).toBeGreaterThan(first);
    expect(xml).toContain(
      '<link>https://github.com/gurezo/web-serial-rxjs/releases/tag/v1</link>',
    );
    expect(xml).toContain(
      '<guid>https://github.com/gurezo/web-serial-rxjs/releases/tag/v1</guid>',
    );
    expect(xml).toContain('<pubDate>Fri, 30 Oct 2026 13:08:06 GMT</pubDate>');
    expect(xml).toContain('<pubDate>Wed, 01 Jul 2026 00:00:00 GMT</pubDate>');
    expect(xml).not.toContain('A & B');
    expect(xml).not.toContain('Release <1>');
  });
});
