import { Component, input } from '@angular/core';
import { OssProject, ProjectLink } from '../project.model';
import {
  categoryLabel,
  statusLabel,
  visibleProjectStatus,
} from '../projects.util';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  host: {
    class: 'block h-full min-w-0',
  },
})
export class ProjectCardComponent {
  readonly project = input.required<OssProject>();

  protected readonly categoryLabel = categoryLabel;
  protected readonly statusLabel = statusLabel;
  protected readonly visibleProjectStatus = visibleProjectStatus;

  /**
   * Generate accessible aria-label for external project links.
   * @see docs/EXTERNAL_LINKS_AND_UPDATES_NAV.md
   */
  protected linkAriaLabel(link: ProjectLink): string {
    return `${this.project().name} ${link.label} (opens in a new tab)`;
  }
}
