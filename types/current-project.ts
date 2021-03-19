export interface Project {
  vid: string;
  version: number;
}

export interface CurrentProject {
  get(): Project | null;
}
