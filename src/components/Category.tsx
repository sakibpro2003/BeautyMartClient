import Image from "next/image";
import React from "react";
import Link from "next/link";

interface Category {
  name: string;
  description: string;
  image: string;
  query: string;
}

const categories: Category[] = [
  {
    name: "Skincare",
    description: "Cleansers, moisturizers, serums, and sunscreens for glowing skin.",
    image: "/category/skincare.png",
    query: "Skincare",
  },
  {
    name: "Haircare",
    description: "Shampoos, conditioners, oils, and treatments for healthy hair.",
    image: "/category/haircare.png",
    query: "Haircare",
  },
  {
    name: "Makeup",
    description: "Lipsticks, foundations, mascaras, and more for every look.",
    image: "/category/makeup.png",
    query: "Makeup",
  },
  {
    name: "Fragrance",
    description: "Perfumes and body mists that define your unique style.",
    image: "/category/fragrance.png",
    query: "Fragrance",
  },
  {
    name: "Bath & Body",
    description: "Body lotions, scrubs, and shower gels for everyday care.",
    image: "/category/bath&body.png",
    query: "Bath",
  },
  {
    name: "Nails",
    description: "Nail polishes, removers, and kits for perfect nails.",
    image: "/category/nails.png",
    query: "Nails",
  },
  {
    name: "Men’s Grooming",
    description: "Beard oils, shaving kits, and skincare essentials for men.",
    image: "/category/mensgrooming.png",
    query: "Men",
  },
   {
    name: "Lip",
    description: "Lipsticks, lip balms, and lip care products for every occasion.",
    image: "https://image.made-in-china.com/2f0j00drTqgKNsAtzS/Four-Natural-Organic-Moisturizing-Dry-Lips-Non-Greasy-Fruit-Flavored-Lips-Balm.webp",
    query: "Lip",
  },
];

const Categories = () => {
  return (
    <section className="w-11/12 mx-auto py-12">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Explore Our Beauty Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/products?category=${encodeURIComponent(category.query)}`}
            className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="relative w-full h-64">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex flex-col justify-end p-6">
              <h3 className="text-white text-xl font-semibold mb-1">{category.name}</h3>
              <p className="text-white text-sm opacity-90">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
