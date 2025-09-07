"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/AuthService";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import capsuleImg from "../capsule.png";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const pathname = usePathname();

  const userRole = user?.role;

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  const getLinkClass = (link: string) => {
    return clsx(
      "px-4 py-2 rounded-full transition-colors duration-300 font-medium",
      {
        "bg-pink-500 text-white shadow-md": pathname === link,
        "text-gray-800 hover:text-pink-500": pathname !== link,
      }
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="w-11/12 mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="font-bold text-2xl md:text-3xl text-pink-600"
          >
            BeautyMart
          </Link>
          <Image
            className="w-16 h-12 md:w-12"
            unoptimized
            src="/logo/logo.png"
            alt="logo"
            width={100}
            height={100}
          />
        </div>

        {/* Menu */}
        <ul className="hidden lg:flex items-center gap-6">
          <li>
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className={getLinkClass("/products")}>
              Products
            </Link>
          </li>
          <li>
            <Link href="/about" className={getLinkClass("/about")}>
              About
            </Link>
          </li>
          <li>
            <Link href="/blog" className={getLinkClass("/blog")}>
              Blog
            </Link>
          </li>
          <li>
            <Link href="/cart" className={getLinkClass("/cart")}>
              Cart
            </Link>
          </li>
          {userRole === "customer" && (
            <li>
              <Link href="/my-orders" className={getLinkClass("/my-orders")}>
                Dashboard
              </Link>
            </li>
          )}
          {userRole === "admin" && (
            <li>
              <Link
                href="/manage-medicines"
                className={getLinkClass("/manage-medicines")}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-600 transition-colors"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button className="text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
