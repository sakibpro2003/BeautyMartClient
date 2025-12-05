"use server";

import { cookies } from "next/headers";
import { toast } from "react-toastify";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/wishlist`;

export const fetchWishlist = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return { unauthorized: true };
  try {
    const res = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const addToWishlist = async (productId: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return { unauthorized: true };
  try {
    const res = await fetch(`${baseUrl}/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const removeFromWishlist = async (productId: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return { unauthorized: true };
  try {
    const res = await fetch(`${baseUrl}/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

