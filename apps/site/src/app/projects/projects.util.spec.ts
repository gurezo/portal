import { OssProject } from './project.model';
import {
  categoryLabel,
  featuredProject,
  groupLabel,
  projectLink,
  projectsByGroup,
  statusLabel,
} from './projects.util';

const projects: OssProject[] = [
  {
    id: 'web-serial-rxjs',
    name: 'web-serial-rxjs',
    category: 'library',
    group: 'libraries',
    description: 'Library',
    featured: true,
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
  it('returns the featured project', () => {
    expect(featuredProject(projects)?.id).toBe('web-serial-rxjs');
  });

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
    expect(statusLabel('active')).toBe('Active');
  });

  it('maps project groups to section headings', () => {
    expect(groupLabel('libraries')).toBe('Libraries');
    expect(groupLabel('chirimen-tools')).toBe('CHIRIMEN Tools');
  });
});
