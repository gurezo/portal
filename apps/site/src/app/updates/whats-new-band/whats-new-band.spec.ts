import { TestBed } from '@angular/core/testing';
import {
  GithubReleaseSummary,
  LATEST_RELEASE_LOADER,
  LatestReleaseLoader,
} from '../github-releases';
import { WhatsNewBand } from './whats-new-band';

const freshRelease: GithubReleaseSummary = {
  projectName: 'web-serial-rxjs',
  owner: 'gurezo',
  repo: 'web-serial-rxjs',
  name: 'Release v4.2.1',
  tagName: 'v4.2.1',
  publishedAt: '2026-10-30T13:08:06Z',
  htmlUrl: 'https://github.com/gurezo/web-serial-rxjs/releases/tag/v4.2.1',
};

async function createBand(loader: LatestReleaseLoader) {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [WhatsNewBand],
    providers: [{ provide: LATEST_RELEASE_LOADER, useValue: loader }],
  }).compileComponents();

  const fixture = TestBed.createComponent(WhatsNewBand);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('WhatsNewBand', () => {
  it('renders the latest release name, project, date, and link', async () => {
    const fixture = await createBand(async () => freshRelease);
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');

    expect(
      compiled.querySelector('#whats-new-heading')?.textContent?.trim(),
    ).toBe("What's new");
    expect(compiled.textContent).toContain('Release v4.2.1');
    expect(compiled.textContent).toContain('web-serial-rxjs');
    expect(compiled.querySelector('time')?.textContent?.trim()).toBe(
      'Oct 30, 2026',
    );
    expect(compiled.querySelector('time')?.getAttribute('datetime')).toBe(
      freshRelease.publishedAt,
    );
    expect(link?.getAttribute('href')).toBe(freshRelease.htmlUrl);
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link?.getAttribute('aria-label')).toBe(
      'web-serial-rxjs Release v4.2.1 (opens in a new tab)',
    );
  });

  it('renders nothing when there is no fresh release', async () => {
    const fixture = await createBand(async () => null);
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#whats-new-heading')).toBeNull();
    expect(compiled.querySelector('a')).toBeNull();
  });

  it('renders nothing when loading the release fails', async () => {
    const fixture = await createBand(async () => {
      throw new Error('offline');
    });
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#whats-new-heading')).toBeNull();
  });
});
