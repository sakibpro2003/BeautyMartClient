import { Promotion, seedPromotions } from "../../data/promotions";

export const PROMO_STORAGE_KEY = "beautymart-promotions";

const isBrowser = () => typeof window !== "undefined";

export const loadStoredPromotions = (): Promotion[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(PROMO_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Promotion[]) : [];
  } catch (err) {
    console.error("Failed to load promotions", err);
    return [];
  }
};

export const savePromotion = (promotion: Promotion): Promotion[] => {
  if (!isBrowser()) return [];
  const existing = loadStoredPromotions().filter((p) => p.id !== promotion.id);
  const merged = [...existing, promotion];
  window.localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(merged));
  return merged;
};

export const removePromotion = (id: string): Promotion[] => {
  if (!isBrowser()) return [];
  const filtered = loadStoredPromotions().filter((p) => p.id !== id);
  window.localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

export const mergePromotions = (): Promotion[] => {
  const merged = [...seedPromotions, ...loadStoredPromotions()];
  const unique = Array.from(new Map(merged.map((p) => [p.code.toLowerCase(), p])).values());
  return unique.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
};
