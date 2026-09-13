import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OssProject } from '../project.model';
import { PROJECTS } from '../projects.data';
import { categoryLabel } from '../projects.util';
import { ProjectCard } from './project-card';

function createProject(overrides: Partial<OssProject> = {}): OssProject {
  return {
    id: 'sample-project',
    name: 'Sample Project',
    category: 'library',
    description: 'A sample project description.',
    links: [],
    ...overrides,
  };
}

function linkSnapshot(link: HTMLAnchorElement) {
  return {
    href: link.getAttribute('href'),
    label: link.textContent?.trim(),
    target: link.getAttribute('target'),
    rel: link.getAttribute('rel'),
    ariaLabel: link.getAttribute('aria-label'),
  };
}

function expectedLinkSnapshots(project: OssProject) {
  return project.links.map((link) => ({
    href: link.url,
    label: link.label,
    target: '_blank',
    rel: 'noopener noreferrer',
    ariaLabel: `${project.name} ${link.label} (opens in a new tab)`,
  }));
}

describe('ProjectCard', () => {
  let fixture: ComponentFixture<ProjectCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCard);
  });

  function render(project: OssProject): HTMLElement {
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders swapped metadata without hardcoded listing copy', () => {
    const first = render(
      createProject({
        name: 'web-serial-rxjs',
        category: 'library',
        description: 'Library description',
      }),
    );

    expect(first.textContent).toContain('web-serial-rxjs');
    expect(first.textContent).toContain('Library');
    expect(first.textContent).toContain('Library description');

    const second = render(
      createProject({
        name: 'chirimen-lite-console',
        category: 'web-app',
        description: 'Console description',
      }),
    );

    expect(second.textContent).toContain('chirimen-lite-console');
    expect(second.textContent).toContain('Web Application');
    expect(second.textContent).toContain('Console description');
    expect(second.textContent).not.toContain('web-serial-rxjs');
    expect(second.textContent).not.toContain('Library description');
  });

  it('renders web-serial-rxjs links from project metadata', () => {
    const webSerialRxjs = PROJECTS.find(
      (project) => project.id === 'web-serial-rxjs',
    );

    expect(webSerialRxjs).toBeDefined();
    if (!webSerialRxjs) {
      return;
    }

    const compiled = render(webSerialRxjs);
    const links = Array.from(compiled.querySelectorAll('a'));

    expect(compiled.textContent).toContain('web-serial-rxjs');
    expect(compiled.textContent).not.toContain('Active');
    expect(compiled.textContent).toContain('TypeScript');
    expect(links.map((link) => linkSnapshot(link))).toEqual(
      expectedLinkSnapshots(webSerialRxjs),
    );
  });

  it('renders chirimen-lite-console links from project metadata', () => {
    const chirimenLiteConsole = PROJECTS.find(
      (project) => project.id === 'chirimen-lite-console',
    );

    expect(chirimenLiteConsole).toBeDefined();
    if (!chirimenLiteConsole) {
      return;
    }

    const compiled = render(chirimenLiteConsole);
    const links = Array.from(compiled.querySelectorAll('a'));

    expect(compiled.textContent).toContain('CHIRIMEN Lite Console');
    expect(compiled.textContent).toContain('Web Application');
    expect(compiled.textContent).not.toContain('Active');
    expect(compiled.textContent).toContain('Angular');
    expect(links.map((link) => linkSnapshot(link))).toEqual(
      expectedLinkSnapshots(chirimenLiteConsole),
    );
  });

  it('renders chirimen-device-dashboard links from project metadata', () => {
    const chirimenDeviceDashboard = PROJECTS.find(
      (project) => project.id === 'chirimen-device-dashboard',
    );

    expect(chirimenDeviceDashboard).toBeDefined();
    if (!chirimenDeviceDashboard) {
      return;
    }

    const compiled = render(chirimenDeviceDashboard);
    const links = Array.from(compiled.querySelectorAll('a'));

    expect(compiled.textContent).toContain('CHIRIMEN Device Dashboard');
    expect(compiled.textContent).toContain('Web Application');
    expect(compiled.textContent).not.toContain('Active');
    expect(compiled.textContent).toContain('Angular');
    expect(compiled.textContent).toContain(
      'Search and browse CHIRIMEN-supported devices.',
    );
    expect(links.map((link) => linkSnapshot(link))).toEqual(
      expectedLinkSnapshots(chirimenDeviceDashboard),
    );
  });

  it('renders chirimen-certified-devices links from project metadata', () => {
    const chirimenCertifiedDevices = PROJECTS.find(
      (project) => project.id === 'chirimen-certified-devices',
    );

    expect(chirimenCertifiedDevices).toBeDefined();
    if (!chirimenCertifiedDevices) {
      return;
    }

    const compiled = render(chirimenCertifiedDevices);
    const links = Array.from(compiled.querySelectorAll('a'));

    expect(compiled.textContent).toContain('CHIRIMEN Certified Devices');
    expect(compiled.textContent).toContain('Data Repository');
    expect(compiled.textContent).not.toContain('Active');
    expect(compiled.textContent).toContain(
      'Device metadata, examples, drivers, images, schematics',
    );
    expect(compiled.querySelector('[aria-label="Technologies"]')).toBeNull();
    expect(links.map((link) => linkSnapshot(link))).toEqual(
      expectedLinkSnapshots(chirimenCertifiedDevices),
    );
  });

  it('hides optional status, technologies, and links when they are absent', () => {
    const compiled = render(createProject());

    expect(compiled.textContent).not.toContain('Active');
    expect(compiled.querySelector('[aria-label="Technologies"]')).toBeNull();
    expect(compiled.querySelector('a')).toBeNull();
    expect(
      compiled.querySelector('[aria-label="Sample Project links"]'),
    ).toBeNull();
  });

  it('keeps a wrapping link row when many link kinds are present', () => {
    const compiled = render(
      createProject({
        name: 'chirimen-device-dashboard',
        links: [
          {
            label: 'Documentation',
            url: 'https://example.test/docs',
            kind: 'docs',
          },
          {
            label: 'Web App',
            url: 'https://chirimen-device-dashboard.web.app/',
            kind: 'app',
          },
          {
            label: 'GitHub',
            url: 'https://github.com/gurezo/chirimen-device-dashboard',
            kind: 'github',
          },
          {
            label: 'Data',
            url: 'https://example.test/devices.json',
            kind: 'data',
          },
          {
            label: 'Examples',
            url: 'https://example.test/examples',
            kind: 'examples',
          },
          {
            label: 'npm',
            url: 'https://www.npmjs.com/package/example',
            kind: 'npm',
          },
        ],
      }),
    );

    const linkRow = compiled.querySelector(
      '[aria-label="chirimen-device-dashboard links"]',
    );

    expect(linkRow).not.toBeNull();
    expect(linkRow?.className).toContain('flex-wrap');
    expect(linkRow?.className).toContain('min-w-0');
    expect(compiled.querySelectorAll('a')).toHaveLength(6);
    expect(compiled.textContent).toContain('Documentation');
    expect(compiled.textContent).toContain('Web App');
    expect(compiled.textContent).toContain('GitHub');
    expect(compiled.textContent).toContain('Data');
  });

  it('uses an h4 heading with wrapping and visible focus styles', () => {
    const compiled = render(
      createProject({
        name: 'VeryLongProjectNameWithoutSpacesThatMustWrap',
        description: 'A verylongunbrokenwordthatmustwrapinsideanarrowcard.',
        status: 'active',
        links: [
          {
            label: 'GitHub',
            url: 'https://github.com/gurezo/example',
            kind: 'github',
          },
        ],
      }),
    );

    const heading = compiled.querySelector('h4');
    const description = compiled.querySelector('p.leading-7');
    const link = compiled.querySelector('a');
    const article = compiled.querySelector('article');

    expect(compiled.className).toContain('min-w-0');
    expect(article?.className).toContain('min-w-0');
    expect(heading?.tagName).toBe('H4');
    expect(heading?.className).toContain('break-words');
    expect(heading?.textContent).toContain(
      'VeryLongProjectNameWithoutSpacesThatMustWrap',
    );
    expect(compiled.querySelector('h3')).toBeNull();
    expect(description?.className).toContain('break-words');
    expect(link?.className).toContain('break-words');
    expect(link?.className).toContain('focus:ring-2');
    expect(link?.className).toContain('focus:ring-sky-400');
    expect(link?.getAttribute('aria-label')).toBe(
      'VeryLongProjectNameWithoutSpacesThatMustWrap GitHub (opens in a new tab)',
    );
  });

  it('stretches the card so action links sit at the bottom', () => {
    const compiled = render(
      createProject({
        technologies: ['TypeScript'],
        links: [
          {
            label: 'GitHub',
            url: 'https://github.com/gurezo/example',
            kind: 'github',
          },
        ],
      }),
    );

    const article = compiled.querySelector('article');
    const linkRow = compiled.querySelector('[aria-label="Sample Project links"]');

    expect(compiled.className).toContain('block');
    expect(compiled.className).toContain('h-full');
    expect(article?.className).toContain('h-full');
    expect(article?.className).toContain('flex');
    expect(article?.className).toContain('flex-col');
    expect(linkRow?.className).toContain('mt-auto');
    expect(linkRow?.className).toContain('border-t');
  });

  it('keeps the same content order for every published project', () => {
    expect(PROJECTS).toHaveLength(4);

    for (const project of PROJECTS) {
      const compiled = render(project);
      const article = compiled.querySelector('article');
      const children = Array.from(article?.children ?? []);

      expect(article).not.toBeNull();
      expect(children[0]?.textContent).toContain(
        categoryLabel(project.category),
      );
      expect(children[0]?.querySelector('h4')?.textContent?.trim()).toBe(
        project.name,
      );
      expect(children[1]?.tagName).toBe('P');
      expect(children[1]?.textContent?.trim()).toBe(project.description);
      expect(children[2]?.tagName).toBe('DIV');
      expect(children[2]?.className).toContain('min-h-8');

      if (project.technologies?.length) {
        expect(children[2]?.querySelector('ul')?.getAttribute('aria-label')).toBe(
          'Technologies',
        );
      } else {
        expect(children[2]?.querySelector('ul')).toBeNull();
      }

      expect(children[3]?.getAttribute('aria-label')).toBe(
        `${project.name} links`,
      );
      expect(children[3]?.className).toContain('mt-auto');
      expect(children[3]?.className).toContain('border-t');
      expect(children).toHaveLength(4);
    }
  });

  it('shows exceptional status badges and hides the default active status', () => {
    const statuses = [
      ['experimental', 'Experimental'],
      ['maintenance', 'Maintenance'],
      ['archived', 'Archived'],
    ] as const;

    for (const [status, label] of statuses) {
      const compiled = render(createProject({ status }));

      expect(compiled.textContent).toContain(label);
      expect(compiled.textContent).not.toContain('Active');
    }

    const active = render(createProject({ status: 'active' }));

    expect(active.textContent).not.toContain('Active');
    expect(active.textContent).not.toContain('Experimental');
    expect(active.textContent).not.toContain('Maintenance');
    expect(active.textContent).not.toContain('Archived');
  });

  it('reserves a technology slot so missing tags do not drop the actions row', () => {
    const compiled = render(
      createProject({
        links: [
          {
            label: 'GitHub',
            url: 'https://github.com/gurezo/example',
            kind: 'github',
          },
        ],
      }),
    );
    const article = compiled.querySelector('article');
    const children = Array.from(article?.children ?? []);
    const slot = children[2];
    const linkRow = compiled.querySelector(
      '[aria-label="Sample Project links"]',
    );

    expect(slot?.className).toContain('mt-5');
    expect(slot?.className).toContain('min-h-8');
    expect(slot?.querySelector('[aria-label="Technologies"]')).toBeNull();
    expect(linkRow).toBe(children[3]);
    expect(linkRow?.className).toContain('mt-auto');
  });
});
