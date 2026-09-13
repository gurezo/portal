import { Component } from '@angular/core';
import { PROJECTS, PROJECT_GROUP_SECTIONS } from './projects/projects.data';
import { ProjectCard } from './projects/project-card/project-card';
import { projectsByGroup } from './projects/projects.util';

@Component({
  selector: 'app-root',
  imports: [ProjectCard],
  templateUrl: './app.html',
})
export class App {
  protected title = 'gurezo portal site';
  protected readonly groupSections = PROJECT_GROUP_SECTIONS.map((section) => ({
    ...section,
    projects: projectsByGroup(PROJECTS, section.id),
  }));
}
