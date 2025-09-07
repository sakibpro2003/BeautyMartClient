export interface Blog {
  id: string;
  title: string;
  blogSlug: string;
  image: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  tags: string[];
  readingTime: string;
  category: string;
  likes: number;
}

export const blogs: Blog[] = [
  {
    id: "88",
    title: "The Role of Vitamins in Glowing Skin",
    blogSlug: "vitamins-for-skin-glow",
    image: "/blog/image1.png",
    content:
      "Vitamins play a major role in keeping your skin healthy and radiant. Vitamin C boosts collagen and brightens the complexion, Vitamin E helps fight free radicals and reduces signs of aging, while Vitamin A (retinol) supports cell turnover for smoother skin.\n\nA diet rich in fruits, leafy greens, nuts, and seeds can give your skin the nutrients it needs. Still, many beauty products now include these vitamins directly in serums, creams, and oils for targeted benefits.\n\nOverusing supplements or strong vitamin-based products can cause irritation, so balance is key. Always patch test new products and consult a dermatologist for stronger treatments like retinoids.\n\nMaking vitamins part of your skincare—inside and out—can give your skin a natural glow while preventing premature aging.",
    excerpt: "Discover how vitamins improve skin health and add natural radiance.",
    publishedAt: "2025-04-01",
    author: "Dr. Ayesha Karim",
    tags: ["Skincare", "Vitamins", "Glow"],
    readingTime: "5 min",
    category: "Skincare",
    likes: 120,
  },
  {
    id: "89",
    title: "Haircare 101: Understanding Shampoo & Conditioner",
    blogSlug: "haircare-basics",
    image:
      "/blog/image2.png",
    content:
      "Shampoos and conditioners are the foundation of any haircare routine. While shampoos cleanse the scalp and remove buildup, conditioners restore moisture, reduce frizz, and protect against damage.\n\nUsing the wrong products can leave hair dull or dry. For example, sulfate-heavy shampoos can strip natural oils, while lightweight conditioners may not be enough for curly or textured hair.\n\nTo get the best results, choose formulas designed for your hair type—hydrating for dry hair, clarifying for oily scalp, and color-safe for treated hair. Natural ingredients like argan oil, keratin, and aloe vera are often added to enhance shine and strength.\n\nHealthy, glossy hair starts with the basics: cleansing gently and conditioning regularly.",
    excerpt: "Learn how to pick the right shampoo and conditioner for healthy hair.",
    publishedAt: "2025-04-05",
    author: "Dr. Mahmood Rahman",
    tags: ["Haircare", "Shampoo", "Conditioner"],
    readingTime: "5 min",
    category: "Haircare",
    likes: 94,
  },
  {
    id: "90",
    title: "Herbal Beauty: Natural Remedies for Skin & Hair",
    blogSlug: "herbal-beauty-remedies",
    image: "/blog/image3.png",
    content:
      "Nature has always been a powerful source of beauty care. Herbal remedies like aloe vera, turmeric, green tea, and neem are widely used in skincare and haircare to treat acne, soothe inflammation, and add natural shine.\n\nFor skin, turmeric face masks brighten and fight blemishes, while aloe vera hydrates and calms irritation. For hair, amla and hibiscus strengthen roots and promote growth.\n\nThough natural, herbs can sometimes irritate sensitive skin, so patch testing is important. Choosing herbal-based beauty products with proper testing ensures safety and effectiveness.\n\nHerbal remedies are a gentle way to enhance beauty routines, offering natural radiance without harsh chemicals.",
    excerpt: "Unlock the beauty benefits of natural herbal remedies for skin & hair.",
    publishedAt: "2025-04-10",
    author: "Dr. Saira Alam",
    tags: ["Herbal", "Natural Beauty", "Skin & Hair"],
    readingTime: "5 min",
    category: "Natural Beauty",
    likes: 77,
  },
  {
    id: "91",
    title: "The Link Between Self-Care and Beauty",
    blogSlug: "self-care-and-beauty",
    image: "/blog/image4.png",
    content:
      "True beauty goes beyond skincare and makeup—it’s also about how you feel inside. Stress, lack of sleep, and poor lifestyle habits can dull your skin, weaken your hair, and affect overall appearance.\n\nA good self-care routine improves both mental and physical well-being, which reflects in natural beauty. Meditation, proper sleep, hydration, and a balanced diet can reduce breakouts, dark circles, and hair fall.\n\nPampering yourself with beauty rituals—like face masks, massages, or aromatherapy—also reduces stress and enhances confidence. Beauty and wellness are deeply connected, creating a glow that comes from within.\n\nTaking care of your mind and body is the real secret to lasting beauty.",
    excerpt: "See how self-care routines improve both inner wellness and outer beauty.",
    publishedAt: "2025-04-12",
    author: "Dr. Tanvir Hossain",
    tags: ["Beauty", "Self-care", "Wellness"],
    readingTime: "6 min",
    category: "Wellness",
    likes: 145,
  },
];
