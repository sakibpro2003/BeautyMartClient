"use client";

import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Premium Quality",
    description:
      "We source only high-quality beauty products to ensure flawless results.",
  },
  {
    title: "Cruelty-Free & Natural",
    description:
      "Our products are eco-friendly, cruelty-free, and made with natural ingredients.",
  },
  {
    title: "Latest Trends",
    description:
      "Stay ahead with the newest skincare, makeup, and haircare collections.",
  },
  {
    title: "Customer Satisfaction",
    description:
      "We prioritize your experience with personalized support and care.",
  },
];

export default function AboutSection() {
  return (
    <section className="bg-gradient-to-br w-11/12 mx-auto rounded-lg mt-10 from-pink-50 via-pink-100 to-pink-200 py-20 px-6">
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-10 text-pink-800">
        About Our Beauty Store
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image Section */}
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/category/about.png" 
            alt="About Beauty Store"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-pink-700">
            Who We Are
          </h3>
          <p className="text-gray-700">
            At BeautyMart, we believe beauty is for everyone. From skincare and haircare to makeup and fragrances, we bring you premium products that empower confidence and self-expression. Our mission is to provide high-quality, safe, and trendy beauty essentials delivered right to your doorstep.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-pink-700 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={"/about"}
            className="inline-block mt-6 bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
