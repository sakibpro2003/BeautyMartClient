"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/banners/image.png",
    heading: "Glow with Confidence",
    description:
      "Discover premium skincare products that bring out your natural radiance.",
    button: "Shop Skincare",
  },
  {
    id: 2,
    image: "/banners/image2.png",
    heading: "Luxury Meets Affordability",
    description:
      "Get high-quality image essentials at prices you’ll love.",
    button: "Shop Now",
  },
  {
    id: 3,
    image: "/banners/image3.png",
    heading: "Makeup for Every Occasion",
    description:
      "From everyday looks to glam nights, find makeup that suits your style.",
    button: "Shop Makeup",
  },
  {
    id: 4,
    image: "/banners/image4.png",
    heading: "Nourish Your Hair",
    description:
      "Explore shampoos, conditioners, and treatments for healthy, shiny hair.",
    button: "Shop Haircare",
  },
  {
    id: 5,
    image: "/banners/image5.png",
    heading: "Fragrance that Defines You",
    description:
      "Find your signature scent from our wide range of perfumes.",
    button: "Shop Fragrance",
  },
  {
    id: 6,
    image: "/banners/image6.png",
    heading: "Fragrance that Defines You",
    description:
      "Find your signature scent from our wide range of perfumes.",
    button: "Shop Fragrance",
  },
];

const BannerSlider = () => {
  return (
    <div className="w-11/12 mx-auto relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className="h-full overflow-hidden rounded-3xl shadow-lg"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[600px]">
              <Image
                src={slide.image}
                alt={slide.heading}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-10 text-center">
                <div className="text-white max-w-xl space-y-4">
                  <h2 className="text-3xl md:text-5xl font-bold">{slide.heading}</h2>
                  <p className="text-lg md:text-xl">{slide.description}</p>
                </div>
                <Link
                  href="/products"
                  className="mt-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
                >
                  {slide.button}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
