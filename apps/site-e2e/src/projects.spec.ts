import { expect, test, type Page } from '@playwright/test';

const viewports = [
  { width: 320, height: 800 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
] as const;

const publishedLinks = [
  {
    region: 'Libraries',
    name: 'web-serial-rxjs Documentation (opens in a new tab)',
    href: 'https://gurezo.net/web-serial-rxjs/',
  },
  {
    region: 'Libraries',
    name: 'web-serial-rxjs Examples (opens in a new tab)',
    href: 'https://gurezo.net/web-serial-rxjs/examples/',
  },
  {
    region: 'Libraries',
    name: 'web-serial-rxjs GitHub (opens in a new tab)',
    href: 'https://github.com/gurezo/web-serial-rxjs',
  },
  {
    region: 'Libraries',
    name: 'web-serial-rxjs npm (opens in a new tab)',
    href: 'https://www.npmjs.com/package/@gurezo/web-serial-rxjs',
  },
  {
    region: 'Developer Tools',
    name: 'mdn-translation-ja-mcp Documentation (opens in a new tab)',
    href: 'https://gurezo.net/mdn-translation-ja-mcp/',
  },
  {
    region: 'Developer Tools',
    name: 'mdn-translation-ja-mcp GitHub (opens in a new tab)',
    href: 'https://github.com/gurezo/mdn-translation-ja-mcp',
  },
  {
    region: 'CHIRIMEN Tools',
    name: 'CHIRIMEN Lite Console App (opens in a new tab)',
    href: 'https://chirimen-lite-console.web.app/',
  },
  {
    region: 'CHIRIMEN Tools',
    name: 'CHIRIMEN Lite Console GitHub (opens in a new tab)',
    href: 'https://github.com/gurezo/chirimen-lite-console',
  },
  {
    region: 'CHIRIMEN Tools',
    name: 'CHIRIMEN Device Dashboard App (opens in a new tab)',
    href: 'https://chirimen-device-dashboard.web.app/',
  },
  {
    region: 'CHIRIMEN Tools',
    name: 'CHIRIMEN Device Dashboard GitHub (opens in a new tab)',
    href: 'https://github.com/gurezo/chirimen-device-dashboard',
  },
  {
    region: 'CHIRIMEN Tools',
    name: 'CHIRIMEN Certified Devices GitHub (opens in a new tab)',
    href: 'https://github.com/gurezo/chirimen-certified-devices',
  },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const pageOverflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  const cardOverflows = await page
    .locator('app-project-card')
    .evaluateAll((cards) =>
      cards.map((card) => card.scrollWidth - card.clientWidth),
    );

  expect(pageOverflow).toBeLessThanOrEqual(1);
  expect(Math.max(...cardOverflows)).toBeLessThanOrEqual(1);
}

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

async function openHome(page: Page) {
  const releasesLoaded = Promise.all(
    releaseRepos.map((repo) =>
      page.waitForResponse((response) =>
        response.url().includes(`/repos/gurezo/${repo}/releases/latest`),
      ),
    ),
  );

  await page.goto('/');
  await releasesLoaded;
}

async function focusFirstProjectLink(page: Page, browserName: string) {
  // macOS WebKit follows the system setting that skips links on Tab.
  // Option-Tab (Alt+Tab) moves through links there. Other browsers use Tab.
  const key = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

  for (let attempt = 0; attempt < 30; attempt += 1) {
    await page.keyboard.press(key);

    const reached = await page.evaluate(
      () =>
        document.activeElement?.tagName === 'A' &&
        Boolean(document.activeElement.closest('app-project-card')),
    );

    if (reached) {
      return;
    }
  }

  throw new Error('Tab did not reach a project card link');
}

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await mockLatestReleases(page, '2000-01-01T00:00:00.000Z');
  });

  test('shows three groups and the MCP card links', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 3 })).toHaveText([
      'Libraries',
      'Developer Tools',
      'CHIRIMEN Tools',
    ]);

    const headings = await page.locator('h1, h2, h3, h4').evaluateAll((nodes) =>
      nodes.map((node) => ({
        tag: node.tagName,
        text: (node.textContent ?? '').replace(/\s+/g, ' ').trim(),
      })),
    );

    expect(headings).toEqual([
      {
        tag: 'H1',
        text: 'Documentation and demos for OSS projects.',
      },
      { tag: 'H2', text: 'Projects' },
      { tag: 'H3', text: 'Libraries' },
      { tag: 'H4', text: 'web-serial-rxjs' },
      { tag: 'H3', text: 'Developer Tools' },
      { tag: 'H4', text: 'mdn-translation-ja-mcp' },
      { tag: 'H3', text: 'CHIRIMEN Tools' },
      { tag: 'H4', text: 'CHIRIMEN Lite Console' },
      { tag: 'H4', text: 'CHIRIMEN Device Dashboard' },
      { tag: 'H4', text: 'CHIRIMEN Certified Devices' },
      { tag: 'H2', text: 'Get involved' },
    ]);

    const developerTools = page.getByRole('region', {
      name: 'Developer Tools',
    });

    await expect(
      developerTools.getByRole('heading', {
        level: 4,
        name: 'mdn-translation-ja-mcp',
      }),
    ).toBeVisible();
    await expect(developerTools).toContainText(
      'An MCP server that assists Japanese MDN translation, synchronization, and review.',
    );
    await expect(
      developerTools.getByText('Tool', { exact: true }),
    ).toBeVisible();
    await expect(
      developerTools.getByText('TypeScript', { exact: true }),
    ).toBeVisible();
    await expect(
      developerTools.getByText('MCP', { exact: true }),
    ).toBeVisible();
    await expect(
      developerTools.getByText('MDN', { exact: true }),
    ).toBeVisible();
    await expect(developerTools).not.toContainText('Coming later');
    await expect(developerTools).not.toContainText('Open App');

    for (const link of publishedLinks) {
      const anchor = page
        .getByRole('region', { name: link.region })
        .getByRole('link', { name: link.name });

      await expect(anchor).toHaveAttribute('href', link.href);
      await expect(anchor).toHaveAttribute('target', '_blank');
      await expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
    }

    await expect(page.locator('a[href*="devices.json"]')).toHaveCount(0);
  });

  for (const viewport of viewports) {
    test(`keeps cards inside the viewport at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ ...viewport });
      await page.goto('/');

      await expect(page.locator('app-project-card')).toHaveCount(5);
      await expectNoHorizontalOverflow(page);
    });
  }

  test('reaches project links with the keyboard and shows a focus ring', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');
    await focusFirstProjectLink(page, browserName);

    const focus = await page.evaluate(() => {
      const active = document.activeElement;

      if (!(active instanceof HTMLAnchorElement)) {
        return null;
      }

      const style = getComputedStyle(active);
      const outlineWidth = Number.parseFloat(style.outlineWidth);

      return {
        name: active.getAttribute('aria-label'),
        boxShadow: style.boxShadow,
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.isFinite(outlineWidth) ? outlineWidth : 0,
      };
    });

    expect(focus?.name).toMatch(/ \(opens in a new tab\)$/);
    expect(
      focus?.boxShadow !== 'none' ||
        (focus?.outlineStyle !== 'none' && (focus?.outlineWidth ?? 0) > 0),
    ).toBe(true);
  });
});

test.describe("What's new", () => {
  test('shows the latest release between the hero and Projects', async ({
    page,
  }) => {
    await mockLatestReleases(page, new Date().toISOString());
    await openHome(page);

    const band = page.getByRole('region', { name: "What's new" });
    const link = band.getByRole('link', {
      name: 'web-serial-rxjs Release v4.2.1 (opens in a new tab)',
    });
    const navigation = page.getByRole('navigation', {
      name: 'Main navigation',
    });

    await expect(
      band.getByRole('heading', { level: 2, name: "What's new" }),
    ).toBeVisible();
    await expect(band).toContainText('Release v4.2.1');
    await expect(band).toContainText('web-serial-rxjs');
    await expect(link).toHaveAttribute('href', latestReleaseUrl);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(navigation).not.toContainText('Updates');
    await expect(navigation).not.toContainText('更新情報');

    const order = await page.evaluate(() => {
      const hero = document.querySelector('h1')?.closest('section');
      const bandSection = document
        .querySelector('#whats-new-heading')
        ?.closest('section');
      const projects = document
        .querySelector('#projects-heading')
        ?.closest('section');

      if (!hero || !bandSection || !projects) {
        return false;
      }

      const follows = Node.DOCUMENT_POSITION_FOLLOWING;

      return (
        !hero.contains(bandSection) &&
        Boolean(hero.compareDocumentPosition(bandSection) & follows) &&
        Boolean(bandSection.compareDocumentPosition(projects) & follows)
      );
    });

    expect(order).toBe(true);
  });

  test('hides the band when the latest release is older than 60 days', async ({
    page,
  }) => {
    const publishedAt = new Date(
      Date.now() - 61 * 24 * 60 * 60 * 1000,
    ).toISOString();

    await mockLatestReleases(page, publishedAt);
    await openHome(page);

    await expect(page.getByRole('heading', { name: "What's new" })).toHaveCount(
      0,
    );
    await expect(
      page.getByRole('navigation', { name: 'Main navigation' }),
    ).not.toContainText('Updates');
    await expect(
      page.getByRole('heading', { level: 2, name: 'Projects' }),
    ).toBeVisible();
  });
});
