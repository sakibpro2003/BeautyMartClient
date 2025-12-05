export type TReview = {
  _id: string;
  product: {
    _id: string;
    name: string;
    image?: string;
  };
  user?: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  order: string;
  rating: number;
  title?: string;
  comment: string;
  sentiment: "positive" | "negative" | "neutral";
  keywords: string[];
  status: "pending" | "approved" | "rejected";
  adminReply?: string;
  createdAt: string;
};

