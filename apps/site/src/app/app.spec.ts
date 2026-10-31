import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';
import { PROJECTS } from './projects/projects.data';
import { projectLink } from './projects/projects.util';
import {
  GithubReleaseSummary,
  LATEST_RELEASE_LOADER,
  LatestReleaseLoader,
  RELEASES_LOADER,
} from './updates/github-releases';

const freshRelease: GithubReleaseSummary = {
  projectName: 'web-serial-rxjs',
  owner: 'gurezo',
  repo: 'web-serial-rxjs',
  name: 'Release v4.2.1',
  tagName: 'v4.2.1',
  publishedAt: '2026-10-30T13:08:06Z',
  htmlUrl: 'https://github.com/gurezo/web-serial-rxjs/releases/tag/v4.2.1',
};

async function configureApp(loader: LatestReleaseLoader) {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [App],
    providers: [
      provideRouter(appRoutes),
      provideLocationMocks(),
      {
        provide: LATEST_RELEASE_LOADER,
        useValue: loader,
      },
      {
        provide: RELEASES_LOADER,
        useValue: async () => [],
      },
    ],
  }).compileComponents();
}

async function renderApp() {
  const fixture = TestBed.createComponent(App);
  const router = TestBed.inject(Router);
  fixture.detectChanges();
  await router.navigateByUrl('/');
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('App', () => {
  beforeEach(async () => {
    await configureApp(async () => null);
  });

  it('should have the configured title', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance['title']).toBe('gurezo portal site');
  });

  it('renders header navigation with Logo, Projects, and GitHub links', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const nav = header?.querySelector('nav[aria-label="Main navigation"]');
    const logoLink = header?.querySelector('a[href="/"]');
    const projectsLink = nav?.querySelector('a[href="/#projects-heading"]');
    const updatesLink = nav?.querySelector('a[href="/updates"]');
    const githubLink = nav?.querySelector(
      'a[href="https://github.com/gurezo"]',
    );

    expect(header).not.toBeNull();
    expect(nav).not.toBeNull();
    expect(logoLink?.textContent?.trim()).toBe('gurezo.net');
    expect(logoLink?.getAttribute('aria-label')).toBe('gurezo.net home');
    expect(projectsLink?.textContent?.trim()).toBe('Projects');
    expect(updatesLink?.textContent?.trim()).toBe('Updates');
    expect(updatesLink?.getAttribute('aria-current')).toBeNull();
    expect(githubLink?.textContent?.trim()).toBe('GitHub');
    expect(githubLink?.getAttribute('target')).toBe('_blank');
    expect(githubLink?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(githubLink?.getAttribute('aria-label')).toBe(
      'GitHub (opens in a new tab)',
    );
    expect(nav?.textContent).toContain('Updates');
    expect(nav?.textContent).not.toContain('更新情報');
  });

  it('describes the portal in Hero and links to Projects', async () => {
    const compiled = await renderApp();
    const hero = compiled.querySelector('section');
    const browseProjects = hero?.querySelector(
      'a[href="/#projects-heading"]',
    );

    const heroText = hero?.textContent?.replace(/\s+/g, ' ') ?? '';

    expect(heroText).toContain('gurezo.net');
    expect(heroText).toContain(
      'This domain hosts open-source documentation, runnable examples, and demo applications by gurezo.',
    );
    expect(heroText).not.toContain('Current focus');
    expect(heroText).not.toContain('view web-serial-rxjs');
    expect(hero?.querySelector('aside')).toBeNull();
    expect(hero?.className).not.toContain('lg:grid-cols-');
    expect(browseProjects?.textContent?.trim()).toBe('Browse projects');
    expect(
      compiled.querySelector('footer a[href="https://lifewood.net/"]')
        ?.textContent,
    ).toContain('lifewood.net');
  });

  it('renders project metadata instead of hardcoded listing copy', async () => {
    const compiled = await renderApp();
    const webSerialRxjs = PROJECTS.find(
      (project) => project.id === 'web-serial-rxjs',
    );
    const docsLink = webSerialRxjs
      ? projectLink(webSerialRxjs, 'docs')
      : undefined;
    const githubLink = webSerialRxjs?.links.find(
      (link) => link.kind === 'github',
    );
    const librariesCard = compiled.querySelector(
      '[aria-labelledby="libraries-heading"] app-project-card',
    );

    expect(webSerialRxjs).toBeDefined();
    expect(docsLink).toBeDefined();
    expect(githubLink).toBeDefined();
    expect(librariesCard?.textContent).toContain(webSerialRxjs?.name ?? '');
    expect(librariesCard?.textContent).toContain(
      webSerialRxjs?.description ?? '',
    );
    expect(
      librariesCard?.querySelector(`a[href="${docsLink?.url}"]`)?.textContent,
    ).toContain('Documentation');
    expect(
      librariesCard?.querySelector(`a[href="${githubLink?.url}"]`)?.textContent,
    ).toContain('GitHub');
  });

  it('renders Libraries, Developer Tools, and CHIRIMEN Tools as separate groups', async () => {
    const compiled = await renderApp();
    const libraries = compiled.querySelector(
      '[aria-labelledby="libraries-heading"]',
    );
    const developerTools = compiled.querySelector(
      '[aria-labelledby="developer-tools-heading"]',
    );
    const chirimenTools = compiled.querySelector(
      '[aria-labelledby="chirimen-tools-heading"]',
    );
    const librariesHeading = compiled.querySelector('#libraries-heading');
    const developerToolsHeading = compiled.querySelector(
      '#developer-tools-heading',
    );
    const chirimenHeading = compiled.querySelector('#chirimen-tools-heading');

    expect(librariesHeading?.textContent?.trim()).toBe('Libraries');
    expect(developerToolsHeading?.textContent?.trim()).toBe('Developer Tools');
    expect(chirimenHeading?.textContent?.trim()).toBe('CHIRIMEN Tools');
    expect(librariesHeading?.nextElementSibling?.textContent?.trim()).toBe(
      'Reusable libraries and documentation on this domain.',
    );
    expect(developerToolsHeading?.nextElementSibling?.textContent?.trim()).toBe(
      'Tools that support development workflows.',
    );
    expect(chirimenHeading?.nextElementSibling?.textContent?.trim()).toBe(
      'Browser tools and device data.',
    );
    expect(chirimenHeading?.nextElementSibling?.textContent).not.toMatch(
      /CHIRIMEN/i,
    );
    expect(libraries?.textContent).toContain('web-serial-rxjs');
    expect(libraries?.textContent).not.toContain('Coming later');
    expect(developerTools?.querySelectorAll('app-project-card')).toHaveLength(
      1,
    );
    expect(developerTools?.textContent).toContain('mdn-translation-ja-mcp');
    expect(developerTools?.textContent).toContain(
      'An MCP server that assists Japanese MDN translation, synchronization, and review.',
    );
    expect(developerTools?.textContent).toContain('Tool');
    expect(developerTools?.textContent).toContain('TypeScript');
    expect(developerTools?.textContent).toContain('MCP');
    expect(developerTools?.textContent).toContain('MDN');
    expect(developerTools?.textContent).not.toContain('Coming later');
    expect(developerTools?.textContent).not.toContain('App');
    expect(developerTools?.textContent).toContain('Documentation');
    expect(
      developerTools?.querySelector(
        'a[href="https://gurezo.net/mdn-translation-ja-mcp/"]',
      )?.textContent,
    ).toContain('Documentation');
    expect(
      developerTools?.querySelector(
        'a[href="https://github.com/gurezo/mdn-translation-ja-mcp"]',
      )?.textContent,
    ).toContain('GitHub');
    expect(libraries?.textContent).not.toContain('CHIRIMEN Lite Console');
    expect(libraries?.textContent).not.toContain('CHIRIMEN Device Dashboard');
    expect(libraries?.textContent).not.toContain('CHIRIMEN Certified Devices');
    expect(chirimenTools?.textContent).toContain('CHIRIMEN Lite Console');
    expect(chirimenTools?.textContent).toContain('CHIRIMEN Device Dashboard');
    expect(chirimenTools?.textContent).toContain('CHIRIMEN Certified Devices');
    expect(chirimenTools?.textContent).toContain('Web Application');
    expect(chirimenTools?.textContent).toContain('Data Repository');
    expect(chirimenTools?.textContent).toContain(
      'Search and browse CHIRIMEN-supported devices.',
    );
    expect(chirimenTools?.textContent).toContain(
      'Device metadata, examples, drivers, images, schematics',
    );
    expect(chirimenTools?.textContent).not.toContain('Coming later');
    expect(chirimenTools?.querySelectorAll('app-project-card')).toHaveLength(3);
    expect(
      chirimenTools?.querySelector(
        'a[href="https://chirimen-lite-console.web.app/"]',
      )?.textContent,
    ).toContain('App');
    expect(
      chirimenTools?.querySelector(
        'a[href="https://github.com/gurezo/chirimen-lite-console"]',
      )?.textContent,
    ).toContain('GitHub');
    expect(
      chirimenTools?.querySelector(
        'a[href="https://chirimen-device-dashboard.web.app/"]',
      )?.textContent,
    ).toContain('App');
    expect(
      chirimenTools?.querySelector(
        'a[href="https://github.com/gurezo/chirimen-device-dashboard"]',
      )?.textContent,
    ).toContain('GitHub');
    expect(
      chirimenTools?.querySelector(
        'a[href="https://github.com/gurezo/chirimen-certified-devices"]',
      )?.textContent,
    ).toContain('GitHub');
    expect(
      chirimenTools?.querySelector(
        'a[href="https://github.com/gurezo/chirimen-certified-devices/blob/main/generated/devices.json"]',
      ),
    ).toBeNull();
  });

  it('keeps a heading hierarchy of one h1, group h3s, and card h4s', async () => {
    const compiled = await renderApp();
    const headings = Array.from(
      compiled.querySelectorAll('h1, h2, h3, h4'),
    ).map((heading) => ({
      tag: heading.tagName,
      text: heading.textContent?.replace(/\s+/g, ' ').trim(),
    }));

    expect(compiled.querySelectorAll('h1')).toHaveLength(1);
    expect(compiled.querySelectorAll('h2')).toHaveLength(2);
    expect(headings).toEqual(
      expect.arrayContaining([
        {
          tag: 'H1',
          text: 'Documentation and demos for OSS projects.',
        },
        { tag: 'H2', text: 'Projects' },
        { tag: 'H2', text: 'Get involved' },
        { tag: 'H3', text: 'Libraries' },
        { tag: 'H3', text: 'Developer Tools' },
        { tag: 'H3', text: 'CHIRIMEN Tools' },
        { tag: 'H4', text: 'web-serial-rxjs' },
        { tag: 'H4', text: 'mdn-translation-ja-mcp' },
        { tag: 'H4', text: 'CHIRIMEN Lite Console' },
        { tag: 'H4', text: 'CHIRIMEN Device Dashboard' },
        { tag: 'H4', text: 'CHIRIMEN Certified Devices' },
      ]),
    );
    expect(headings).not.toContainEqual({
      tag: 'H2',
      text: 'Available resources',
    });
    expect(headings).not.toContainEqual({
      tag: 'H2',
      text: '@gurezo/web-serial-rxjs',
    });
    expect(
      headings.filter((heading) => heading.text === 'CHIRIMEN Tools'),
    ).toEqual([{ tag: 'H3', text: 'CHIRIMEN Tools' }]);
    expect(compiled.querySelectorAll('app-project-card h3')).toHaveLength(0);
    expect(compiled.querySelectorAll('app-project-card h4')).toHaveLength(5);
    expect(compiled.querySelector('#projects-heading')?.tagName).toBe('H2');
    expect(compiled.querySelector('#get-involved-heading')?.tagName).toBe('H2');
    expect(compiled.querySelector('#libraries-heading')?.tagName).toBe('H3');
    expect(compiled.querySelector('#developer-tools-heading')?.tagName).toBe(
      'H3',
    );
    expect(compiled.querySelector('#chirimen-tools-heading')?.tagName).toBe(
      'H3',
    );
    expect(
      Array.from(compiled.querySelectorAll('h3')).map((heading) =>
        heading.textContent?.trim(),
      ),
    ).toEqual(['Libraries', 'Developer Tools', 'CHIRIMEN Tools']);

    const projectsHeading = compiled.querySelector('#projects-heading');
    const projectsLead = projectsHeading?.nextElementSibling;

    expect(projectsLead?.textContent?.trim()).toBe(
      'Open-source libraries, apps, and data linked from this domain.',
    );
    expect(projectsLead?.textContent).not.toMatch(/CHIRIMEN/i);
  });

  it('exposes published project links with unique labels and visible focus', async () => {
    const compiled = await renderApp();
    const webSerialRxjs = PROJECTS.find(
      (project) => project.id === 'web-serial-rxjs',
    );
    const docsLink = webSerialRxjs
      ? projectLink(webSerialRxjs, 'docs')
      : undefined;
    const publishedHrefs = [
      'https://gurezo.net/web-serial-rxjs/',
      'https://gurezo.net/web-serial-rxjs/examples/',
      'https://github.com/gurezo/web-serial-rxjs',
      'https://www.npmjs.com/package/@gurezo/web-serial-rxjs',
      'https://github.com/gurezo/chirimen-lite-console',
      'https://chirimen-lite-console.web.app/',
      'https://github.com/gurezo/chirimen-device-dashboard',
      'https://chirimen-device-dashboard.web.app/',
      'https://github.com/gurezo/chirimen-certified-devices',
      'https://gurezo.net/mdn-translation-ja-mcp/',
      'https://github.com/gurezo/mdn-translation-ja-mcp',
    ];

    expect(docsLink?.url).toBe('https://gurezo.net/web-serial-rxjs/');
    expect(
      compiled.querySelector(`app-project-card a[href="${docsLink?.url}"]`)
        ?.textContent,
    ).toContain('Documentation');
    expect(
      compiled.querySelector('footer a[href="https://github.com/gurezo"]')
        ?.textContent,
    ).toContain('GitHub');

    for (const href of publishedHrefs) {
      const cardLink = compiled.querySelector(
        `app-project-card a[href="${href}"]`,
      );

      expect(cardLink).not.toBeNull();
      expect(cardLink?.getAttribute('target')).toBe('_blank');
      expect(cardLink?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(cardLink?.className).toContain('focus:ring-2');
      expect(cardLink?.className).toContain('break-words');
      expect(cardLink?.getAttribute('aria-label')).toMatch(
        / \(opens in a new tab\)$/,
      );
    }

    const footerLinks = compiled.querySelectorAll('footer a');

    expect(footerLinks.length).toBeGreaterThan(0);
    footerLinks.forEach((link) => {
      expect(link.className).toContain('focus:ring-2');
      expect(link.className).toContain('focus:ring-sky-400');
    });

    expect(
      compiled.querySelector(
        'a[href="https://github.com/gurezo/chirimen-certified-devices/blob/main/generated/devices.json"]',
      ),
    ).toBeNull();
    expect(
      compiled
        .querySelector('#libraries-heading')
        ?.closest('section')
        ?.querySelector('.grid')?.className,
    ).toContain('min-w-0');
  });

  it('keeps Hero readable width while Projects uses a wider responsive grid', async () => {
    const compiled = await renderApp();
    const shell = compiled.querySelector('main > div:not([aria-hidden])');
    const hero = compiled.querySelector('section');
    const heading = hero?.querySelector('h1');
    const lead = heading?.nextElementSibling;
    const librariesGrid = compiled
      .querySelector('#libraries-heading')
      ?.closest('section')
      ?.querySelector('.grid');
    const developerToolsGrid = compiled
      .querySelector('#developer-tools-heading')
      ?.closest('section')
      ?.querySelector('.grid');
    const chirimenGrid = compiled
      .querySelector('#chirimen-tools-heading')
      ?.closest('section')
      ?.querySelector('.grid');
    const footer = compiled.querySelector('footer');

    expect(shell?.className).toContain('max-w-screen-2xl');
    expect(shell?.className).not.toContain('max-w-7xl');
    expect(hero?.className).toContain('min-w-0');
    expect(hero?.querySelector('.max-w-4xl')).not.toBeNull();
    expect(heading?.className).toContain('max-w-4xl');
    expect(heading?.className).toContain('break-words');
    expect(heading?.className).toContain('text-4xl');
    expect(heading?.className).toContain('sm:text-6xl');
    expect(lead?.className).toContain('max-w-3xl');

    for (const grid of [librariesGrid, developerToolsGrid, chirimenGrid]) {
      expect(grid?.className).toContain('min-w-0');
      expect(grid?.className).toContain('grid-cols-1');
    }

    expect(librariesGrid?.className).toContain('max-w-xl');
    expect(librariesGrid?.className).toContain('md:max-w-2xl');
    expect(librariesGrid?.className).not.toContain('md:grid-cols-2');
    expect(librariesGrid?.className).not.toContain('xl:grid-cols-3');
    expect(developerToolsGrid?.className).toContain('max-w-xl');
    expect(developerToolsGrid?.className).toContain('md:max-w-2xl');
    expect(developerToolsGrid?.className).not.toContain('md:grid-cols-2');
    expect(developerToolsGrid?.className).not.toContain('xl:grid-cols-3');
    expect(chirimenGrid?.className).not.toContain('max-w-xl');
    expect(chirimenGrid?.className).not.toContain('md:max-w-2xl');
    expect(chirimenGrid?.className).toContain('md:grid-cols-2');
    expect(chirimenGrid?.className).toContain('xl:grid-cols-3');
    expect(footer?.className).toContain('mt-4');
    expect(footer?.className).not.toContain('mt-8');
  });

  it('includes Get involved section with contribution links between Projects and Footer', async () => {
    const compiled = await renderApp();
    const getInvolvedSection = compiled.querySelector(
      '[aria-labelledby="get-involved-heading"]',
    );
    const getInvolvedHeading = compiled.querySelector('#get-involved-heading');
    const issuesLink = compiled.querySelector(
      'a[href="https://github.com/gurezo/portal/issues"]',
    );
    const githubProfileLink = getInvolvedSection?.querySelector(
      'a[href="https://github.com/gurezo"]',
    );

    expect(getInvolvedSection).not.toBeNull();
    expect(getInvolvedHeading?.textContent?.trim()).toBe('Get involved');
    expect(getInvolvedSection?.textContent).toContain(
      'Contribute to these projects, report issues, or suggest improvements.',
    );
    expect(issuesLink?.textContent?.trim()).toBe('GitHub Issues');
    expect(issuesLink?.getAttribute('target')).toBe('_blank');
    expect(issuesLink?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(githubProfileLink?.textContent?.trim()).toBe('GitHub Profile');
    expect(githubProfileLink?.getAttribute('target')).toBe('_blank');
    expect(githubProfileLink?.getAttribute('rel')).toBe('noopener noreferrer');

    const projects = compiled
      .querySelector('#projects-heading')
      ?.closest('section');
    const getInvolved = compiled
      .querySelector('#get-involved-heading')
      ?.closest('section');
    const footer = compiled.querySelector('footer');

    expect(projects).not.toBeNull();
    expect(getInvolved).not.toBeNull();
    expect(footer).not.toBeNull();
    expect(
      projects?.compareDocumentPosition(getInvolved ?? projects) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      getInvolved?.compareDocumentPosition(footer ?? getInvolved) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('shows the latest fresh release between the hero and Projects', async () => {
    await configureApp(async () => freshRelease);
    const compiled = await renderApp();
    const hero = compiled.querySelector('section');
    const band = compiled
      .querySelector('#whats-new-heading')
      ?.closest('section');
    const projects = compiled
      .querySelector('#projects-heading')
      ?.closest('section');
    const link = band?.querySelector('a');
    const nav = compiled.querySelector('nav[aria-label="Main navigation"]');

    expect(hero).not.toBeNull();
    expect(band).not.toBeNull();
    expect(projects).not.toBeNull();
    expect(hero?.contains(band ?? null)).toBe(false);
    expect(
      hero?.compareDocumentPosition(band ?? hero) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      band?.compareDocumentPosition(projects ?? band) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(band?.textContent).toContain("What's new");
    expect(band?.textContent).toContain('Release v4.2.1');
    expect(band?.textContent).toContain('web-serial-rxjs');
    expect(link?.getAttribute('href')).toBe(freshRelease.htmlUrl);
    expect(nav?.querySelector('a[href="/updates"]')?.textContent?.trim()).toBe(
      'Updates',
    );
    expect(nav?.textContent).not.toContain('更新情報');
  });

  it('hides the band when the latest release is older than 60 days', async () => {
    const compiled = await renderApp();

    expect(compiled.querySelector('#whats-new-heading')).toBeNull();
    expect(
      compiled.querySelector('nav a[href="/updates"]')?.textContent?.trim(),
    ).toBe('Updates');
    expect(compiled.querySelector('nav')?.textContent).not.toContain('更新情報');
  });

  it('marks Updates as the current page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    fixture.detectChanges();
    await router.navigateByUrl('/updates');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const updates = compiled.querySelector(
      'nav[aria-label="Main navigation"] a[href="/updates"]',
    );

    expect(updates?.getAttribute('aria-current')).toBe('page');
    expect(
      compiled
        .querySelector('nav[aria-label="Main navigation"] a[href="/#projects-heading"]')
        ?.getAttribute('aria-current'),
    ).toBeNull();
  });
});
