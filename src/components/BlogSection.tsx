// HomeBlogPreview.tsx
"use client";

import { useEffect, useState } from "react";
import { mergeBlogs, BLOG_STORAGE_KEY } from "@/utils/blogStorage";
import { Blog, blogs } from "../../data/blogs";
import { BlogCard } from "./BlogCard";

const HomeBlogPreview = () => {
  const [topBlogs, setTopBlogs] = useState<Blog[]>(blogs.slice(0, 4));

  useEffect(() => {
    const refreshBlogs = () => setTopBlogs(mergeBlogs(blogs).slice(0, 4));

    refreshBlogs();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === BLOG_STORAGE_KEY) {
        refreshBlogs();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="w-11/12 mt-12 mx-auto align-middle justify-center items-center content-center">
      <h2 className="text-3xl  text-center font-bold mb-6">Latest <span className="text-pink-600">Blogs</span></h2>
      <div className="">
        <div className="grid grid-cols-1 gap-8 justify-center sm:grid-cols-2 md:grid-cols-4 ">
          {topBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBlogPreview;
