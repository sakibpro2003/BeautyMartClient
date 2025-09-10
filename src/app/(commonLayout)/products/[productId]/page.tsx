/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { addToCart } from "@/services/Cart";
import { getSingleProduct } from "@/services/Products";
import Image from "next/image";
import React, { useEffect, useState, use } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2 } from "lucide-react";
import Loader from "@/components/Loader";

const ProductDetails = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getSingleProduct(productId);
        setProduct(response?.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  type TAddCart = {
    quantity: number;
    product: string;
  };

  const handleAddToCart = async (id: string) => {
    setIsAddingToCart(true);
    const payload: TAddCart = { quantity: 1, product: id };

    try {
      const res = await addToCart(payload);
      if (res?.success) {
        toast.success("Added to cart successfully!");
      } else {
        toast.error("Failed to add to cart.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-pink-600 text-xl font-semibold">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl m-10 mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6 border border-pink-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex justify-center items-center bg-pink-50 rounded-xl p-6">
          <Image
            width={350}
            height={350}
            src={product?.image || "/placeholder.jpg"}
            alt={product?.name || "Product Image"}
            className="rounded-xl shadow-md"
            unoptimized
          />
        </div>

        {/* Product Details */}
        <div className="text-gray-800">
          <h1 className="text-3xl font-bold text-pink-600">
            {product?.name || "No Name"}
          </h1>
          <p className="text-gray-600 mt-3">{product?.description || "No Description"}</p>

          <p className="text-2xl text-pink-600 font-semibold mt-5 border-b pb-2 border-pink-200">
            Price: ${product?.price || "N/A"}
          </p>

          <p className="mt-3 text-gray-700 font-medium">
            Quantity: <span className="text-pink-600">{product?.quantity || "N/A"}</span>
          </p>

          <div className="mt-5 flex items-center space-x-4">
            <span
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium shadow ${
                product?.inStock ? "bg-pink-600" : "bg-gray-400"
              }`}
            >
              {product?.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-6 text-gray-700 space-y-2">
            <p>
              <strong className="text-pink-600">Manufacturer:</strong>{" "}
              {product?.manufacturer?.name || "Unknown"}
            </p>
            <p>
              <strong className="text-pink-600">Address:</strong>{" "}
              {product?.manufacturer?.address || "N/A"}
            </p>
            <p>
              <strong className="text-pink-600">Contact:</strong>{" "}
              {product?.manufacturer?.contact || "N/A"}
            </p>
          </div>

          <p className="mt-3 text-gray-700">
            <strong className="text-pink-600">Expiry Date:</strong>{" "}
            {product?.expiryDate
              ? new Date(product.expiryDate).toLocaleDateString()
              : "N/A"}
          </p>

          {product?.requiredPrescription && (
            <div className="mt-5 px-4 py-2 bg-pink-100 text-pink-700 text-sm rounded-lg border border-pink-200">
              Prescription Required
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => handleAddToCart(productId)}
        className="mt-8 w-full py-3 bg-pink-600 text-white text-lg font-semibold rounded-xl hover:bg-pink-700 transition flex justify-center items-center shadow-md"
        disabled={isAddingToCart}
      >
        {isAddingToCart ? (
          <>
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Adding to Cart...
          </>
        ) : (
          "Add To Cart"
        )}
      </button>
    </div>
  );
};

export default ProductDetails;
