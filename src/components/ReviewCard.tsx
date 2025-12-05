// components/ReviewCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { StarRating } from "./StarRating";
import { TReview } from "@/types/review";

export const ReviewCard = ({ review }: { review: TReview }) => {
  const avatar =
    review.user?.profileImage ||
    review.product?.image ||
    "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";

  return (
    <Link href={`/reviews/${review._id}`} className="group">
      <div className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center text-center">
        <div className="w-28 h-28 mb-4 relative border-4 border-pink-200 rounded-full overflow-hidden">
          <Image
            src={avatar}
            alt={review.user?.name || review.product?.name || "Customer"}
            fill
            className="object-cover"
            sizes="112px"
            unoptimized
          />
        </div>

        <h3 className="text-xl font-semibold text-pink-600 mb-2 group-hover:text-pink-700 transition-colors">
          {review.title || "Customer review"}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {review.comment}
        </p>

        <div className="flex justify-center mb-2">
          <StarRating rating={review.rating} />
        </div>

        <p className="text-gray-500 italic text-sm">
          – {review.user?.name || "Verified buyer"}
        </p>

        <span className="mt-4 inline-block text-pink-600 font-medium text-sm hover:underline group-hover:text-pink-700 transition-colors">
          Read Full Review
        </span>
      </div>
    </Link>
  );
};
