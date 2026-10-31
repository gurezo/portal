import { Component, inject, signal } from '@angular/core';
import {
  formatReleasePublishedAt,
  GithubReleaseSummary,
  LATEST_RELEASE_LOADER,
} from '../github-releases';

@Component({
  selector: 'app-whats-new-band',
  templateUrl: './whats-new-band.html',
  host: {
    class: 'block min-w-0',
  },
})
export class WhatsNewBand {
  private readonly loadLatestRelease = inject(LATEST_RELEASE_LOADER);
  protected readonly release = signal<GithubReleaseSummary | null>(null);

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
      this.release.set(await this.loadLatestRelease());
    } catch {
      this.release.set(null);
    }
  }
}
