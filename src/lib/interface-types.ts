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

// lib/interface-types.ts (add these)
export interface SubscriptionType {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'none';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  plan?: {
    id: string;
    name: string;
    description: string;
    amount: number;
    interval: string;
    displayAmount: string;
  };
}

export interface PlanType {
  id: string;
  name: string;
  description: string;
  amount: number;
  interval: string;
  displayAmount: string;
  isActive: boolean;
}