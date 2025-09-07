"use client";
import Link from "next/link";

const brands = [
  { name: "Nivea" },
  { name: "LOreal" },
  { name: "Rajkonna" },
  { name: "Ponds" },
  { name: "Himalaya" },
  { name: "Vaseline" },
];

const BrandSection = () => {
  return (
    <section className="py-12 w-11/12 mt-6 mx-auto">
      <h2 className="text-3xl text-center font-bold mb-10">
        Shop by <span className="text-pink-600">Brand&apos;s</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={`/products?brand=${encodeURIComponent(brand.name)}`}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 px-4 py-8 flex flex-col items-center justify-center text-center hover:bg-pink-50"
          >
            {/* Optional: Brand logo can go here */}
            <span className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BrandSection;
