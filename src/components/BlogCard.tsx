"use client";

import Link from "next/link";
import { Blog } from "../../data/blogs";
import Image from "next/image";

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${blog.blogSlug}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative w-full h-48 md:h-52 lg:h-56 overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-500 text-sm mt-2 line-clamp-3">{blog.excerpt}</p>

        {/* Read More */}
        <div className="mt-4 text-right">
          <span className="text-pink-600 font-medium text-sm group-hover:underline transition">
            Read More →
          </span>
        </div>
      </div>
    </Link>
  );
};
