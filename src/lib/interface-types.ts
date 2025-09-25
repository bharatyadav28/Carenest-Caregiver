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

export interface planDataType {
  id: string;
  name: string;
  price: string;
  interval: string;
  period: string;
  benefits: string[];
}

export interface reasonType {
  id: number;
  title: string;
  description: string;
}

export interface chatMessageType {
  id: string;
  conversationId: string;
  isOtherUserMessage: boolean;
  message: string;
  createdAt: string;
  hasRead: boolean;
}
