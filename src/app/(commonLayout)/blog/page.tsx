import { Metadata } from "next";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Blog - BeautyMart",
  description:
    "Explore BeautyMart’s blog for beauty tips, skincare insights, and wellness guidance.",
};

export default function BlogListPage() {
  return <BlogListClient />;
}
