"use client";

import { useEffect, useState } from "react";
import Categories from "@/components/Category";
import BrandSection from "@/components/BrandSection";
import HomeBlogPreview from "@/components/BlogSection";
import BannerSlider from "@/components/BannerSlider";
import Discount from "@/components/DiscountSection";
import AboutSection from "@/components/AboutSection";
import Newsletter from "@/components/Newsletter";
import { ReviewCard } from "@/components/ReviewCard";
import { fetchPublicReviews } from "@/services/Reviews";
import { fetchSiteContent } from "@/services/Content";
import { defaultSiteContent } from "@/data/content";
import { SiteContent } from "@/types/content";
import { TReview } from "@/types/review";
import HomeHighlights from "@/components/HomeHighlights";
import FaqSection from "@/components/FaqSection";

const Home = () => {
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const load = async () => {
      const [reviewsRes, contentRes] = await Promise.all([fetchPublicReviews(4), fetchSiteContent()]);
      if (reviewsRes?.success) {
        setReviews(reviewsRes.data);
      }
      if (contentRes?.success && contentRes.data) {
        setContent({
          ...defaultSiteContent,
          ...contentRes.data,
          banners:
            contentRes.data.banners && contentRes.data.banners.length
              ? contentRes.data.banners
              : defaultSiteContent.banners,
          faqs:
            contentRes.data.faqs && contentRes.data.faqs.length
              ? contentRes.data.faqs
              : defaultSiteContent.faqs,
          highlights:
            contentRes.data.highlights && contentRes.data.highlights.length
              ? contentRes.data.highlights
              : defaultSiteContent.highlights,
        });
      }
    };
    load();
  }, []);

  return (
    <div>
      <BannerSlider slides={content.banners} />
      <BrandSection></BrandSection>
      <Categories />
      <HomeHighlights highlights={content.highlights} />
      <Discount></Discount>
      <HomeBlogPreview></HomeBlogPreview>
      <FaqSection faqs={content.faqs} />
      <Newsletter></Newsletter>
      <AboutSection></AboutSection>
      <h2 className="text-3xl text-center mt-4 mb-6 font-bold">
        Customer <span className="text-pink-600">Review</span>
      </h2>
      <div className="grid grid-cols-1 w-11/12 mx-auto sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.length ? (
          reviews.map((review) => <ReviewCard key={review._id} review={review} />)
        ) : (
          <div className="col-span-full rounded-3xl bg-white p-6 text-center text-gray-600 shadow-sm">
            Genuine customer reviews will appear here once published.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
