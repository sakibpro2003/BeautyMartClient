export type DiscountType = "percentage" | "fixed";

export interface Promotion {
  _id?: string;
  id: string;
  name: string;
  code: string;
  description: string;
  discountType: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  minimumOrder?: number;
}

export const seedPromotions: Promotion[] = [
  {
    id: "p-100",
    name: "Spring Glow",
    code: "GLOW15",
    description: "15% off skincare for a limited time.",
    discountType: "percentage",
    value: 15,
    startDate: "2025-03-01",
    endDate: "2025-04-30",
    usageLimit: 200,
    usedCount: 68,
    minimumOrder: 50,
  },
  {
    id: "p-101",
    name: "Fragrance Faves",
    code: "SCENT25",
    description: "$25 off perfumes on orders over $120.",
    discountType: "fixed",
    value: 25,
    startDate: "2025-04-10",
    endDate: "2025-05-31",
    usageLimit: 150,
    usedCount: 32,
    minimumOrder: 120,
  },
  {
    id: "p-102",
    name: "Weekend Flash",
    code: "WEEKEND10",
    description: "10% off sitewide every weekend.",
    discountType: "percentage",
    value: 10,
    startDate: "2025-04-18",
    endDate: "2025-04-20",
    usageLimit: 500,
    usedCount: 210,
  },
];
