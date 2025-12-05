"use client";

import { getSingleProduct, updateProduct } from "@/services/Products";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import withAdminAuth from "@/hoc/withAdminAuth";
import { TProduct } from "@/types/product";
import Loader from "@/components/Loader";
import { uploadImage } from "@/utils/uploadImage";
import { Image as ImageIcon, Upload } from "lucide-react";

const UpdateProductPage = () => {
  const router = useRouter();
  const { updateId } = useParams();
  const [product, setProduct] = useState<TProduct>({
    _id: "",
    name:"",
    image:"",
    product: {
      name: "",
      image: "",
    },
    totalPrice: 0,
    description: "",
    price: 0,
    inStock: false,
    quantity: 0,
    expiryDate: "",
    manufacturer: {
      name: "",
      address: "",
      contact: "",
    },
    updated_at: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  

  useEffect(() => {
    const fetchProduct = async () => {
      if (!updateId) return;

      try {
        setLoading(true);
        const productData = await getSingleProduct(updateId);
        if (productData?.data) {
          setProduct(productData.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [updateId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
  
    setProduct((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  

  const handleManufacturerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      manufacturer: {
        ...prev.manufacturer,
        [name]: value,
      },
    }));
  };

  const handleUpdate = async () => {
    setSaving(true);
    let imageUrl = product.image;

    try {
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile, "beautymart/products");
      }

      const res = await updateProduct({ ...product, image: imageUrl }, updateId);
      if (res) {
        toast.success("Product updated successfully");
        router.push("/manage-medicines");
      } else {
        toast.error("Update failed");
      }
    } catch (error: any) {
      toast.error(error?.message || "Update failed");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 py-10">
      <div className="mx-auto w-11/12 max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
              <h1 className="text-3xl font-bold text-gray-900">Update product</h1>
              <p className="text-sm text-gray-600">Revise product details, inventory, and manufacturer.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-700">
              <span className="rounded-full bg-gray-900 px-4 py-2 text-white shadow">ID: {product._id || "—"}</span>
              <span
                className={`rounded-full px-3 py-1 ring-1 ${
                  product.inStock ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-rose-50 text-rose-700 ring-rose-100"
                }`}
              >
                {product.inStock ? "In stock" : "Out of stock"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-800">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product?.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Product image</label>
                <div className="flex flex-col gap-3 min-w-0">
                  <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                          <ImageIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Update product image</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 2MB</p>
                        </div>
                      </div>
                      <label
                        htmlFor="product-image-upload"
                        className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-pink-700 cursor-pointer"
                      >
                        <Upload size={14} />
                        Choose file
                      </label>
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) {
                            setImageFile(null);
                            setPreviewUrl("");
                            setSelectedFileName("");
                            return;
                          }
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setImageFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                          setSelectedFileName(file.name);
                        }}
                      />
                    </div>
                    {(previewUrl || product.image) && (
                      <div className="overflow-hidden rounded-xl border border-pink-100 bg-white">
                        <img
                          src={previewUrl || product.image}
                          alt="Product preview"
                          className="h-44 w-full object-cover"
                        />
                      </div>
                    )}
                    {selectedFileName && (
                      <p className="text-xs font-semibold text-pink-700 break-all">
                        Selected: {selectedFileName}
                      </p>
                    )}
                  </div>
                  <input
                    type="text"
                    name="image"
                    value={product?.image}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  />
                  <p className="text-xs text-gray-500 break-words">
                    Upload runs on save. You can also paste an existing image URL.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={product?.expiryDate?.split("T")[0] || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-800">Description</label>
                <textarea
                  name="description"
                  value={product?.description}
                  onChange={handleChange}
                  className="min-h-[120px] w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product?.price}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={product?.quantity}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-3">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={product?.inStock}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-400"
                />
                <label className="text-sm font-semibold text-gray-800">Available in inventory</label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Preview</h3>
              <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-pink-50 via-white to-amber-50 p-4 ring-1 ring-pink-100/70">
                <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100">
                  {product?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="text-center space-y-1">
                  <p className="text-base font-semibold text-gray-900">{product.name || "Product name"}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description || "Description preview will appear here."}
                  </p>
                  <p className="text-sm font-bold text-pink-600">${product.price || "0.00"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Manufacturer</h3>
              <div className="mt-3 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={product?.manufacturer?.name}
                    onChange={handleManufacturerChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={product?.manufacturer?.address}
                    onChange={handleManufacturerChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={product?.manufacturer?.contact}
                    onChange={handleManufacturerChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            onClick={handleUpdate}
            disabled={saving || uploading}
          >
            {uploading ? "Uploading image..." : saving ? "Updating..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(UpdateProductPage);
