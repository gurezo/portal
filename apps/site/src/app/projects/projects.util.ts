import {
  OssProject,
  ProjectCategory,
  ProjectGroup,
  ProjectLink,
  ProjectLinkKind,
  ProjectStatus,
} from './project.model';

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  library: 'Library',
  'web-app': 'Web App',
  data: 'Data',
  tool: 'Tool',
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Active',
};

const GROUP_LABELS: Record<ProjectGroup, string> = {
  libraries: 'Libraries',
  'chirimen-tools': 'CHIRIMEN Tools',
};

export function featuredProject(
  projects: readonly OssProject[],
): OssProject | undefined {
  return projects.find((project) => project.featured);
}

export function projectsByGroup(
  projects: readonly OssProject[],
  group: ProjectGroup,
): OssProject[] {
  return projects.filter((project) => project.group === group);
}

export function projectLink(
  project: OssProject,
  kind: ProjectLinkKind,
): ProjectLink | undefined {
  return project.links.find((link) => link.kind === kind);
}

export function categoryLabel(category: ProjectCategory): string {
  return CATEGORY_LABELS[category];
}

export function statusLabel(status: ProjectStatus): string {
  return STATUS_LABELS[status];
}

export function groupLabel(group: ProjectGroup): string {
  return GROUP_LABELS[group];
}
