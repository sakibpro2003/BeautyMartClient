// components/ReviewCard.tsx
"use client";
import Link from "next/link";
import { StarRating } from "./StarRating";
import { Review } from "../../data/reviews";
import Image from "next/image";

export const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <Link href={`/reviews/${review.id}`} className="group">
      <div className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center text-center">
        {/* Profile Image */}
        <div className="w-28 h-28 mb-4 relative border-4 border-pink-200 rounded-full overflow-hidden">
          <Image
            src={review.image}
            alt={review.name}
            fill
            className="object-cover"
            sizes="112px"
            unoptimized
          />
        </div>

        {/* Review Title */}
        <h3 className="text-xl font-semibold text-pink-600 mb-2 group-hover:text-pink-700 transition-colors">
          {review.title}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {review.summary}
        </p>

        {/* Rating */}
        <div className="flex justify-center mb-2">
          <StarRating rating={review.rating} />
        </div>

        {/* Reviewer Name */}
        <p className="text-gray-500 italic text-sm">– {review.name}</p>

        {/* Optional CTA */}
        <span className="mt-4 inline-block text-pink-600 font-medium text-sm hover:underline group-hover:text-pink-700 transition-colors">
          Read Full Review
        </span>
      </div>
    </Link>
  );
};
