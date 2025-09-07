/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TProduct } from "@/types/product";
// import { TOrder } from "@/app/(dashboardLayout)/(admin)/[orderId]/page";
import { cookies } from "next/headers";
import { toast } from "react-toastify";

export const getAllProducts = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/products`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const createProduct = async (payload:TProduct) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};
export const updateProduct = async (payload:TProduct, id:any) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};
export const deleteSingleProduct = async (_id:string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/products/${_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};
export const getSingleProduct = async (productId:any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/products/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const logout = async () => {
  (await cookies()).delete("accessToken");
};
