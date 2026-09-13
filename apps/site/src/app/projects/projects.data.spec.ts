import { OssProject } from './project.model';
import { PROJECT_GROUP_SECTIONS, PROJECTS } from './projects.data';
import { groupLabel } from './projects.util';

describe('PROJECTS', () => {
  const webSerialRxjs = PROJECTS.find(
    (project) => project.id === 'web-serial-rxjs',
  );
  const chirimenLiteConsole = PROJECTS.find(
    (project) => project.id === 'chirimen-lite-console',
  );
  const chirimenDeviceDashboard = PROJECTS.find(
    (project) => project.id === 'chirimen-device-dashboard',
  );
  const chirimenCertifiedDevices = PROJECTS.find(
    (project) => project.id === 'chirimen-certified-devices',
  );

  it('includes web-serial-rxjs with the fields needed to render the portal listing', () => {
    expect(webSerialRxjs).toEqual(
      expect.objectContaining<Partial<OssProject>>({
        id: 'web-serial-rxjs',
        name: 'web-serial-rxjs',
        packageName: '@gurezo/web-serial-rxjs',
        category: 'library',
        group: 'libraries',
        status: 'active',
        featured: true,
      }),
    );
    expect(webSerialRxjs?.description).toContain('Web Serial API');
    expect(webSerialRxjs?.summary).toContain('Documentation and runnable examples');
    expect(webSerialRxjs?.technologies).toEqual([
      'TypeScript',
      'RxJS',
      'Web Serial',
    ]);
  });

  it('exposes the current web-serial-rxjs links', () => {
    expect(webSerialRxjs?.links).toEqual([
      {
        label: 'Documentation',
        url: 'https://gurezo.net/web-serial-rxjs/',
        kind: 'docs',
      },
      {
        label: 'Examples',
        url: 'https://gurezo.net/web-serial-rxjs/examples/',
        kind: 'examples',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/gurezo/web-serial-rxjs',
        kind: 'github',
      },
      {
        label: 'npm',
        url: 'https://www.npmjs.com/package/@gurezo/web-serial-rxjs',
        kind: 'npm',
      },
    ]);
  });

  it('includes chirimen-lite-console in CHIRIMEN Tools', () => {
    expect(chirimenLiteConsole).toEqual(
      expect.objectContaining<Partial<OssProject>>({
        id: 'chirimen-lite-console',
        name: 'CHIRIMEN Lite Console',
        category: 'web-app',
        group: 'chirimen-tools',
        status: 'active',
      }),
    );
    expect(chirimenLiteConsole?.description).toContain('CHIRIMEN Lite');
    expect(chirimenLiteConsole?.featured).toBeUndefined();
    expect(chirimenLiteConsole?.technologies).toEqual([
      'Angular',
      'Web Serial',
    ]);
  });

  it('exposes chirimen-lite-console app and GitHub links', () => {
    expect(chirimenLiteConsole?.links).toEqual([
      {
        label: 'Open App',
        url: 'https://chirimen-lite-console.web.app/',
        kind: 'app',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/gurezo/chirimen-lite-console',
        kind: 'github',
      },
    ]);
  });

  it('includes chirimen-device-dashboard in CHIRIMEN Tools', () => {
    expect(chirimenDeviceDashboard).toEqual(
      expect.objectContaining<Partial<OssProject>>({
        id: 'chirimen-device-dashboard',
        name: 'CHIRIMEN Device Dashboard',
        category: 'web-app',
        group: 'chirimen-tools',
        status: 'active',
      }),
    );
    expect(chirimenDeviceDashboard?.description).toContain(
      'Search and browse CHIRIMEN-supported devices',
    );
    expect(chirimenDeviceDashboard?.featured).toBeUndefined();
    expect(chirimenDeviceDashboard?.technologies).toEqual(['Angular']);
  });

  it('exposes chirimen-device-dashboard app and GitHub links', () => {
    expect(chirimenDeviceDashboard?.links).toEqual([
      {
        label: 'Open App',
        url: 'https://chirimen-device-dashboard.web.app/',
        kind: 'app',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/gurezo/chirimen-device-dashboard',
        kind: 'github',
      },
    ]);
  });

  it('includes chirimen-certified-devices in CHIRIMEN Tools as data', () => {
    expect(chirimenCertifiedDevices).toEqual(
      expect.objectContaining<Partial<OssProject>>({
        id: 'chirimen-certified-devices',
        name: 'CHIRIMEN Certified Devices',
        category: 'data',
        group: 'chirimen-tools',
        status: 'active',
      }),
    );
    expect(chirimenCertifiedDevices?.description).toContain(
      'Device metadata, examples, drivers, images, schematics',
    );
    expect(chirimenCertifiedDevices?.featured).toBeUndefined();
    expect(chirimenCertifiedDevices?.technologies).toBeUndefined();
  });

  it('exposes chirimen-certified-devices GitHub link', () => {
    expect(chirimenCertifiedDevices?.links).toEqual([
      {
        label: 'GitHub',
        url: 'https://github.com/gurezo/chirimen-certified-devices',
        kind: 'github',
      },
    ]);
  });
});

describe('PROJECT_GROUP_SECTIONS', () => {
  it('defines Libraries and CHIRIMEN Tools with headings that match group labels', () => {
    expect(PROJECT_GROUP_SECTIONS.map((section) => section.id)).toEqual([
      'libraries',
      'chirimen-tools',
    ]);

    for (const section of PROJECT_GROUP_SECTIONS) {
      expect(section.heading).toBe(groupLabel(section.id));
      expect(section.description.length).toBeGreaterThan(0);
      expect(section.emptyTitle).toBe('Coming later');
    }
  });
});
