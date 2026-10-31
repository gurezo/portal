import { TestBed } from '@angular/core/testing';
import {
  GithubReleaseSummary,
  RELEASES_LOADER,
  ReleasesLoader,
} from '../github-releases';
import { UpdatesPage } from './updates-page';

const newer: GithubReleaseSummary = {
  projectName: 'web-serial-rxjs',
  owner: 'gurezo',
  repo: 'web-serial-rxjs',
  name: 'Release v4.2.1',
  tagName: 'v4.2.1',
  publishedAt: '2026-10-30T13:08:06Z',
  htmlUrl: 'https://github.com/gurezo/web-serial-rxjs/releases/tag/v4.2.1',
};

const older: GithubReleaseSummary = {
  projectName: 'mdn-translation-ja-mcp',
  owner: 'gurezo',
  repo: 'mdn-translation-ja-mcp',
  name: 'Older release',
  tagName: 'v0.1.0',
  publishedAt: '2020-01-01T00:00:00.000Z',
  htmlUrl:
    'https://github.com/gurezo/mdn-translation-ja-mcp/releases/tag/v0.1.0',
};

async function createPage(loader: ReleasesLoader) {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [UpdatesPage],
    providers: [{ provide: RELEASES_LOADER, useValue: loader }],
  }).compileComponents();

  const fixture = TestBed.createComponent(UpdatesPage);
  fixture.detectChanges();
  return fixture;
}

describe('UpdatesPage', () => {
  it('shows loading text until releases arrive', async () => {
    let resolveReleases: (releases: GithubReleaseSummary[]) => void = () =>
      undefined;
    const pending = new Promise<GithubReleaseSummary[]>((resolve) => {
      resolveReleases = resolve;
    });
    const fixture = await createPage(() => pending);
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Loading updates');
    expect(compiled.textContent).not.toContain(
      'No releases are available right now.',
    );

    resolveReleases([newer]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Release v4.2.1');
    expect(compiled.textContent).not.toContain('Loading updates');
  });

  it('lists each repository release, including ones older than 60 days', async () => {
    const fixture = await createPage(async () => [newer, older]);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('a'));

    expect(compiled.querySelector('#updates-heading')?.textContent?.trim()).toBe(
      'Updates',
    );
    expect(compiled.textContent).toContain(
      'Latest GitHub releases for projects on this site.',
    );
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      newer.htmlUrl,
      older.htmlUrl,
    ]);
    expect(links[0]?.getAttribute('target')).toBe('_blank');
    expect(links[0]?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(links[0]?.getAttribute('aria-label')).toBe(
      'web-serial-rxjs Release v4.2.1 (opens in a new tab)',
    );
    expect(compiled.querySelector('time')?.textContent?.trim()).toBe(
      'Oct 30, 2026',
    );
    expect(compiled.textContent).toContain('Jan 1, 2020');
    expect(compiled.textContent).toContain('Older release');
    expect(compiled.textContent).not.toContain('更新情報');
    expect(compiled.textContent).not.toContain('Loading updates');
  });

  it('shows an empty state when there are no releases', async () => {
    const fixture = await createPage(async () => []);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(
      'No releases are available right now.',
    );
    expect(compiled.querySelector('a')).toBeNull();
    expect(compiled.textContent).not.toContain('Loading updates');
  });

  it('shows an empty state when loading releases fails', async () => {
    const fixture = await createPage(async () => {
      throw new Error('offline');
    });
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(
      'No releases are available right now.',
    );
    expect(compiled.querySelector('ul')).toBeNull();
  });
});
