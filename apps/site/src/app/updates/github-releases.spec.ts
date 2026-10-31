import { OssProject } from '../projects/project.model';
import { PROJECTS } from '../projects/projects.data';
import {
  fetchLatestReleases,
  githubReleaseSources,
  GithubReleaseSource,
  GithubReleaseSummary,
  isReleaseFresh,
  latestFreshRelease,
  loadLatestFreshRelease,
  pickLatestRelease,
  RELEASE_FRESH_DAYS,
} from './github-releases';

const publishedAt = '2026-08-01T00:00:00.000Z';
const dayMs = 24 * 60 * 60 * 1000;
const exactly60DaysLater = new Date(
  Date.parse(publishedAt) + RELEASE_FRESH_DAYS * dayMs,
);
const justOver60DaysLater = new Date(exactly60DaysLater.getTime() + 1);

const projects: OssProject[] = [
  {
    id: 'web-serial-rxjs',
    name: 'web-serial-rxjs',
    category: 'library',
    description: 'Library',
    links: [
      {
        label: 'Documentation',
        url: 'https://gurezo.net/web-serial-rxjs/',
        kind: 'docs',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/gurezo/web-serial-rxjs',
        kind: 'github',
      },
    ],
  },
  {
    id: 'not-github',
    name: 'Not GitHub',
    category: 'web-app',
    description: 'Skipped',
    links: [
      {
        label: 'GitHub',
        url: 'https://example.com/gurezo/not-a-repo',
        kind: 'github',
      },
    ],
  },
  {
    id: 'mdn-translation-ja-mcp',
    name: 'mdn-translation-ja-mcp',
    category: 'tool',
    description: 'Tool',
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/gurezo/mdn-translation-ja-mcp/',
        kind: 'github',
      },
    ],
  },
];

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

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('githubReleaseSources', () => {
  it('keeps GitHub repository links and drops other URLs', () => {
    expect(githubReleaseSources(projects)).toEqual([
      {
        owner: 'gurezo',
        repo: 'web-serial-rxjs',
        projectName: 'web-serial-rxjs',
      },
      {
        owner: 'gurezo',
        repo: 'mdn-translation-ja-mcp',
        projectName: 'mdn-translation-ja-mcp',
      },
    ]);
  });

  it('reads the GitHub repositories linked from published projects', () => {
    expect(
      githubReleaseSources(PROJECTS).map(
        (source) => `${source.owner}/${source.repo}`,
      ),
    ).toEqual([
      'gurezo/web-serial-rxjs',
      'gurezo/mdn-translation-ja-mcp',
      'gurezo/chirimen-lite-console',
      'gurezo/chirimen-device-dashboard',
      'gurezo/chirimen-certified-devices',
    ]);
  });
});

describe('isReleaseFresh', () => {
  it('shows a release published exactly 60 days ago', () => {
    expect(isReleaseFresh(publishedAt, exactly60DaysLater)).toBe(true);
  });

  it('hides a release published more than 60 days ago', () => {
    expect(isReleaseFresh(publishedAt, justOver60DaysLater)).toBe(false);
  });

  it('hides an invalid published date', () => {
    expect(isReleaseFresh('not-a-date', exactly60DaysLater)).toBe(false);
  });
});

describe('pickLatestRelease', () => {
  it('chooses the release with the newest published_at', () => {
    const older = release({ publishedAt: '2026-07-01T00:00:00.000Z' });
    const newer = release({
      repo: 'mdn-translation-ja-mcp',
      publishedAt: '2026-09-01T00:00:00.000Z',
    });

    expect(pickLatestRelease([older, newer, older])).toBe(newer);
  });

  it('ignores releases with an invalid published date', () => {
    const valid = release();
    const invalid = release({ publishedAt: 'not-a-date' });

    expect(pickLatestRelease([invalid, valid])).toBe(valid);
    expect(pickLatestRelease([invalid])).toBeNull();
  });
});

describe('latestFreshRelease', () => {
  it('returns the newest release when it is still within 60 days', () => {
    const fresh = release();

    expect(latestFreshRelease([fresh], exactly60DaysLater)).toBe(fresh);
  });

  it('hides the band when the newest release is older than 60 days', () => {
    const newest = release();
    const older = release({
      repo: 'older',
      publishedAt: '2026-07-01T00:00:00.000Z',
    });

    expect(latestFreshRelease([newest, older], justOver60DaysLater)).toBeNull();
  });
});

describe('fetchLatestReleases', () => {
  const sources: GithubReleaseSource[] = [
    {
      owner: 'gurezo',
      repo: 'web-serial-rxjs',
      projectName: 'web-serial-rxjs',
    },
    {
      owner: 'gurezo',
      repo: 'mdn-translation-ja-mcp',
      projectName: 'mdn-translation-ja-mcp',
    },
    {
      owner: 'gurezo',
      repo: 'chirimen-lite-console',
      projectName: 'CHIRIMEN Lite Console',
    },
  ];

  it('skips 404 and network failures and keeps the successful releases', async () => {
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      if (url.endsWith('/gurezo/web-serial-rxjs/releases/latest')) {
        return jsonResponse({
          name: 'Release v4.2.1',
          tag_name: 'v4.2.1',
          published_at: '2026-10-30T13:08:06Z',
          html_url:
            'https://github.com/gurezo/web-serial-rxjs/releases/tag/v4.2.1',
        });
      }

      if (url.endsWith('/gurezo/mdn-translation-ja-mcp/releases/latest')) {
        return jsonResponse({ message: 'Not Found' }, 404);
      }

      throw new Error('network');
    };

    await expect(fetchLatestReleases(sources, fetchImpl)).resolves.toEqual([
      {
        projectName: 'web-serial-rxjs',
        owner: 'gurezo',
        repo: 'web-serial-rxjs',
        name: 'Release v4.2.1',
        tagName: 'v4.2.1',
        publishedAt: '2026-10-30T13:08:06Z',
        htmlUrl:
          'https://github.com/gurezo/web-serial-rxjs/releases/tag/v4.2.1',
      },
    ]);
  });

  it('falls back to the tag name and skips drafts', async () => {
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      if (url.includes('web-serial-rxjs')) {
        return jsonResponse({
          name: '   ',
          tag_name: 'v1.0.0',
          published_at: publishedAt,
          html_url:
            'https://github.com/gurezo/web-serial-rxjs/releases/tag/v1.0.0',
        });
      }

      if (url.includes('mdn-translation-ja-mcp')) {
        return jsonResponse({
          name: 'Draft',
          tag_name: 'v9.0.0',
          published_at: '2026-10-30T00:00:00Z',
          html_url:
            'https://github.com/gurezo/mdn-translation-ja-mcp/releases/tag/v9.0.0',
          draft: true,
        });
      }

      return jsonResponse({ message: 'Not Found' }, 404);
    };

    const releases = await fetchLatestReleases(sources, fetchImpl);

    expect(releases).toEqual([
      expect.objectContaining({
        repo: 'web-serial-rxjs',
        name: 'v1.0.0',
      }),
    ]);
  });
});

describe('loadLatestFreshRelease', () => {
  it('returns fallback when API fails but fallback is fresh', async () => {
    const fetchImpl: typeof fetch = async () => {
      throw new Error('offline');
    };

    // Use current time so fallback (2026-10-30) is fresh
    const currentDate = new Date('2026-10-31');
    const result = await loadLatestFreshRelease(projects, currentDate, fetchImpl);
    expect(result).not.toBeNull();
    expect(result?.projectName).toBe('web-serial-rxjs');
  });

  it('returns null when API fails and fallback is stale', async () => {
    const fetchImpl: typeof fetch = async () => {
      throw new Error('offline');
    };

    // Use date far in future so fallback is stale (>60 days old)
    const farFuture = new Date('2027-01-01');
    await expect(
      loadLatestFreshRelease(projects, farFuture, fetchImpl),
    ).resolves.toBeNull();
  });

  it('returns the newest fresh release across project repositories', async () => {
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      if (url.includes('web-serial-rxjs')) {
        return jsonResponse({
          name: 'Older',
          tag_name: 'v1.0.0',
          published_at: '2026-07-01T00:00:00.000Z',
          html_url:
            'https://github.com/gurezo/web-serial-rxjs/releases/tag/v1.0.0',
        });
      }

      if (url.includes('mdn-translation-ja-mcp')) {
        return jsonResponse({
          name: 'Newer',
          tag_name: 'v2.0.0',
          published_at: publishedAt,
          html_url:
            'https://github.com/gurezo/mdn-translation-ja-mcp/releases/tag/v2.0.0',
        });
      }

      return jsonResponse({ message: 'Not Found' }, 404);
    };

    await expect(
      loadLatestFreshRelease(projects, exactly60DaysLater, fetchImpl),
    ).resolves.toEqual(
      expect.objectContaining({
        projectName: 'mdn-translation-ja-mcp',
        name: 'Newer',
      }),
    );
  });
});
