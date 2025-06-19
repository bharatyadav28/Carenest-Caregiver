export interface sidebarItemType {
  id: number;
  text: string;
  path?: string;
  handleClick?: () => void;
}

export interface jobProfileType {
  qid: string;
  oid: string | string[];
}

export interface reasonType {
  id: number;
  title: string;
  description: string;
}
