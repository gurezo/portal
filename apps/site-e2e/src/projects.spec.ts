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
    name: 'CHIRIMEN Lite Console Open App (opens in a new tab)',
    href: 'https://chirimen-lite-console.web.app/',
  },
  {
    region: 'CHIRIMEN Tools',
    name: 'CHIRIMEN Lite Console GitHub (opens in a new tab)',
    href: 'https://github.com/gurezo/chirimen-lite-console',
  },
  {
    region: 'CHIRIMEN Tools',
    name: 'CHIRIMEN Device Dashboard Open App (opens in a new tab)',
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
  const cardOverflows = await page.locator('app-project-card').evaluateAll(
    (cards) => cards.map((card) => card.scrollWidth - card.clientWidth),
  );

  expect(pageOverflow).toBeLessThanOrEqual(1);
  expect(Math.max(...cardOverflows)).toBeLessThanOrEqual(1);
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
    ]);

    const developerTools = page.getByRole('region', { name: 'Developer Tools' });

    await expect(
      developerTools.getByRole('heading', {
        level: 4,
        name: 'mdn-translation-ja-mcp',
      }),
    ).toBeVisible();
    await expect(developerTools).toContainText(
      'An MCP server that assists Japanese MDN translation, synchronization, and review.',
    );
    await expect(developerTools.getByText('Tool', { exact: true })).toBeVisible();
    await expect(developerTools.getByText('TypeScript', { exact: true })).toBeVisible();
    await expect(developerTools.getByText('MCP', { exact: true })).toBeVisible();
    await expect(developerTools.getByText('MDN', { exact: true })).toBeVisible();
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
