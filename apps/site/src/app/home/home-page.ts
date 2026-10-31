import { Component } from '@angular/core';
import { PROJECTS, PROJECT_GROUP_SECTIONS } from '../projects/projects.data';
import { ProjectCard } from '../projects/project-card/project-card';
import { projectsByGroup } from '../projects/projects.util';
import { WhatsNewBand } from '../updates/whats-new-band/whats-new-band';

@Component({
  selector: 'app-home-page',
  imports: [ProjectCard, WhatsNewBand],
  templateUrl: './home-page.html',
  host: {
    class: 'block min-w-0',
  },
})
export class HomePage {
  protected readonly groupSections = PROJECT_GROUP_SECTIONS.map((section) => ({
    ...section,
    projects: projectsByGroup(PROJECTS, section.id),
  }));
}
