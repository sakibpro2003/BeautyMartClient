/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
export const registerUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    // console.log(res,'res.json')
    return res.json();
  } catch (err: any) {
    toast.error(err.message);
  }
};
export const getAllProducts = async (queryString?: string) => {
  try {
    const url = queryString
      ? `${process.env.NEXT_PUBLIC_BASE_API}/api/products?${queryString}`
      : `${process.env.NEXT_PUBLIC_BASE_API}/api/products`;
    const res = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.json();
  } catch (err: any) {
    console.log(err.message);
  }
};
export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    const result = await res.json();

    const coockieSet = await cookies();
    coockieSet.set("accessToken", result?.data?.token);

    console.log(result, "result ");
    return result;
  } catch (err: any) {
    toast.error(err.message)
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  let decodedData = null;
  if (accessToken) {
    decodedData = jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};

export const logout = async () => {
  (await cookies()).delete("accessToken");
};
