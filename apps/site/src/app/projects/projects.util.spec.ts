import { OssProject } from './project.model';
import {
  categoryLabel,
  groupLabel,
  projectLink,
  projectsByGroup,
  statusLabel,
  visibleProjectStatus,
} from './projects.util';

const projects: OssProject[] = [
  {
    id: 'web-serial-rxjs',
    name: 'web-serial-rxjs',
    category: 'library',
    group: 'libraries',
    description: 'Library',
    links: [
      {
        label: 'Documentation',
        url: 'https://gurezo.net/web-serial-rxjs/',
        kind: 'docs',
      },
    ],
  },
  {
    id: 'chirimen-lite-console',
    name: 'chirimen-lite-console',
    category: 'web-app',
    group: 'chirimen-tools',
    description: 'Console',
    links: [
      {
        label: 'Web App',
        url: 'https://chirimen-lite-console.web.app/',
        kind: 'app',
      },
    ],
  },
  {
    id: 'chirimen-certified-devices',
    name: 'chirimen-certified-devices',
    category: 'data',
    group: 'chirimen-tools',
    description: 'Devices',
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/gurezo/chirimen-certified-devices',
        kind: 'github',
      },
    ],
  },
];

describe('projects.util', () => {
  it('groups CHIRIMEN related OSS by chirimen-tools', () => {
    expect(
      projectsByGroup(projects, 'chirimen-tools').map((project) => project.id),
    ).toEqual(['chirimen-lite-console', 'chirimen-certified-devices']);
  });

  it('finds a link by kind', () => {
    expect(projectLink(projects[0], 'docs')?.url).toBe(
      'https://gurezo.net/web-serial-rxjs/',
    );
  });

  it('maps category and status to display labels', () => {
    expect(categoryLabel('library')).toBe('Library');
    expect(categoryLabel('web-app')).toBe('Web Application');
    expect(categoryLabel('data')).toBe('Data Repository');
    expect(statusLabel('active')).toBe('Active');
    expect(statusLabel('experimental')).toBe('Experimental');
    expect(statusLabel('maintenance')).toBe('Maintenance');
    expect(statusLabel('archived')).toBe('Archived');
  });

  it('hides the default active status and keeps exceptional statuses visible', () => {
    expect(visibleProjectStatus(undefined)).toBeUndefined();
    expect(visibleProjectStatus('active')).toBeUndefined();
    expect(visibleProjectStatus('experimental')).toBe('experimental');
    expect(visibleProjectStatus('maintenance')).toBe('maintenance');
    expect(visibleProjectStatus('archived')).toBe('archived');
  });

  it('maps project groups to section headings', () => {
    expect(groupLabel('libraries')).toBe('Libraries');
    expect(groupLabel('chirimen-tools')).toBe('CHIRIMEN Tools');
  });
});
