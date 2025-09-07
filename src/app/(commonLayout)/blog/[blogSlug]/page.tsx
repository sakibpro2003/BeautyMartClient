/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft } from "lucide-react"; // Use icon
import { blogs } from "../../../../../data/blogs";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import NextLink from "next/link"; // Import Next.js Link

export default function BlogDetailsPage({ params }: any) {
  const blog = blogs.find((b) => b.blogSlug === params.blogSlug);

  if (!blog) return notFound();

  return (
    <main className="w-11/12 md:w-10/12 lg:w-8/12 mx-auto py-16 px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-pink-600">
        {blog.title}
      </h1>

      {/* Metadata */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center text-gray-500 text-sm mb-8 gap-2">
        <div>
          Published on {new Date(blog.publishedAt).toLocaleDateString()}
          {blog.readingTime && <> · {blog.readingTime}</>}
        </div>
        {blog.author && <span className="italic">by {blog.author}</span>}
      </div>

      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
          unoptimized
        />
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {blog.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-pink-200 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Blog Content */}
      <article className="prose max-w-none prose-lg prose-pink text-gray-800 leading-relaxed text-justify">
        {blog.content}
      </article>

      {/* CTA / Back Button */}
      <div className="mt-12 flex justify-center">
        <NextLink href="/blog">
          <Button className="flex bg-pink-600 text-white items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </NextLink>
      </div>
    </main>
  );
}
