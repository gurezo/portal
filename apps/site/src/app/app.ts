import { Component } from '@angular/core';
import { PROJECTS } from './projects/projects.data';
import {
  categoryLabel,
  featuredProject,
  projectLink,
  statusLabel,
} from './projects/projects.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected title = 'gurezo portal site';
  protected readonly projects = PROJECTS;
  protected readonly featured = featuredProject(PROJECTS);

  protected readonly categoryLabel = categoryLabel;
  protected readonly statusLabel = statusLabel;
  protected readonly projectLink = projectLink;
}
