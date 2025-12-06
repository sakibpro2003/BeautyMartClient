"use client";

import React, { useEffect, useMemo, useState } from "react";
import withCustomerAuth from "@/hoc/withCustomerAuth";
import { fetchMyShadeQuiz, submitShadeQuiz } from "@/services/ShadeQuiz";
import { TShadeQuiz } from "@/types/shadeQuiz";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { Sparkles, Palette, ShieldCheck, ArrowRight } from "lucide-react";

const undertones = ["Cool", "Warm", "Neutral", "Olive"];
const skinTypes = ["Oily", "Dry", "Combination", "Normal", "Sensitive"];
const finishes = ["Matte", "Natural", "Dewy"];
const coverages = ["Sheer", "Light", "Medium", "Full"];
const concernOptions = ["Acne/texture", "Redness", "Hyperpigmentation", "Dryness", "Oil control", "Aging"];

const ShadeMatchPage = () => {
  const [form, setForm] = useState<Partial<TShadeQuiz>>({
    skinTone: "",
    undertone: "",
    skinType: "",
    concerns: [],
    preferredFinish: "",
    preferredCoverage: "",
    currentShade: "",
    lighting: "",
    photoConsent: false,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<TShadeQuiz[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchMyShadeQuiz();
      if (res?.success) {
        setHistory(res.data || []);
        if (res.data?.[0]) {
          const latest = res.data[0];
          setForm((prev) => ({
            ...prev,
            skinTone: latest.skinTone || "",
            undertone: latest.undertone || "",
            skinType: latest.skinType || "",
            concerns: latest.concerns || [],
            preferredFinish: latest.preferredFinish || "",
            preferredCoverage: latest.preferredCoverage || "",
            currentShade: latest.currentShade || "",
            lighting: latest.lighting || "",
            notes: latest.notes || "",
          }));
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const confidence = useMemo(() => {
    const base = 60;
    const bonus =
      (form.undertone ? 10 : 0) +
      (form.skinType ? 5 : 0) +
      (form.concerns?.length ? 5 : 0) +
      (form.preferredFinish ? 5 : 0);
    return Math.min(95, base + bonus);
  }, [form]);

  const toggleConcern = (c: string) => {
    setForm((prev) => {
      const set = new Set(prev.concerns || []);
      if (set.has(c)) {
        set.delete(c);
      } else {
        set.add(c);
      }
      return { ...prev, concerns: Array.from(set) };
    });
  };

  const handleSubmit = async () => {
    if (!form.skinTone || !form.undertone || !form.skinType) {
      toast.error("Please fill skin tone, undertone, and skin type.");
      return;
    }
    setSubmitting(true);
    const res = await submitShadeQuiz({
      ...form,
      confidence,
      recommendations: [],
    });
    if (res?.unauthorized) {
      toast.error("Please login to save your match.");
    } else if (res?.success) {
      toast.success("Saved your shade profile.");
      setHistory((prev) => [res.data, ...prev]);
    } else {
      toast.error(res?.message || "Failed to save.");
    }
    setSubmitting(false);
  };

  if (loading) return <Loader />;

  const latest = history[0];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Shade match</p>
            <h1 className="text-2xl font-bold text-gray-900">Find your perfect shade</h1>
            <p className="text-sm text-gray-600">
              Answer a few quick questions for tailored shade and finish suggestions.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow">
            <Sparkles size={16} />
            Smart match · {confidence}% confidence
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Quiz
              </p>
              <h2 className="text-xl font-bold text-gray-900">Your skin + preferences</h2>
            </div>
            <Palette className="text-pink-500" size={18} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Skin tone</label>
              <input
                value={form.skinTone || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, skinTone: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                placeholder="e.g., Medium tan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Undertone</label>
              <select
                value={form.undertone || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, undertone: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
              >
                <option value="">Select</option>
                {undertones.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Skin type</label>
              <select
                value={form.skinType || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, skinType: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
              >
                <option value="">Select</option>
                {skinTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Current shade reference</label>
              <input
                value={form.currentShade || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, currentShade: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                placeholder="Brand + shade (optional)"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Preferred finish</label>
              <select
                value={form.preferredFinish || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, preferredFinish: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
              >
                <option value="">Select</option>
                {finishes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Preferred coverage</label>
              <select
                value={form.preferredCoverage || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, preferredCoverage: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
              >
                <option value="">Select</option>
                {coverages.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-gray-500">Skin concerns</label>
            <div className="flex flex-wrap gap-2">
              {concernOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleConcern(c)}
                  type="button"
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    form.concerns?.includes(c)
                      ? "border-pink-300 bg-pink-50 text-pink-700"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Typical lighting</label>
              <input
                value={form.lighting || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, lighting: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                placeholder="Indoor office, sunlight, etc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Notes (optional)</label>
              <textarea
                value={form.notes || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                placeholder="Share preferences or sensitivities"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={!!form.photoConsent}
                onChange={(e) => setForm((prev) => ({ ...prev, photoConsent: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-400"
              />
              I consent to optional photo matching (if provided later)
            </label>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <ArrowRight size={16} />
              {submitting ? "Saving..." : "Save my match"}
            </button>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Recap
              </p>
              <h2 className="text-xl font-bold text-gray-900">Latest profile</h2>
              <p className="text-sm text-gray-600">We’ll use this to tailor shade suggestions.</p>
            </div>
            <ShieldCheck className="text-emerald-500" size={18} />
          </div>

          {!latest ? (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-6 text-sm text-gray-600">
              Fill the quiz to see your profile summary here.
            </div>
          ) : (
            <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {latest.skinTone} · {latest.undertone}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  {latest.skinType}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Finish: {latest.preferredFinish || "—"} · Coverage: {latest.preferredCoverage || "—"}
              </p>
              <p className="text-xs text-gray-600">
                Concerns: {latest.concerns?.length ? latest.concerns.join(", ") : "—"}
              </p>
              <p className="text-xs text-gray-600">
                Reference: {latest.currentShade || "—"} · Lighting: {latest.lighting || "—"}
              </p>
              {latest.notes ? (
                <p className="text-xs text-gray-600">Notes: {latest.notes}</p>
              ) : null}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-[12px] font-semibold uppercase text-gray-500">Confidence</span>
                <div className="h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-pink-500"
                    style={{ width: `${latest.confidence || confidence}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {(latest.confidence || confidence || 0).toFixed(0)}%
                </span>
              </div>
            </div>
          )}

          {history.length > 1 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-gray-500">History</p>
              <div className="space-y-2">
                {history.slice(0, 3).map((h, idx) => (
                  <div
                    key={h._id || idx}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-700"
                  >
                    <span>
                      {h.skinTone} • {h.undertone} • {h.skinType}
                    </span>
                    <span className="text-gray-500">
                      {h.createdAt ? new Date(h.createdAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default withCustomerAuth(ShadeMatchPage);
