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
    <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white border border-pink-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-pink-100 text-center bg-pink-50">
          <h3 className="text-3xl font-bold text-pink-600">Create Account</h3>
          <p className="text-sm text-gray-600 mt-1">
            Join BeautyMart for exclusive deals & beauty tips ✨
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-pink-600">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        className="focus:ring-pink-500 focus:border-pink-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-pink-600">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="email"
                        className="focus:ring-pink-500 focus:border-pink-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-pink-600">Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        className="focus:ring-pink-500 focus:border-pink-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-pink-600">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        value={field.value ?? ""}
                        className="focus:ring-pink-500 focus:border-pink-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-pink-600">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        value={field.value ?? ""}
                        className="focus:ring-pink-500 focus:border-pink-500"
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg flex justify-center items-center transition-colors"
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

              {/* Link to Login */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-pink-500 font-medium hover:underline"
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
