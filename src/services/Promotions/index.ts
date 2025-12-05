/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { toast } from "react-toastify";
import { Promotion } from "../../../data/promotions";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

export const fetchPromotions = async (): Promise<Promotion[]> => {
  try {
    const res = await fetch(`${baseUrl}/api/promotions`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json();
    return data?.data || [];
  } catch (error: any) {
    toast.error(error?.message || "Failed to load promotions");
    return [];
  }
};

export const createPromotion = async (payload: Promotion) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(`${baseUrl}/api/promotions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (error: any) {
    toast.error(error?.message || "Failed to create promotion");
  }
};

export const updatePromotion = async (id: string, payload: Partial<Promotion>) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(`${baseUrl}/api/promotions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (error: any) {
    toast.error(error?.message || "Failed to update promotion");
  }
};

export const validatePromotion = async (code: string) => {
  try {
    const res = await fetch(
      `${baseUrl}/api/promotions/validate?code=${encodeURIComponent(code)}`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );
    return res.json();
  } catch (error: any) {
    toast.error(error?.message || "Failed to validate promotion");
  }
};
