// components/StarRating.tsx
"use client";
import { Star } from "lucide-react";

export const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? "fill-yellow-500" : "stroke-gray-300"}`}
        />
      ))}
    </div>
  );
};
