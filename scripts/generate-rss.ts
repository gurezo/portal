import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadPublishedReleases,
  type GithubReleaseSummary,
} from '../apps/site/src/app/updates/github-releases';
import { renderRssFeed } from '../apps/site/src/app/updates/rss-feed';

const outputPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../apps/site/public/rss.xml',
);

async function main(): Promise<void> {
  let releases: GithubReleaseSummary[] = [];

  try {
    releases = await loadPublishedReleases();
  } catch (error) {
    console.warn(
      'Could not load GitHub releases for RSS. Writing an empty feed.',
      error,
    );
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderRssFeed(releases), 'utf8');
  console.log(`Wrote ${releases.length} release(s) to ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
