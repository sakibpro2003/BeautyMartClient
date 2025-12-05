"use server";

import { cookies } from "next/headers";
import { toast } from "react-toastify";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/reviews`;

export const fetchPublicReviews = async (limit = 6) => {
  try {
    const res = await fetch(`${baseUrl}?limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const fetchReviewById = async (id: string) => {
  try {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const fetchProductReviews = async (productId: string) => {
  try {
    const res = await fetch(`${baseUrl}/product/${productId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

type ReviewPayload = {
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment: string;
};

export const submitReview = async (payload: ReviewPayload) => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return { unauthorized: true };
  }
  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const fetchMyReviews = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return { unauthorized: true };
  }
  try {
    const res = await fetch(`${baseUrl}/me`, {
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

export const fetchAdminReviews = async (status?: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return { unauthorized: true };
  }
  try {
    const query = status && status !== "all" ? `?status=${status}` : "";
    const res = await fetch(`${baseUrl}/admin${query}`, {
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

export const updateReviewModeration = async (
  id: string,
  payload: { status: string; adminReply?: string }
) => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return { unauthorized: true };
  }
  try {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const fetchReviewSummary = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return { unauthorized: true };
  }
  try {
    const res = await fetch(`${baseUrl}/admin/summary`, {
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

export const fetchReplyTemplates = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return { unauthorized: true };
  }
  try {
    const res = await fetch(`${baseUrl}/templates`, {
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

