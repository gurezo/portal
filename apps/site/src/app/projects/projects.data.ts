import { OssProject, ProjectGroupSection } from './project.model';

export const PROJECT_GROUP_SECTIONS: ProjectGroupSection[] = [
  {
    id: 'libraries',
    heading: 'Libraries',
    description:
      'Reusable libraries and documentation hosted on this domain.',
    emptyEyebrow: 'More projects',
    emptyTitle: 'Coming later',
    emptyDescription: 'Additional OSS libraries can be added here.',
  },
  {
    id: 'chirimen-tools',
    heading: 'CHIRIMEN Tools',
    description: 'Browser tools and data for working with CHIRIMEN devices.',
    emptyEyebrow: 'More projects',
    emptyTitle: 'Coming later',
    emptyDescription: 'Additional CHIRIMEN related OSS can be added here.',
  },
];

export const PROJECTS: OssProject[] = [
  {
    id: 'web-serial-rxjs',
    name: 'web-serial-rxjs',
    packageName: '@gurezo/web-serial-rxjs',
    category: 'library',
    group: 'libraries',
    status: 'active',
    description:
      'A TypeScript library that makes the Web Serial API easier to use with RxJS.',
    technologies: ['TypeScript', 'RxJS', 'Web Serial'],
    links: [
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
    ],
  },
  {
    id: 'chirimen-lite-console',
    name: 'CHIRIMEN Lite Console',
    category: 'web-app',
    group: 'chirimen-tools',
    status: 'active',
    description:
      'Browser-based development console for CHIRIMEN Lite.',
    technologies: ['Angular', 'Web Serial'],
    links: [
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
    ],
  },
  {
    id: 'chirimen-device-dashboard',
    name: 'CHIRIMEN Device Dashboard',
    category: 'web-app',
    group: 'chirimen-tools',
    status: 'active',
    description: 'Search and browse CHIRIMEN-supported devices.',
    technologies: ['Angular'],
    links: [
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
    ],
  },
  {
    id: 'chirimen-certified-devices',
    name: 'CHIRIMEN Certified Devices',
    category: 'data',
    group: 'chirimen-tools',
    status: 'active',
    description:
      'Device metadata, examples, drivers, images, schematics, and generated JSON data for CHIRIMEN projects.',
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/gurezo/chirimen-certified-devices',
        kind: 'github',
      },
    ],
  },
];
