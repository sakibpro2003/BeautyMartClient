"use client";

import Categories from "@/components/Category";
import BrandSection from "@/components/BrandSection";
import HomeBlogPreview from "@/components/BlogSection";
import BannerSlider from "@/components/BannerSlider";
import Discount from "@/components/DiscountSection";
import AboutSection from "@/components/AboutSection";
import Newsletter from "@/components/Newsletter";
import { ReviewCard } from "@/components/ReviewCard";
import { reviews } from "../../../data/reviews";

const Home = () => {
  return (
    <div>
      {/* <Banner /> */}
      <BannerSlider></BannerSlider>
      <BrandSection></BrandSection>
      <Categories />
      <Discount></Discount>
      <HomeBlogPreview></HomeBlogPreview>
      <Newsletter></Newsletter>
      <AboutSection></AboutSection>
      <h2 className="text-3xl text-center mt-4 mb-6 font-bold">Customer <span className="text-pink-600">Review</span></h2>
       <div className="grid grid-cols-1 w-11/12 mx-auto sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default Home;
