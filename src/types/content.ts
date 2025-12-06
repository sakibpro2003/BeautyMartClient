export type BannerContent = {
  _id?: string;
  title: string;
  description: string;
  image: string;
  ctaLabel?: string;
  ctaLink?: string;
  isActive?: boolean;
};

export type FaqItem = {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
};

export type HighlightItem = {
  _id?: string;
  title: string;
  description: string;
  badge?: string;
};

export type SiteContent = {
  _id?: string;
  banners: BannerContent[];
  faqs: FaqItem[];
  highlights: HighlightItem[];
  updatedBy?: string;
  updatedAt?: string;
};
