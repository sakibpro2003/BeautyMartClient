/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TOrder } from "@/types/order";
import { cookies } from "next/headers";
import { toast } from "react-toastify";

export const getOrders = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/order`, {
      method: "GET",
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
export const getUserSpecificOrder = async (email: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/order/user-order/${email}`,
      {
        method: "GET",
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
export const getOrdersByAdmin = async (email: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/order/${email}`,
      {
        method: "GET",
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
export const createOrder = async (paymentDetails:TOrder) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentDetails),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    toast.error(err.message);
  }
};

export const getAllOrders = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/order/get-all-orders`,
      {
        method: "GET",
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
export const getSuccessfulPayments = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/order/payments/successful-transactions`,
      {
        method: "GET",
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
export const changeOrderStatus = async (status:boolean, _id:string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/order/${_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
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
