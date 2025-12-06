import { BannerContent, FaqItem, HighlightItem, SiteContent } from "@/types/content";

export const defaultBanners: BannerContent[] = [
  {
    title: "Glow with Confidence",
    description: "Discover premium skincare products that bring out your natural radiance.",
    image: "/banners/image.png",
    ctaLabel: "Shop Skincare",
    ctaLink: "/products?category=skincare",
    isActive: true,
  },
  {
    title: "Luxury Meets Affordability",
    description: "Get high-quality beauty essentials at prices you will love.",
    image: "/banners/image2.png",
    ctaLabel: "Shop Bestsellers",
    ctaLink: "/products",
    isActive: true,
  },
  {
    title: "Makeup for Every Occasion",
    description: "From everyday looks to glam nights, find makeup that suits your style.",
    image: "/banners/image3.png",
    ctaLabel: "Shop Makeup",
    ctaLink: "/products?category=makeup",
    isActive: true,
  },
  {
    title: "Nourish Your Hair",
    description: "Explore shampoos, conditioners, and treatments for healthy, shiny hair.",
    image: "/banners/image4.png",
    ctaLabel: "Shop Haircare",
    ctaLink: "/products?category=haircare",
    isActive: true,
  },
];

export const defaultFaqs: FaqItem[] = [
  {
    question: "Do you offer free shipping?",
    answer: "Yes, we provide free delivery on eligible carts and run free shipping promos often.",
    category: "Orders",
  },
  {
    question: "Are your products cruelty-free?",
    answer: "Most of our assortment is cruelty-free and we clearly label items so you can shop with confidence.",
    category: "Products",
  },
  {
    question: "What is your return policy?",
    answer: "Unopened or gently used items can be returned within 30 days of purchase.",
    category: "Orders",
  },
  {
    question: "How fast do you deliver?",
    answer: "We dispatch orders within 24 hours and typical delivery takes 2-5 business days.",
    category: "Shipping",
  },
];

export const defaultHighlights: HighlightItem[] = [
  {
    title: "Dermatologist trusted",
    description: "Formulas vetted for sensitive skin with transparent ingredient lists.",
    badge: "Clean picks",
  },
  {
    title: "Fast delivery perks",
    description: "Free shipping boosts and next-day delivery in select cities.",
    badge: "Free & fast",
  },
  {
    title: "Confident purchases",
    description: "Easy 30-day returns plus human support when you need it.",
    badge: "Hassle-free",
  },
];

export const defaultSiteContent: SiteContent = {
  banners: defaultBanners,
  faqs: defaultFaqs,
  highlights: defaultHighlights,
};
