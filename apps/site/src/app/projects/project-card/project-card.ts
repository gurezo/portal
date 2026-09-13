import { Component, input } from '@angular/core';
import { OssProject } from '../project.model';
import { categoryLabel, statusLabel } from '../projects.util';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.html',
  host: {
    class: 'block',
  },
})
export class ProjectCard {
  readonly project = input.required<OssProject>();

  protected readonly categoryLabel = categoryLabel;
  protected readonly statusLabel = statusLabel;
}
