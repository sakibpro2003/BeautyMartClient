import React, { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products - BeautyMart",
  description:
    "Learn more about BeautyMart and our commitment to healthcare excellence.",
};

const Page = () => {
  return (
    <div className="">
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductCard />
      </Suspense>
    </div>
  );
};

export default Page;
