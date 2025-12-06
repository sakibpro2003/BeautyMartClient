"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { BannerContent } from "@/types/content";
import { defaultBanners } from "@/data/content";

type Props = {
  slides?: BannerContent[];
};

const BannerSlider = ({ slides }: Props) => {
  const bannerSlides = useMemo(() => {
    const source = slides && slides.length ? slides : defaultBanners;
    return source.filter((item) => item.isActive !== false);
  }, [slides]);

  return (
    <div className="relative mx-auto w-11/12">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className="h-full overflow-hidden rounded-3xl shadow-lg"
      >
        {bannerSlides.map((slide, index) => (
          <SwiperSlide key={slide._id || slide.title || index}>
            <div className="relative h-[520px] w-full overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                unoptimized
              />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-transparent">
                <div className="flex h-full w-full items-center px-6 pb-16 pt-12 sm:px-10 lg:px-16">
                  <div className="max-w-2xl space-y-4 text-white">
                    <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pink-100">
                      Featured
                    </p>
                    <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </h2>
                    <p className="text-base text-gray-100 sm:text-lg lg:text-xl">
                      {slide.description}
                    </p>
                    {slide.ctaLabel && (
                      <Link
                        href={slide.ctaLink || "/products"}
                        className="inline-flex items-center justify-center rounded-full bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-pink-500/40"
                      >
                        {slide.ctaLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
