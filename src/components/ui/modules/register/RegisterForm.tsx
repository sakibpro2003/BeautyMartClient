"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "./registerValidation";
import { registerUser } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      profileImage: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (userData) => {
    setLoading(true);
    try {
      const res = await registerUser(userData);
      if (res?.success === true) {
        toast.success("Registration successful!");
        router.push("/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const password = form.watch("password");
  const confirm_password = form.watch("confirm_password");

  if (!isClient) return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 px-4 py-10 relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-6 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl bg-white/85 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70 backdrop-blur lg:flex-row lg:p-10">
        <div className="flex flex-1 flex-col justify-between gap-6 rounded-2xl bg-gradient-to-br from-pink-600 via-pink-500 to-orange-500 p-6 text-white shadow-lg">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">Join BeautyMart</p>
            <h1 className="text-3xl font-bold leading-tight">Create your glow-up profile</h1>
            <p className="text-sm text-white/85">
              Unlock member-only offers, save your favorites, and get tailored skincare and beauty
              picks curated for you.
            </p>
          </div>
          <div className="grid gap-3 rounded-2xl bg-white/15 p-4 ring-1 ring-white/30">
            <p className="text-sm font-semibold text-white">Why sign up?</p>
            <ul className="grid gap-2 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Fast checkout with saved details
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Early access to drops & deals
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Personalized routines and tips
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 rounded-2xl bg-white p-6 shadow-inner ring-1 ring-gray-100">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-pink-500">Register</p>
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-600">Fill in your details to start shopping with us.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="email"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        value={field.value ?? ""}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        value={field.value ?? ""}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                      />
                    </FormControl>
                    {password &&
                    confirm_password &&
                    password !== confirm_password ? (
                      <FormMessage>Passwords do not match!</FormMessage>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
                disabled={
                  loading ||
                  !password ||
                  !confirm_password ||
                  password !== confirm_password
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Registering...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-pink-600 hover:text-pink-700"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
