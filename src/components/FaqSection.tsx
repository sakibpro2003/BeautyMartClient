"use client";

import { useEffect, useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { defaultFaqs } from "@/data/content";
import { FaqItem } from "@/types/content";

type Props = {
  faqs?: FaqItem[];
};

const FaqSection = ({ faqs }: Props) => {
  const items = faqs && faqs.length ? faqs : defaultFaqs;
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const first = items[0];
    setOpenId(first?._id || first?.question || null);
  }, [items]);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mx-auto my-12 w-11/12 rounded-3xl bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/60 md:p-10">
      <div className="flex flex-col gap-3 border-b border-pink-50 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
            FAQs
          </p>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Need quick answers?</h2>
          <p className="text-sm text-gray-600">
            Edit and publish customer-friendly answers anytime from the Content Manager.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
          <MessageCircle size={16} />
          Beauty support desk
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item, index) => {
          const id = item._id || item.question || `faq-${index}`;
          const isOpen = openId === id;
          return (
            <div
              key={id}
              className="overflow-hidden rounded-2xl border border-pink-100 bg-pink-50/40 transition hover:border-pink-200"
            >
              <button
                type="button"
                onClick={() => toggle(id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-pink-500">
                    {item.category || "General"}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-pink-600 transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-pink-100 bg-white px-4 py-4 text-sm leading-relaxed text-gray-700">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
