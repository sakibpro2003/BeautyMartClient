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
import { TReview } from "@/types/review";

const Home = () => {
  const [reviews, setReviews] = useState<TReview[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchPublicReviews(4);
      if (res?.success) {
        setReviews(res.data);
      }
    };
    load();
  }, []);

  return (
    <div>
      <BannerSlider></BannerSlider>
      <BrandSection></BrandSection>
      <Categories />
      <Discount></Discount>
      <HomeBlogPreview></HomeBlogPreview>
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
