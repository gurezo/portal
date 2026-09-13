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
  'web-app': 'Web Application',
  data: 'Data Repository',
  tool: 'Tool',
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Active',
  experimental: 'Experimental',
  maintenance: 'Maintenance',
  archived: 'Archived',
};

const GROUP_LABELS: Record<ProjectGroup, string> = {
  libraries: 'Libraries',
  'chirimen-tools': 'CHIRIMEN Tools',
};

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

export function visibleProjectStatus(
  status: ProjectStatus | undefined,
): Exclude<ProjectStatus, 'active'> | undefined {
  if (status === undefined || status === 'active') {
    return undefined;
  }

  return status;
}

export function groupLabel(group: ProjectGroup): string {
  return GROUP_LABELS[group];
}
