export interface sidebarItemType {
  id: number;
  text: string;
  path?: string;
  handleClick?: () => void;
}

export interface jobProfileType {
  id: number;
  ques: string;
  answer: string;
}
