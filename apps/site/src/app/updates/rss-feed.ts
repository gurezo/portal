import type { GithubReleaseSummary } from './github-releases';

export interface RssChannel {
  title: string;
  link: string;
  selfUrl: string;
  description: string;
}

export const GUREZO_RSS_CHANNEL: RssChannel = {
  title: 'gurezo.net updates',
  link: 'https://gurezo.net/updates',
  selfUrl: 'https://gurezo.net/rss.xml',
  description: 'Latest GitHub releases for projects on gurezo.net.',
};

export function renderRssFeed(
  releases: readonly GithubReleaseSummary[],
  channel: RssChannel = GUREZO_RSS_CHANNEL,
): string {
  const items = releases.map((release) => renderItem(release)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.link)}</link>
    <description>${escapeXml(channel.description)}</description>
    <atom:link href="${escapeXml(channel.selfUrl)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

function renderItem(release: GithubReleaseSummary): string {
  const title = `${release.projectName}: ${release.name}`;
  const link = escapeXml(release.htmlUrl);

  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${escapeXml(formatRfc822(release.publishedAt))}</pubDate>
    </item>`;
}

function formatRfc822(publishedAt: string): string {
  return new Date(publishedAt).toUTCString();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
