/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
export type TCart = {
  _id?: string;
  name?: string;
  product?:string,
  image?: string;
  description?: string;
  price?: number;
  inStock?: boolean;
  quantity?: number;
  requiredPrescription?: boolean;
  expiryDate?: string;

  manufacturer?: {
    name?: string;
    address?: string;
    contact?: string;
  };

  updated_at?: string; 
};

export const addToCart = async (payload:TCart) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (err: any) {
   console.log(err)
  }
};

export const uploadProductImage = async (_id: string, file: File) => {
  const token = (await cookies()).get("accessToken")?.value;
  
  const formData = new FormData();
  formData.append("image", file); 
  console.log(formData)
  
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/products/upload/${_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, 
      }
    );

    return res.json();
  } catch (err) {
    console.error("Upload error:", err);
  }
};

export const increaseItemQuantity = async (_id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    console.error("No access token found");
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/cart/increase/${_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Error:", data);
    }

    return data;
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

export const decreaseItemQuantity = async (_id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    console.error("No access token found");
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/cart/decrease/${_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Error:", data);
    }

    return data;
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

export const getCartProducts = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  } catch (err: any) {
    console.error("Fetch error:", err);

  }
};
export const removeItem = async (_id: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/cart/remove-item/${_id}`,
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
    console.error("Fetch error:", err);

  }
};

export const logout = async () => {
  (await cookies()).delete("accessToken");
};
