/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { addToCart } from "@/services/Cart";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const AddToCartButton = ({ productId }: { productId: string }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const res = await addToCart({ quantity: 1, product: productId });
      if (res?.success) toast.success("Added to cart!");
      else toast.error("Failed to add.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full py-3 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-900 transition flex justify-center items-center"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          Adding to Cart...
        </>
      ) : (
        "Add To Cart"
      )}
    </button>
  );
};

export default AddToCartButton;
