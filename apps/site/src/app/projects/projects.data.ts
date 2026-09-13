import { OssProject } from './project.model';

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
    summary:
      'Documentation and runnable examples for using the Web Serial API with RxJS.',
    featured: true,
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
];
