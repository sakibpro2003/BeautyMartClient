export type TOrder = {
  _id: string;
  user: { _id: string; name: string };
  products: {
    product: {
      _id: string;
      name: string;
      image: string;
    };
    quantity: number;
    totalPrice: number;
    _id: string;
  }[];
  address: string;
  paymentMethod: string;
  totalAmount: number;
  status:
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "pending"
    | "completed";
  createdAt: string;
  updatedAt: string;
};
