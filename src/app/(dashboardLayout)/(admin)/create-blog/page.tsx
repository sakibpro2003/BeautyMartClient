"use client";

import withAdminAuth from "@/hoc/withAdminAuth";
import { mergeBlogs, saveBlogToStorage } from "@/utils/blogStorage";
import { uploadImage } from "@/utils/uploadImage";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Blog, blogs as defaultBlogs } from "../../../../../data/blogs";

const initialDate = new Date().toISOString().slice(0, 10);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "new-post";

const estimateReadingTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length || 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
};

const CreateBlogPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    blogSlug: "",
    image: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    publishedAt: initialDate,
  });
  const [slugLocked, setSlugLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const readingTime = useMemo(() => estimateReadingTime(formData.content), [formData.content]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title" && !slugLocked) {
      setFormData((prev) => ({ ...prev, title: value, blogSlug: slugify(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlugChange = (value: string) => {
    setSlugLocked(true);
    setFormData((prev) => ({ ...prev, blogSlug: slugify(value) }));
  };

  const handleFileSelect = (file?: File) => {
    if (!file) {
      setImageFile(null);
      setPreviewUrl("");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const combinedBlogs = mergeBlogs(defaultBlogs);

    const slug = formData.blogSlug || slugify(formData.title);

    if (combinedBlogs.some((blog) => blog.blogSlug === slug)) {
      toast.error("A blog with this URL slug already exists. Please choose another.");
      return;
    }

    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error("Title, excerpt, and content are required.");
      return;
    }

    setSubmitting(true);

    let imageUrl = formData.image;

    try {
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile, "beautymart/blogs");
        toast.success("Image uploaded to Cloudinary.");
      }

      const newBlog: Blog = {
        id: `${Date.now()}`,
        title: formData.title.trim(),
        blogSlug: slug,
        image: imageUrl || "/blog/image-placeholder.png",
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        publishedAt: formData.publishedAt || initialDate,
        author: formData.author || "Admin",
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        readingTime,
        category: formData.category || "General",
        likes: 0,
      };

      saveBlogToStorage(newBlog);
      toast.success("Blog saved locally. It now appears on the blog page.");
      router.push("/blog");
    } catch (error: any) {
      toast.error(error?.message || "Failed to publish blog.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Create blog post</h1>
            <p className="text-sm text-gray-600">
              Draft a new story for the BeautyMart community.
            </p>
          </div>
          <div className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow">
            Blog manager
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                placeholder="Summer skincare essentials"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                rows={3}
                placeholder="One or two sentences that summarize the post."
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-800">Cover image</label>
                {imageFile && (
                  <span className="text-xs text-pink-600 font-semibold">File selected</span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                        <ImageIcon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Upload cover</p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 2MB</p>
                      </div>
                    </div>
                    <label
                      htmlFor="blog-image-upload"
                      className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-pink-700 cursor-pointer"
                    >
                      <Upload size={14} />
                      Choose file
                    </label>
                    <input
                      id="blog-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    />
                  </div>
                  {(previewUrl || formData.image) && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-pink-100 bg-white">
                      <img
                        src={previewUrl || formData.image}
                        alt="Cover preview"
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  placeholder="/blog/hero.png or https://..."
                />
                <p className="text-xs text-gray-500">
                  Image uploads run when you publish. You can also paste an existing URL.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-800">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  placeholder="Admin"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  placeholder="Skincare"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                rows={9}
                placeholder="Write your blog content here..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Estimated reading time: {readingTime}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-800">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  placeholder="skincare, glow, routine"
                />
                <p className="mt-1 text-xs text-gray-500">Comma separated</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800">Publish date</label>
                <input
                  type="date"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800">URL slug</label>
              <input
                type="text"
                name="blogSlug"
                value={formData.blogSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                placeholder="summer-skincare-essentials"
              />
              <p className="mt-1 text-xs text-gray-500">
                Auto-generated from the title. You can override it if needed.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3">
          <div className="rounded-full bg-pink-50 px-4 py-2 text-xs font-semibold text-pink-700">
            Draft saved locally (no server endpoint)
          </div>
          <button
            type="submit"
            disabled={submitting || uploading}
            className={`rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5 hover:shadow-xl ${
              submitting || uploading ? "opacity-70" : ""
            }`}
          >
            {uploading ? "Uploading image..." : submitting ? "Saving..." : "Publish to blog page"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAdminAuth(CreateBlogPage);
