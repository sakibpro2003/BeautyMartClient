import { Blog } from "../../data/blogs";

export const BLOG_STORAGE_KEY = "beautymart-custom-blogs";

const isBrowser = () => typeof window !== "undefined";

export const loadStoredBlogs = (): Blog[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Blog[]) : [];
  } catch (error) {
    console.error("Failed to read blogs from storage", error);
    return [];
  }
};

export const saveBlogToStorage = (blog: Blog): Blog[] => {
  if (!isBrowser()) return [];
  const existing = loadStoredBlogs().filter((item) => item.blogSlug !== blog.blogSlug);
  const updated = [...existing, blog];
  window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const mergeBlogs = (baseBlogs: Blog[]): Blog[] => {
  const merged = [...baseBlogs, ...loadStoredBlogs()];
  const uniqueBySlug = Array.from(new Map(merged.map((blog) => [blog.blogSlug, blog])).values());
  return uniqueBySlug.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};
