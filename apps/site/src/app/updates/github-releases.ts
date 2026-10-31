import { InjectionToken } from '@angular/core';
import { OssProject } from '../projects/project.model';
import { PROJECTS } from '../projects/projects.data';

export const RELEASE_FRESH_DAYS = 60;

const GITHUB_REPO_URL =
  /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface GithubReleaseSource {
  owner: string;
  repo: string;
  projectName: string;
}

export interface GithubReleaseSummary {
  projectName: string;
  owner: string;
  repo: string;
  name: string;
  tagName: string;
  publishedAt: string;
  htmlUrl: string;
}

interface GithubLatestReleaseResponse {
  name?: string | null;
  tag_name?: string;
  published_at?: string | null;
  html_url?: string;
  draft?: boolean;
  prerelease?: boolean;
}

export type LatestReleaseLoader = () => Promise<GithubReleaseSummary | null>;

export const LATEST_RELEASE_LOADER = new InjectionToken<LatestReleaseLoader>(
  'LATEST_RELEASE_LOADER',
  {
    factory: () => () => loadLatestFreshRelease(),
  },
);

export type ReleasesLoader = () => Promise<GithubReleaseSummary[]>;

export const RELEASES_LOADER = new InjectionToken<ReleasesLoader>(
  'RELEASES_LOADER',
  {
    factory: () => () => loadPublishedReleases(),
  },
);

export function githubReleaseSources(
  projects: readonly OssProject[],
): GithubReleaseSource[] {
  const sources: GithubReleaseSource[] = [];

  for (const project of projects) {
    for (const link of project.links) {
      if (link.kind !== 'github') {
        continue;
      }

      const match = GITHUB_REPO_URL.exec(link.url);
      if (!match) {
        continue;
      }

      sources.push({
        owner: match[1],
        repo: match[2],
        projectName: project.name,
      });
    }
  }

  return sources;
}

export function formatReleasePublishedAt(publishedAt: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(publishedAt));
}

export function isReleaseFresh(
  publishedAt: string,
  now: Date,
  days = RELEASE_FRESH_DAYS,
): boolean {
  const published = Date.parse(publishedAt);
  if (Number.isNaN(published)) {
    return false;
  }

  const ageMs = now.getTime() - published;
  return ageMs <= days * DAY_MS;
}

export function pickLatestRelease(
  releases: readonly GithubReleaseSummary[],
): GithubReleaseSummary | null {
  let latest: GithubReleaseSummary | null = null;
  let latestTime = Number.NEGATIVE_INFINITY;

  for (const release of releases) {
    const time = Date.parse(release.publishedAt);
    if (Number.isNaN(time) || time <= latestTime) {
      continue;
    }

    latest = release;
    latestTime = time;
  }

  return latest;
}

export function sortReleasesByPublishedAt(
  releases: readonly GithubReleaseSummary[],
): GithubReleaseSummary[] {
  return releases
    .filter((release) => !Number.isNaN(Date.parse(release.publishedAt)))
    .sort(
      (left, right) =>
        Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
    );
}

export function latestFreshRelease(
  releases: readonly GithubReleaseSummary[],
  now: Date,
  days = RELEASE_FRESH_DAYS,
): GithubReleaseSummary | null {
  const latest = pickLatestRelease(releases);
  if (!latest || !isReleaseFresh(latest.publishedAt, now, days)) {
    return null;
  }

  return latest;
}

export async function fetchLatestReleases(
  sources: readonly GithubReleaseSource[],
  fetchImpl: typeof fetch = fetch,
): Promise<GithubReleaseSummary[]> {
  const results = await Promise.all(
    sources.map((source) => fetchLatestRelease(source, fetchImpl)),
  );

  return results.filter((release): release is GithubReleaseSummary => {
    return release !== null;
  });
}

export async function loadLatestFreshRelease(
  projects: readonly OssProject[] = PROJECTS,
  now: Date = new Date(),
  fetchImpl: typeof fetch = fetch,
): Promise<GithubReleaseSummary | null> {
  const releases = await fetchLatestReleases(
    githubReleaseSources(projects),
    fetchImpl,
  );

  return latestFreshRelease(releases, now);
}

export async function loadPublishedReleases(
  projects: readonly OssProject[] = PROJECTS,
  fetchImpl: typeof fetch = fetch,
): Promise<GithubReleaseSummary[]> {
  const releases = await fetchLatestReleases(
    githubReleaseSources(projects),
    fetchImpl,
  );

  return sortReleasesByPublishedAt(releases);
}

async function fetchLatestRelease(
  source: GithubReleaseSource,
  fetchImpl: typeof fetch,
): Promise<GithubReleaseSummary | null> {
  const url = `https://api.github.com/repos/${encodeURIComponent(source.owner)}/${encodeURIComponent(source.repo)}/releases/latest`;

  try {
    const response = await fetchImpl(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      return null;
    }

    return toSummary(
      source,
      (await response.json()) as GithubLatestReleaseResponse,
    );
  } catch {
    return null;
  }
}

function toSummary(
  source: GithubReleaseSource,
  body: GithubLatestReleaseResponse,
): GithubReleaseSummary | null {
  if (body.draft || body.prerelease) {
    return null;
  }

  const tagName = body.tag_name?.trim();
  const publishedAt = body.published_at?.trim();
  const htmlUrl = body.html_url?.trim();
  if (!tagName || !publishedAt || !htmlUrl || !isHttpsUrl(htmlUrl)) {
    return null;
  }

  return {
    projectName: source.projectName,
    owner: source.owner,
    repo: source.repo,
    name: body.name?.trim() || tagName,
    tagName,
    publishedAt,
    htmlUrl,
  };
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}
