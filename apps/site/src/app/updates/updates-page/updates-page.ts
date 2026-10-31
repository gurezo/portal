import { Component, inject, signal } from '@angular/core';
import {
  formatReleasePublishedAt,
  GithubReleaseSummary,
  RELEASES_LOADER,
} from '../github-releases';

@Component({
  selector: 'app-updates-page',
  templateUrl: './updates-page.html',
  host: {
    class: 'block min-w-0',
  },
})
export class UpdatesPage {
  private readonly loadReleases = inject(RELEASES_LOADER);
  protected readonly status = signal<'loading' | 'ready'>('loading');
  protected readonly releases = signal<GithubReleaseSummary[]>([]);

  constructor() {
    void this.load();
  }

  protected releaseAriaLabel(release: GithubReleaseSummary): string {
    return `${release.projectName} ${release.name} (opens in a new tab)`;
  }

  protected publishedLabel(publishedAt: string): string {
    return formatReleasePublishedAt(publishedAt);
  }

  private async load(): Promise<void> {
    try {
      this.releases.set(await this.loadReleases());
    } catch {
      this.releases.set([]);
    } finally {
      this.status.set('ready');
    }
  }
}
