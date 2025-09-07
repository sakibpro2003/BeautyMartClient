/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import withCustomerAuth from "@/hoc/withCustomerAuth";
import {
  decreaseItemQuantity,
  getCartProducts,
  increaseItemQuantity,
  removeItem,
  uploadProductImage,
} from "@/services/Cart";
import { createOrder } from "@/services/Orders";
import { TOrder } from "@/types/order";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bkash");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmingOrder, setConfirmingOrder] = useState(false);

  const fetchCartProducts = async () => {
    try {
      setIsLoading(true);
      const cartProducts = await getCartProducts();
      setProducts(cartProducts?.data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const handleIncrease = async (_id: string) => {
    setIsLoading(true);
    const res = await increaseItemQuantity(_id);
    if (res.success) {
      await fetchCartProducts();
    }
    setIsLoading(false);
  };

  const handleDecrease = async (_id: string) => {
    setIsLoading(true);
    const res = await decreaseItemQuantity(_id);
    if (res.success) {
      await fetchCartProducts();
    }
    setIsLoading(false);
  };

  const handleRemoveItem = async (id: string) => {
    setIsLoading(true);
    await removeItem(id);
    await fetchCartProducts();
    setIsLoading(false);
  };

  // const handleOpenUploadModal = (itemId: string) => {
  //   setSelectedItemId(itemId);
  //   setIsUploadModalOpen(true);
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPrescription = async () => {
    if (!selectedFile || !selectedItemId) return;
    setUploading(true);
    const res = await uploadProductImage(selectedItemId, selectedFile);
    console.log(res, "upload image");
    if (res.message === "Product image updated successfully") {
      toast.success("Prescription uploaded successfully");
    }
    setUploading(false);
    setIsUploadModalOpen(false);
    setSelectedFile(null);
  };

  const handleConfirmOrder = async () => {
    try {
      setConfirmingOrder(true);
      if (products.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      const newOrder: TOrder = {
        _id: "",
        user: { _id: "", name: "" },
        products: products.map((item) => ({
          product: {
            _id: item.product._id,
            name: item.product.name,
            image: item.product.image,
          },
          quantity: item.quantity,
          totalPrice: item.product.price * item.quantity,
          _id: item._id,
        })),
        address,
        paymentMethod,
        totalAmount: products.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
        status: "processing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await createOrder(newOrder);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Order placed successfully!");
      setIsCheckoutModalOpen(false);
      fetchCartProducts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setConfirmingOrder(false);
    }
  };

  return (
    <div className="container mx-auto p-6 h-screen">
      <div className="flex justify-between">
        <h1 className="lg:text-2xl font-bold mb-4">Cart Products</h1>
        <Button
          onClick={() => setIsCheckoutModalOpen(true)}
          className=" bg-pink-600 hover:bg-pink-700 text-white"
        >
          Proceed to Checkout
        </Button>
      </div>

      {isLoading && <Loader></Loader>}

      <div className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead>
            <tr className="bg-pink-600 text-white">
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">In Stock</th>
              <th className="border px-4 py-2">Prescription Required</th>
              <th className="border px-4 py-2">Remove Item</th>
              {/* <th className="border px-4 py-2">Upload Prescription</th> */}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item._id} className="text-center">
                  <td className="border px-4 py-2">
                    <Image
                      width={50}
                      height={50}
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                      unoptimized
                    />
                  </td>
                  <td className="border px-4 py-2">{item.product.name}</td>
                  <td className="border px-4 py-2">${item.product.price}</td>
                  <td className="border px-4  py-2">
                    <Button
                      onClick={() => handleDecrease(item?.product?._id)}
                      className="bg-pink-600 text-white"
                    >
                      -
                    </Button>
                    <span className="m-3">{item.quantity}</span>
                    <Button
                      onClick={() => handleIncrease(item?.product?._id)}
                      className="bg-pink-600 text-white"
                    >
                      +
                    </Button>
                  </td>
                  <td className="border px-4 py-2">
                    ${item.product.price * item.quantity}
                  </td>
                  <td className="border px-4 py-2">
                    {item.product.inStock ? "Yes" : "No"}
                  </td>
                  <td className="border px-4 py-2">
                    {item.product.requiredPrescription ? "Yes" : "No"}
                  </td>
                  <td className="border px-4 py-2">
                    <Button
                      onClick={() => handleRemoveItem(item._id)}
                      className="bg-pink-600 text-white hover:bg-pink-700"
                    >
                      Remove
                    </Button>
                  </td>
                  {/* <td>
                    <button
                      onClick={() => handleOpenUploadModal(item._id)}
                      className="btn-custom"
                    >
                      Upload
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No products in the cart
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Checkout</h2>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label className="block text-sm font-medium mb-1">
              Payment Method
            </label>
            <select
              className="select select-bordered w-full mb-4"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Bkash">Bkash</option>
              <option value="Nagad">Nagad</option>
              <option value="COD">Cash on Delivery</option>
              <option value="Card">Credit/Debit Card</option>
            </select>
            <div className="flex justify-between mt-4">
              <button
                className="btn btn-error"
                onClick={() => setIsCheckoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleConfirmOrder}
                disabled={confirmingOrder}
              >
                {confirmingOrder ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Prescription Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Upload Prescription</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Prescription Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="file-input file-input-bordered w-full"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="btn btn-error"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleUploadPrescription}
                disabled={!selectedFile || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withCustomerAuth(CartPage);
