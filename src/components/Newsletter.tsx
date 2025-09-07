"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const NewsletterSection = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Thanks for subscribing to our newsletter!");
    }, 1000);
  };

  return (
    <section className="mt-16">
      <div className="relative w-11/12 mx-auto py-20 px-6 md:px-10 rounded-xl overflow-hidden bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500">
        {/* Decorative shapes */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-300 rounded-full opacity-25 animate-pulse"></div>

        {/* Gradient Overlay for contrast */}
        <div className="absolute inset-0 bg-black/20 z-0 rounded-xl"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Join Our Beauty Club
          </h2>
          <p className="mb-8 text-lg md:text-xl">
            Subscribe to get the latest beauty tips, exclusive offers, and new arrivals delivered directly to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-auto px-6 py-3 rounded-full text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-600 transition"
              required
            />
            <button
              type="submit"
              className="bg-white text-pink-600 hover:bg-pink-50 transition font-semibold px-6 py-3 rounded-full disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
