// data/reviews.ts
export interface Review {
  id: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  title: string;
  productUsed: string;
  image: string;
  summary: string;
  fullReview: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "Alice",
    location: "Dhaka, Bangladesh",
    date: "2025-05-01",
    rating: 5,
    title: "Glowing Skin in Days!",
    productUsed: "Nivea Hydrating Serum",
    image: "/reviewer/r1.jpg",
    summary: "My skin feels smoother and radiant!",
    fullReview:
      "I've been using the Nivea Hydrating Serum for a week and already see a noticeable glow. The texture is light, absorbs quickly, and doesn’t leave a greasy feel. Packaging is elegant and travel-friendly. Highly recommend for anyone looking for a quick skincare boost!",
  },
  {
    id: "2",
    name: "Bob",
    location: "Chattogram, Bangladesh",
    date: "2025-04-28",
    rating: 4,
    title: "Hair Feels Healthier",
    productUsed: "L'Oréal Hair Repair Shampoo",
    image: "/reviewer/r2.jpg",
    summary: "My hair is soft and manageable now.",
    fullReview:
      "L'Oréal Hair Repair Shampoo has been a game-changer. After just a few washes, my hair feels stronger, frizz is reduced, and shine has improved. The scent is pleasant and lingers gently. Best for dry and damaged hair. I also appreciate that it lathers well and rinses easily.",
  },
  {
    id: "3",
    name: "Clara",
    location: "Khulna, Bangladesh",
    date: "2025-04-26",
    rating: 5,
    title: "Beautiful Nails",
    productUsed: "OPI Nail Polish Kit",
    image: "/reviewer/r3.jpg",
    summary: "Salon-quality nails at home!",
    fullReview:
      "I bought the OPI Nail Polish Kit and it’s fantastic. The colors are vibrant, the polish lasts long, and it applies smoothly. The kit included tools that made nail care so easy at home. Friends complimented my nails, and I feel confident doing my own manicure now. A must-have for beauty enthusiasts!",
  },
  {
    id: "4",
    name: "David",
    location: "Rajshahi, Bangladesh",
    date: "2025-04-22",
    rating: 5,
    title: "Fragrance I Love",
    productUsed: "Chanel Perfume No.5",
    image: "/reviewer/r4.jpg",
    summary: "Elegant scent that lasts all day.",
    fullReview:
      "Chanel Perfume No.5 exceeded my expectations. The fragrance is luxurious and long-lasting, perfect for both day and evening. I get compliments every time I wear it. The bottle design is classic and beautiful on my vanity. Truly a premium product that feels like a treat every day.",
  },
];
