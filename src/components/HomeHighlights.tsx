import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import { defaultHighlights } from "@/data/content";
import { HighlightItem } from "@/types/content";

type Props = {
  highlights?: HighlightItem[];
};

const icons = [Sparkles, Truck, ShieldCheck];

const HomeHighlights = ({ highlights }: Props) => {
  const items = highlights && highlights.length ? highlights : defaultHighlights;

  return (
    <section className="mx-auto mt-10 w-11/12 rounded-3xl bg-gradient-to-r from-pink-50 via-white to-rose-50 px-6 py-12 shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-4 pb-6 text-center sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 text-left sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
            Why shop with us
          </p>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Highlights we keep polishing</h2>
          <p className="text-sm text-gray-600">
            Update these proof points anytime to match campaigns, guarantees, or seasonal perks.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div
              key={item._id || item.title || index}
              className="group relative overflow-hidden rounded-2xl border border-pink-100 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/60 via-white to-pink-100/40 opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                  <Icon size={22} />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    {item.badge && (
                      <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-600">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeHighlights;
