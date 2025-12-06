import { TOrder } from "./order";

export type ReturnStatus = "pending" | "approved" | "denied" | "refunded" | "exchanged" | "closed";
export type ReturnType = "refund" | "exchange";

export type ReturnItem = {
  product: string;
  quantity: number;
  _id?: string;
};

export type ReturnRequest = {
  _id?: string;
  order: string | TOrder;
  user?: string;
  items: ReturnItem[];
  reason: string;
  notes?: string;
  images?: string[];
  status: ReturnStatus;
  type: ReturnType;
  resolutionNote?: string;
  createdAt?: string;
};

export type ReturnReasonSummary = {
  reason: string;
  count: number;
};
