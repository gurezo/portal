export type ProjectCategory = 'library' | 'web-app' | 'data' | 'tool';

export type ProjectGroup = 'libraries' | 'chirimen-tools';

export type ProjectStatus = 'active';

export type ProjectLinkKind =
  | 'docs'
  | 'examples'
  | 'app'
  | 'github'
  | 'npm'
  | 'data';

export interface ProjectLink {
  label: string;
  url: string;
  kind?: ProjectLinkKind;
}

export interface OssProject {
  id: string;
  name: string;
  packageName?: string;
  category: ProjectCategory;
  group?: ProjectGroup;
  status?: ProjectStatus;
  description: string;
  summary?: string;
  featured?: boolean;
  technologies?: string[];
  links: ProjectLink[];
}
