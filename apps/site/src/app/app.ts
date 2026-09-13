import { Component } from '@angular/core';
import { PROJECTS, PROJECT_GROUP_SECTIONS } from './projects/projects.data';
import { ProjectCard } from './projects/project-card/project-card';
import {
  featuredProject,
  projectLink,
  projectsByGroup,
} from './projects/projects.util';

@Component({
  selector: 'app-root',
  imports: [ProjectCard],
  templateUrl: './app.html',
})
export class App {
  protected title = 'gurezo portal site';
  protected readonly featured = featuredProject(PROJECTS);
  protected readonly groupSections = PROJECT_GROUP_SECTIONS.map((section) => ({
    ...section,
    projects: projectsByGroup(PROJECTS, section.id),
  }));

  protected readonly projectLink = projectLink;
}
