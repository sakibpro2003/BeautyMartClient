
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserInfo } from "@/services/User";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import withCustomerAuth from "@/hoc/withCustomerAuth";
import Image from "next/image";

const Profile = () => {
  const [user, setUser] = useState<{
    profileImage?: string;
    coverImage?:string
    name: string;
    phone: string;
  }>({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      if (!token) {
        console.error("No token available");
        setLoading(false);
        return;
      }

      const userProfile = await getUserProfile();
      console.log(userProfile, "profiledetals");
      if (userProfile?.data) {
        setUser({
          coverImage: userProfile.data.coverImage,
          profileImage: userProfile.data.profileImage,
          name: userProfile.data.name || "",
          phone: userProfile.data.phone || "",
        });
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({ ...prevUser, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      const res = await updateUserInfo(user);
      if (res.success) {
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
    setUpdating(false);
  };


  if (loading) return <Loader />;

  return (
    <div className="flex items-center w-full justify-center flex-col lg:p-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        My Profile
      </h2>

      <div className="relative w-full mb-10">
        <Image
        unoptimized
        src={
          user?.coverImage ||
          "https://upload.wikimedia.org/wikipedia/commons/a/a6/No_picture_available_png.png"
        }
          alt="Scenery Wallpaper"
          width={1920}
          height={500} // approximate aspect ratio for banner
          className="w-full h-[40vh] object-cover"
        />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
          <Image
          unoptimized
            alt="Profile Image"
            src={
              user?.profileImage ||
              "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
            }
            width={150}
            height={300}
            className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white shadow-lg"
          />
          {/* <button
            onClick={() => setShowModal(true)}
            className="btn mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload
          </button> */}
        </div>
      </div>

      <div className="shadow-lg rounded-lg p-6 w-full">
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 font-medium">
            Profile Image URL
          </label>
          <input
            type="text"
            name="profileImage"
            value={user.profileImage}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 font-medium">
            Cover Image URL
          </label>
          <input
            type="text"
            name="coverImage"
            value={user?.coverImage}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={updating}
          className={`btn py-3 text-white font-semibold rounded-lg transition duration-200 ${
            updating ? "bg-gray-400 cursor-not-allowed" : "bg-black"
          }`}
        >
          {updating ? "Updating..." : "Save Changes"}
        </button>
      </div>

      {/* Upload Modal */}
      
    </div>
  );
};

export default withCustomerAuth(Profile);
