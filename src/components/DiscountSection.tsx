"use client";

import Image from "next/image";
import Link from "next/link";

const DiscountSection = () => {
  return (
    <section className="w-11/12 mx-auto mt-12 relative rounded-xl overflow-hidden bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 shadow-2xl py-16 px-6">
      
      {/* Decorative Shapes */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-300 rounded-full opacity-25 animate-pulse"></div>

      <div className="relative z-10 mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Text Content */}
        <div className="text-center md:text-left text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Get Up to <span className="text-yellow-300">30% Off</span> on Your Beauty Order!
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Save big on skincare, haircare, and makeup products. Limited-time offer for first-time customers. Premium quality, delivered fast!
          </p>
          <Link href="/products">
            <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-pink-50 transition">
              Shop Now
            </button>
          </Link>
        </div>

        {/* Image */}
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/category/discount.png"
            alt="Discount Offer"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;
