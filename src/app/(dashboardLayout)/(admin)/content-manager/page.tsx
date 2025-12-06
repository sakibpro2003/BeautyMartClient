"use client";

import { useEffect, useMemo, useState } from "react";
import withAdminAuth from "@/hoc/withAdminAuth";
import { defaultSiteContent } from "@/data/content";
import { BannerContent, FaqItem, HighlightItem, SiteContent } from "@/types/content";
import { fetchSiteContent, saveSiteContent } from "@/services/Content";
import { toast } from "react-toastify";
import { Loader2, Plus, RefreshCcw, Save, Trash } from "lucide-react";
import { uploadImage } from "@/utils/uploadImage";

type EditableSection = "banners" | "faqs" | "highlights";

const makeId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const normalizeContent = (incoming?: SiteContent | null): SiteContent => ({
  ...defaultSiteContent,
  ...incoming,
  banners:
    incoming?.banners && incoming.banners.length ? incoming.banners : defaultSiteContent.banners,
  faqs: incoming?.faqs && incoming.faqs.length ? incoming.faqs : defaultSiteContent.faqs,
  highlights:
    incoming?.highlights && incoming.highlights.length
      ? incoming.highlights
      : defaultSiteContent.highlights,
});

const ContentManagerPage = () => {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState<EditableSection | null>(null);
  const [bannerUploads, setBannerUploads] = useState<Record<string, File>>({});

  const lastUpdated = useMemo(() => {
    if (!content?.updatedAt) return null;
    return new Date(content.updatedAt).toLocaleString();
  }, [content?.updatedAt]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const res = await fetchSiteContent();
      if (res?.success && res.data) {
        setContent(normalizeContent(res.data));
      } else {
        setContent(defaultSiteContent);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const updateSectionItem = <T extends BannerContent | FaqItem | HighlightItem>(
    section: EditableSection,
    index: number,
    key: keyof T,
    value: T[keyof T]
  ) => {
    setContent((prev) => {
      const list = [...(prev[section] as T[])];
      list[index] = { ...list[index], [key]: value } as T;
      return { ...prev, [section]: list };
    });
  };

  const queueBannerUpload = (file: File, id: string, index: number) => {
    setBannerUploads((prev) => ({ ...prev, [id]: file }));
    // Show a local preview while keeping uploads deferred until save
    const previewUrl = URL.createObjectURL(file);
    updateSectionItem("banners", index, "image", previewUrl);
    toast.info("Image queued. It will upload when you save banners.");
  };

  const addItem = (section: EditableSection) => {
    const next =
      section === "banners"
        ? ({
            title: "New banner headline",
            description: "Short value prop for this hero slide.",
            image: "/banners/image5.png",
            ctaLabel: "Shop now",
            ctaLink: "/products",
            isActive: true,
            _id: makeId(),
          } as BannerContent)
        : section === "faqs"
          ? ({
              question: "New frequently asked question",
              answer: "Add the helpful answer customers should see here.",
              category: "General",
              _id: makeId(),
            } as FaqItem)
          : ({
              title: "New highlight title",
              description: "Explain the promise, perk, or guarantee for shoppers.",
              badge: "New",
              _id: makeId(),
            } as HighlightItem);

    setContent((prev) => ({
      ...prev,
      [section]: [...(prev[section] as Array<typeof next>), next],
    }));
  };

  const removeItem = (section: EditableSection, id: string) => {
    setContent((prev) => {
      const filtered = (prev[section] as { _id?: string }[]).filter(
        (item, idx) => (item._id || idx.toString()) !== id
      );
      return { ...prev, [section]: filtered };
    });
  };

  const save = async (section: EditableSection) => {
    setSaving(section);
    try {
      let payload: Partial<SiteContent> = { [section]: content[section] } as Partial<SiteContent>;

      if (section === "banners") {
        const updatedBanners = [...(content.banners || [])];
        for (let i = 0; i < updatedBanners.length; i++) {
          const banner = updatedBanners[i];
          const id = banner._id || (banner as any).id || i.toString();
          const file = bannerUploads[id];
          if (file) {
            const url = await uploadImage(file, "beautymart/banners");
            updatedBanners[i] = { ...banner, image: url };
          }
        }
        payload = { banners: updatedBanners };
      }

      const res = await saveSiteContent(payload);
      if (res?.unauthorized) {
        toast.error("Please log in as an admin to update content.");
        return;
      }
      if (res?.success && res.data) {
        setContent(normalizeContent(res.data));
        toast.success("Content updated");
        if (section === "banners") {
          setBannerUploads({});
        }
      } else {
        toast.error(res?.message || "Failed to save changes");
      }
    } finally {
      setSaving(null);
    }
  };

  const savingLabel = (section: EditableSection) => saving === section;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Content</p>
            <h1 className="text-2xl font-bold text-gray-900">Content & FAQ manager</h1>
            <p className="text-sm text-gray-600">
              Adjust banner copy, FAQs, and homepage highlights without touching code.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {lastUpdated && (
              <div className="rounded-full bg-pink-50 px-4 py-2 text-xs font-semibold text-pink-700">
                Updated {lastUpdated}
              </div>
            )}
            <button
              onClick={async () => {
                setIsLoading(true);
                const res = await fetchSiteContent();
                if (res?.success && res.data) {
                  setContent(normalizeContent(res.data));
                }
                setIsLoading(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-sm ring-1 ring-gray-100">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-pink-500" />
          <span className="text-sm font-semibold text-gray-700">Loading content...</span>
        </div>
      ) : (
        <>
          <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                  Banners
                </p>
                <h2 className="text-xl font-bold text-gray-900">Homepage hero slides</h2>
                <p className="text-sm text-gray-600">
                  Update imagery, headlines, and CTA destinations. Disable a slide without deleting it
                  by toggling it off.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => addItem("banners")}
                  className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-100"
                >
                  <Plus size={16} />
                  Add banner
                </button>
                <button
                  onClick={() => save("banners")}
                  disabled={savingLabel("banners")}
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-400"
                >
                  {savingLabel("banners") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                  Save banners
                </button>
              </div>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              {(content.banners || []).map((banner, index) => {
                const bannerId = banner._id || (banner as any).id || index.toString();
                const queuedFile = bannerUploads[bannerId];
                return (
                <div
                  key={banner._id || banner.title || index}
                  className="relative overflow-hidden rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/60 via-white to-pink-100/70 p-4 shadow-sm"
                >
                  <button
                    onClick={() => removeItem("banners", banner._id || index.toString())}
                    className="absolute right-3 top-3 rounded-full bg-white/70 p-2 text-gray-500 shadow-sm transition hover:text-red-500"
                    aria-label="Delete banner"
                  >
                    <Trash size={16} />
                  </button>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                        Headline
                      </label>
                      <input
                        value={banner.title}
                        onChange={(e) => updateSectionItem("banners", index, "title", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                        placeholder="Glow with confidence"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                        Description
                      </label>
                      <textarea
                        value={banner.description}
                        onChange={(e) =>
                          updateSectionItem("banners", index, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                        placeholder="Short supporting copy for the slide"
                      />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                          Image URL
                        </label>
                        <div className="space-y-2">
                          <input
                            value={banner.image}
                            onChange={(e) => updateSectionItem("banners", index, "image", e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                            placeholder="/banners/image2.png"
                          />
                          <div className="flex flex-wrap items-center gap-3">
                            <label
                              htmlFor={`banner-upload-${bannerId}`}
                              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-pink-200 bg-white px-3 py-2 text-xs font-semibold text-pink-700 transition hover:bg-pink-50"
                            >
                              <Plus size={14} />
                              {queuedFile ? "Replace selected image" : "Select image"}
                            </label>
                            <input
                              id={`banner-upload-${bannerId}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  queueBannerUpload(file, bannerId, index);
                                  e.target.value = "";
                                }
                              }}
                            />
                            <p className="text-xs text-gray-500">
                              {queuedFile
                                ? `Queued: ${queuedFile.name} (uploads on save)`
                                : "Uploads to Cloudinary when you save · keep under 2MB"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                          CTA label
                        </label>
                        <input
                          value={banner.ctaLabel || ""}
                          onChange={(e) =>
                            updateSectionItem("banners", index, "ctaLabel", e.target.value || "")
                          }
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                          placeholder="Shop skincare"
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                          CTA link
                        </label>
                        <input
                          value={banner.ctaLink || ""}
                          onChange={(e) =>
                            updateSectionItem("banners", index, "ctaLink", e.target.value || "")
                          }
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                          placeholder="/products"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                          Active
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2 shadow-sm">
                          <input
                            type="checkbox"
                            checked={banner.isActive !== false}
                            onChange={(e) =>
                              updateSectionItem("banners", index, "isActive", e.target.checked)
                            }
                            className="h-4 w-4 accent-pink-500"
                          />
                          <span className="text-sm text-gray-700">
                            {banner.isActive === false ? "Hidden" : "Visible on homepage"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                  Highlights
                </p>
                <h2 className="text-xl font-bold text-gray-900">Homepage proof points</h2>
                <p className="text-sm text-gray-600">
                  Control the reassurance cards that sit below categories. Great for shipping promises
                  and guarantees.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => addItem("highlights")}
                  className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-100"
                >
                  <Plus size={16} />
                  Add highlight
                </button>
                <button
                  onClick={() => save("highlights")}
                  disabled={savingLabel("highlights")}
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-400"
                >
                  {savingLabel("highlights") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                  Save highlights
                </button>
              </div>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(content.highlights || []).map((item, index) => (
                <div
                  key={item._id || item.title || index}
                  className="relative rounded-2xl border border-pink-100 bg-pink-50/50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <button
                    onClick={() => removeItem("highlights", item._id || index.toString())}
                    className="absolute right-3 top-3 rounded-full bg-white/70 p-2 text-gray-500 shadow-sm transition hover:text-red-500"
                    aria-label="Delete highlight"
                  >
                    <Trash size={16} />
                  </button>
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                        Title
                      </label>
                      <input
                        value={item.title}
                        onChange={(e) => updateSectionItem("highlights", index, "title", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                        placeholder="Fast delivery perks"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                        Badge
                      </label>
                      <input
                        value={item.badge || ""}
                        onChange={(e) =>
                          updateSectionItem("highlights", index, "badge", e.target.value || "")
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                        placeholder="Free & fast"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          updateSectionItem("highlights", index, "description", e.target.value)
                        }
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                        placeholder="Explain the promise, perk, or guarantee."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">FAQs</p>
                <h2 className="text-xl font-bold text-gray-900">Customer FAQs</h2>
                <p className="text-sm text-gray-600">
                  Keep common questions fresh. These surface on the homepage FAQ section.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => addItem("faqs")}
                  className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-100"
                >
                  <Plus size={16} />
                  Add FAQ
                </button>
                <button
                  onClick={() => save("faqs")}
                  disabled={savingLabel("faqs")}
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-400"
                >
                  {savingLabel("faqs") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                  Save FAQs
                </button>
              </div>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              {(content.faqs || []).map((faq, index) => (
                <div
                  key={faq._id || faq.question || index}
                  className="relative rounded-2xl border border-pink-100 bg-pink-50/60 p-4 shadow-sm"
                >
                  <button
                    onClick={() => removeItem("faqs", faq._id || index.toString())}
                    className="absolute right-3 top-3 rounded-full bg-white/70 p-2 text-gray-500 shadow-sm transition hover:text-red-500"
                    aria-label="Delete FAQ"
                  >
                    <Trash size={16} />
                  </button>
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                        Category
                      </label>
                      <input
                        value={faq.category || ""}
                        onChange={(e) => updateSectionItem("faqs", index, "category", e.target.value || "")}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                        placeholder="Shipping"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                        Question
                      </label>
                      <input
                        value={faq.question}
                        onChange={(e) => updateSectionItem("faqs", index, "question", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                        placeholder="What is your return policy?"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateSectionItem("faqs", index, "answer", e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                        placeholder="Provide a concise, reassuring answer."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default withAdminAuth(ContentManagerPage);
