export type FeedbackType = "complaint" | "suggestion" | "question";
export type FeedbackStatus = "open" | "in-progress" | "resolved";

export type TFeedback = {
  _id: string;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  subject: string;
  message: string;
  type: FeedbackType;
  status: FeedbackStatus;
  adminReply?: string;
  createdAt?: string;
  updatedAt?: string;
};
