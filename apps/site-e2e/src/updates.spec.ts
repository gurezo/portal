import { expect, test, type Page } from '@playwright/test';

const releaseRepos = [
  'web-serial-rxjs',
  'mdn-translation-ja-mcp',
  'chirimen-lite-console',
  'chirimen-device-dashboard',
  'chirimen-certified-devices',
] as const;

const latestReleaseUrl =
  'https://github.com/gurezo/web-serial-rxjs/releases/tag/v4.2.1';

async function mockLatestReleases(page: Page, publishedAt: string) {
  await page.route(
    '**/api.github.com/repos/gurezo/*/releases/latest',
    async (route) => {
      const url = route.request().url();

      if (!url.includes('/gurezo/web-serial-rxjs/releases/latest')) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Not Found' }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'Release v4.2.1',
          tag_name: 'v4.2.1',
          published_at: publishedAt,
          html_url: latestReleaseUrl,
          draft: false,
          prerelease: false,
        }),
      });
    },
  );
}

async function openPath(page: Page, path: string) {
  const releasesLoaded = Promise.all(
    releaseRepos.map((repo) =>
      page.waitForResponse((response) =>
        response.url().includes(`/repos/gurezo/${repo}/releases/latest`),
      ),
    ),
  );

  await page.goto(path);
  await releasesLoaded;
}

test.describe('Updates', () => {
  test('lists a release older than 60 days while the home band stays hidden', async ({
    page,
  }) => {
    const publishedAt = new Date(
      Date.now() - 61 * 24 * 60 * 60 * 1000,
    ).toISOString();

    await mockLatestReleases(page, publishedAt);
    await openPath(page, '/');
    await expect(page.getByRole('heading', { name: "What's new" })).toHaveCount(
      0,
    );

    await openPath(page, '/updates');

    const updates = page.getByRole('region', { name: 'Updates' });
    const link = updates.getByRole('link', {
      name: 'web-serial-rxjs Release v4.2.1 (opens in a new tab)',
    });
    const navigation = page.getByRole('navigation', {
      name: 'Main navigation',
    });

    await expect(
      page.getByRole('heading', { level: 1, name: 'Updates' }),
    ).toBeVisible();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', latestReleaseUrl);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(updates.getByRole('link', { name: 'RSS' })).toHaveAttribute(
      'href',
      '/rss.xml',
    );
    await expect(navigation).not.toContainText('Updates');
    await expect(navigation).not.toContainText('更新情報');
  });

  test('shows an empty state when every repository has no release', async ({
    page,
  }) => {
    await page.route(
      '**/api.github.com/repos/gurezo/*/releases/latest',
      async (route) => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Not Found' }),
        });
      },
    );

    await openPath(page, '/updates');

    const updates = page.getByRole('region', { name: 'Updates' });

    await expect(
      updates.getByText('No releases are available right now.'),
    ).toBeVisible();
    await expect(updates.getByRole('link', { name: 'RSS' })).toHaveAttribute(
      'href',
      '/rss.xml',
    );
    await expect(
      updates.getByRole('link', { name: /opens in a new tab/ }),
    ).toHaveCount(0);
  });
});
