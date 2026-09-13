import { OssProject } from './project.model';
import { PROJECTS } from './projects.data';

describe('PROJECTS', () => {
  const webSerialRxjs = PROJECTS.find(
    (project) => project.id === 'web-serial-rxjs',
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
});
