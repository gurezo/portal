import { Component } from '@angular/core';
import { PROJECTS, PROJECT_GROUP_SECTIONS } from './projects/projects.data';
import { ProjectCard } from './projects/project-card/project-card';
import { projectsByGroup } from './projects/projects.util';
import { WhatsNewBand } from './updates/whats-new-band/whats-new-band';
import { FEATURE_FLAGS } from './app.config';

@Component({
  selector: 'app-root',
  imports: [ProjectCard, WhatsNewBand],
  templateUrl: './app.html',
})
export class App {
  protected title = 'gurezo portal site';
  protected readonly groupSections = PROJECT_GROUP_SECTIONS.map((section) => ({
    ...section,
    projects: projectsByGroup(PROJECTS, section.id),
  }));
  protected readonly showUpdatesNav = FEATURE_FLAGS.ENABLE_UPDATES_NAV;
}
