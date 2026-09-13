import { Component } from '@angular/core';
import { PROJECTS } from './projects/projects.data';
import { ProjectCard } from './projects/project-card/project-card';
import { featuredProject, projectLink } from './projects/projects.util';

@Component({
  selector: 'app-root',
  imports: [ProjectCard],
  templateUrl: './app.html',
})
export class App {
  protected title = 'gurezo portal site';
  protected readonly projects = PROJECTS;
  protected readonly featured = featuredProject(PROJECTS);

  protected readonly projectLink = projectLink;
}
