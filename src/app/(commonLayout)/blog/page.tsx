import { Metadata } from "next";
import { blogs } from "../../../../data/blogs";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - BeautyMart",
  description:
    "Explore BeautyMart’s blog for beauty tips, skincare insights, and wellness guidance.",
};

export default function BlogListPage() {
  return (
    <main className="w-11/12 mx-auto px-4 py-16 h-screen">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-pink-600">
        Health & Wellness Blog
      </h1>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.blogSlug}`}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-pink-300 overflow-hidden transition-transform duration-300 transform hover:-translate-y-1"
          >
            {/* Blog Image */}
            <div className="relative w-full h-56">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-300/30 via-transparent to-transparent"></div>
            </div>

            {/* Blog Content */}
            <div className="p-5 flex flex-col justify-between h-full">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                {blog.title}
              </h2>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center justify-between text-xs text-pink-500 mb-3">
                <div>
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  {blog.readingTime && <span> · {blog.readingTime}</span>}
                </div>
                {blog.author && <span className="italic">by {blog.author}</span>}
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-pink-100 text-pink-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
