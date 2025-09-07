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
    return <Loader></Loader>;
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl m-10 mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 border border-gray-300">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="flex justify-center items-center">
          <Image
            width={300}
            height={300}
            src={product?.image || "/placeholder.jpg"}
            alt={product?.name || "Product Image"}
            unoptimized
          />
        </div>

        {/* Product Details */}
        <div className="text-black">
          <h1 className="text-3xl font-bold">{product?.name || "No Name"}</h1>
          <p className="text-gray-700 mt-2">
            {product?.description || "No Description"}
          </p>

          <p className="text-xl text-black font-semibold mt-4 border-b pb-2 border-gray-300">
            Price: ${product?.price || "N/A"}
          </p>

          <p className="mt-2 text-gray-700">
            Quantity: {product?.quantity || "N/A"}
          </p>

          <div className="mt-6 flex items-center space-x-4">
            <span
              className={`px-4 py-2 rounded-lg text-white text-sm ${
                product?.inStock ? "bg-black" : "bg-gray-700"
              }`}
            >
              {product?.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-6 text-gray-700">
            <p>
              <strong>Manufacturer:</strong>{" "}
              {product?.manufacturer?.name || "Unknown"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {product?.manufacturer?.address || "N/A"}
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              {product?.manufacturer?.contact || "N/A"}
            </p>
          </div>

          <p className="mt-2 text-gray-700">
            Expiry Date:{" "}
            {product?.expiryDate
              ? new Date(product.expiryDate).toLocaleDateString()
              : "N/A"}
          </p>

          {product?.requiredPrescription && (
            <div className="mt-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg">
              Prescription Required
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => handleAddToCart(productId)}
        className="mt-6 w-full py-3 bg-black text-white text-lg font-semibold rounded-lg hover:bg-gray-900 transition flex justify-center items-center"
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

// /products/[productId]/page.tsx

// import { getSingleProduct } from "@/services/Products";
// import Image from "next/image";
// import { Loader2, Star } from "lucide-react";
// import AddToCartButton from "../../../../components/AddToCartButton"; // Create this separately
// import { notFound } from "next/navigation";

// const ProductDetailsPage = async ({
//   params,
// }: {
//   params: { productId: string };
// }) => {
//   const response = await getSingleProduct(params.productId);
//   const product = response?.data;

//   if (!product) return notFound();

//   return (
//     <div className="w-11/12 max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 border border-gray-200">
//       <div className="grid lg:grid-cols-2 gap-8">
//         <div className="flex justify-center items-center">
//           <Image
//             width={350}
//             height={350}
//             src={product?.image || "/placeholder.jpg"}
//             alt={product?.name || "Product Image"}
//             className="rounded-xl border border-gray-300 shadow"
//           />
//         </div>

//         <div className="text-black space-y-4">
//           <h1 className="text-3xl font-bold">{product.name}</h1>
//           <p className="text-gray-600">{product.description}</p>
//           <div className="text-xl font-semibold border-b pb-2 border-gray-300">
//             Price: ${product.price}
//             {product.discount > 0 && (
//               <span className="ml-4 text-green-600 text-sm font-medium">
//                 {product.discount}% Off
//               </span>
//             )}
//           </div>
//           <div className="flex flex-wrap gap-3 text-sm text-gray-700">
//             <p><strong>Dosage:</strong> {product.dosage}</p>
//             <p><strong>Pack Size:</strong> {product.packSize}</p>
//             <p><strong>Form:</strong> {product.form}</p>
//             <p><strong>Category:</strong> {product.category}</p>
//             <p><strong>Rating:</strong> 
//               <span className="flex items-center gap-1 text-yellow-500">
//                 <Star className="h-4 w-4 fill-yellow-500" /> {product.rating}
//               </span>
//             </p>
//             <p><strong>Expiry:</strong> {new Date(product.expiryDate).toLocaleDateString()}</p>
//             <p><strong>Quantity:</strong> {product.quantity}</p>
//             <p>
//               <strong>Status:</strong>{" "}
//               <span className={`px-2 py-1 rounded-lg text-white text-xs ${
//                 product.inStock ? "bg-black" : "bg-gray-500"
//               }`}>
//                 {product.inStock ? "In Stock" : "Out of Stock"}
//               </span>
//             </p>
//             {product.requiredPrescription && (
//               <p className="bg-gray-800 text-white px-2 py-1 rounded-lg text-xs">
//                 Prescription Required
//               </p>
//             )}
//           </div>

//           <div className="pt-4 border-t border-gray-200 text-sm">
//             <p><strong>Manufacturer:</strong> {product.manufacturer?.name}</p>
//             {product.manufacturer?.address && <p><strong>Address:</strong> {product.manufacturer.address}</p>}
//             {product.manufacturer?.contact && <p><strong>Contact:</strong> {product.manufacturer.contact}</p>}
//           </div>
//         </div>
//       </div>

//       {/* CLIENT COMPONENT BUTTON */}
//       <div className="mt-10">
//         <AddToCartButton productId={product._id} />
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPage;
