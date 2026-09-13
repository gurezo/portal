import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { PROJECTS } from './projects/projects.data';
import { projectLink } from './projects/projects.util';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should have the configured title', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance['title']).toBe('gurezo portal site');
  });

  it('describes the portal in Hero and links to Projects', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const hero = compiled.querySelector('section');
    const browseProjects = compiled.querySelector('a[href="#projects-heading"]');

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
      compiled.querySelector('a[href="https://lifewood.net/"]')?.textContent,
    ).toContain('about me');
  });

  it('renders project metadata instead of hardcoded listing copy', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
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
    expect(compiled.textContent).not.toContain(
      webSerialRxjs?.summary ?? 'Documentation and runnable examples',
    );
  });

  it('renders Libraries and CHIRIMEN Tools as separate groups', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const libraries = compiled.querySelector(
      '[aria-labelledby="libraries-heading"]',
    );
    const chirimenTools = compiled.querySelector(
      '[aria-labelledby="chirimen-tools-heading"]',
    );
    const librariesHeading = compiled.querySelector('#libraries-heading');
    const chirimenHeading = compiled.querySelector('#chirimen-tools-heading');

    expect(librariesHeading?.textContent?.trim()).toBe('Libraries');
    expect(chirimenHeading?.textContent?.trim()).toBe('CHIRIMEN Tools');
    expect(libraries?.textContent).toContain('web-serial-rxjs');
    expect(libraries?.textContent).not.toContain('Coming later');
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
    ).toContain('Open App');
    expect(
      chirimenTools?.querySelector(
        'a[href="https://github.com/gurezo/chirimen-lite-console"]',
      )?.textContent,
    ).toContain('GitHub');
    expect(
      chirimenTools?.querySelector(
        'a[href="https://chirimen-device-dashboard.web.app/"]',
      )?.textContent,
    ).toContain('Open App');
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

  it('keeps a heading hierarchy of one h1, group h3s, and card h4s', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const headings = Array.from(compiled.querySelectorAll('h1, h2, h3, h4')).map(
      (heading) => ({
        tag: heading.tagName,
        text: heading.textContent?.replace(/\s+/g, ' ').trim(),
      }),
    );

    expect(compiled.querySelectorAll('h1')).toHaveLength(1);
    expect(compiled.querySelectorAll('h2')).toHaveLength(1);
    expect(headings).toEqual(
      expect.arrayContaining([
        {
          tag: 'H1',
          text: 'Documentation and demos for OSS projects.',
        },
        { tag: 'H2', text: 'Available resources' },
        { tag: 'H3', text: 'Libraries' },
        { tag: 'H3', text: 'CHIRIMEN Tools' },
        { tag: 'H4', text: 'web-serial-rxjs' },
        { tag: 'H4', text: 'CHIRIMEN Lite Console' },
        { tag: 'H4', text: 'CHIRIMEN Device Dashboard' },
        { tag: 'H4', text: 'CHIRIMEN Certified Devices' },
      ]),
    );
    expect(headings).not.toContainEqual({
      tag: 'H2',
      text: '@gurezo/web-serial-rxjs',
    });
    expect(compiled.querySelectorAll('app-project-card h3')).toHaveLength(0);
    expect(compiled.querySelectorAll('app-project-card h4')).toHaveLength(4);
    expect(compiled.querySelector('#libraries-heading')?.tagName).toBe('H3');
    expect(compiled.querySelector('#chirimen-tools-heading')?.tagName).toBe(
      'H3',
    );
  });

  it('exposes published project links with unique labels and visible focus', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
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
});
