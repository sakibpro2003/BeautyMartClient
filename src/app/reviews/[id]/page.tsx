/* eslint-disable @typescript-eslint/no-explicit-any */
// app/reviews/[id]/page.tsx
import { reviews } from "../../../../data/reviews";
import { notFound } from "next/navigation";
import { StarRating } from "@/components/StarRating";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ReviewDetails({ params }: any) {
  const review = reviews.find((r) => r.id === params.id);
  if (!review) return notFound();

  return (
    <>
      <Navbar />
      <main className="w-11/12 max-w-4xl mx-auto mt-16 mb-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-pink-100">
          {/* Reviewer Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 relative rounded-full overflow-hidden border-4 border-pink-200">
                <Image
                  src={review.image}
                  alt={review.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-pink-600">{review.title}</h1>
                <p className="text-gray-600 text-sm">
                  by <span className="font-medium">{review.name}</span> from {review.location}
                </p>
                <p className="text-xs text-gray-400 mt-1">Reviewed on {review.date}</p>
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <StarRating rating={review.rating} />
            </div>
          </div>

          {/* Medicine Info */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">Medicine/Service Reviewed:</p>
            <p className="text-base text-gray-800">{review.medicineUsed}</p>
          </div>

          {/* Full Review */}
          <div className="mt-6">
            <p className="text-gray-800 text-lg leading-relaxed">{review.fullReview}</p>
          </div>

          {/* Optional CTA */}
          <div className="mt-8 text-center">
            <p className="text-pink-600 font-medium text-sm">
              Loved this review? Explore more from our customers!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
