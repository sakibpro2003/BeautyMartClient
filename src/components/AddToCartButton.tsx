/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { addToCart } from "@/services/Cart";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const AddToCartButton = ({
  productId,
  inStock = true,
}: {
  productId: string;
  inStock?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!inStock) {
      toast.error("Product is out of stock.");
      return;
    }

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
      disabled={loading || !inStock}
      className={`w-full py-3 text-white text-lg font-semibold rounded-xl transition flex justify-center items-center ${
        loading || !inStock ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"
      }`}
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
