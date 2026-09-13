import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OssProject } from '../project.model';
import { PROJECTS } from '../projects.data';
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
    expect(compiled.textContent).toContain('Active');
    expect(compiled.textContent).toContain('TypeScript');
    expect(
      links.map((link) => ({
        href: link.getAttribute('href'),
        label: link.textContent?.trim(),
        target: link.getAttribute('target'),
        rel: link.getAttribute('rel'),
      })),
    ).toEqual(
      webSerialRxjs?.links.map((link) => ({
        href: link.url,
        label: link.label,
        target: '_blank',
        rel: 'noopener noreferrer',
      })),
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
    expect(compiled.textContent).toContain('Active');
    expect(compiled.textContent).toContain('Angular');
    expect(
      links.map((link) => ({
        href: link.getAttribute('href'),
        label: link.textContent?.trim(),
        target: link.getAttribute('target'),
        rel: link.getAttribute('rel'),
      })),
    ).toEqual(
      chirimenLiteConsole.links.map((link) => ({
        href: link.url,
        label: link.label,
        target: '_blank',
        rel: 'noopener noreferrer',
      })),
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
    expect(compiled.textContent).toContain('Active');
    expect(compiled.textContent).toContain('Angular');
    expect(compiled.textContent).toContain(
      'Search and browse CHIRIMEN-supported devices.',
    );
    expect(
      links.map((link) => ({
        href: link.getAttribute('href'),
        label: link.textContent?.trim(),
        target: link.getAttribute('target'),
        rel: link.getAttribute('rel'),
      })),
    ).toEqual(
      chirimenDeviceDashboard.links.map((link) => ({
        href: link.url,
        label: link.label,
        target: '_blank',
        rel: 'noopener noreferrer',
      })),
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
    expect(compiled.textContent).toContain('Active');
    expect(compiled.textContent).toContain(
      'Device metadata, examples, drivers, images, schematics',
    );
    expect(compiled.querySelector('[aria-label="Technologies"]')).toBeNull();
    expect(
      links.map((link) => ({
        href: link.getAttribute('href'),
        label: link.textContent?.trim(),
        target: link.getAttribute('target'),
        rel: link.getAttribute('rel'),
      })),
    ).toEqual(
      chirimenCertifiedDevices.links.map((link) => ({
        href: link.url,
        label: link.label,
        target: '_blank',
        rel: 'noopener noreferrer',
      })),
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
    expect(compiled.querySelectorAll('a')).toHaveLength(6);
    expect(compiled.textContent).toContain('Documentation');
    expect(compiled.textContent).toContain('Web App');
    expect(compiled.textContent).toContain('GitHub');
    expect(compiled.textContent).toContain('Data');
  });
});
