"use client";
import withAdminAuth from "@/hoc/withAdminAuth";
import { createProduct } from "@/services/Products";
import { uploadImage } from "@/utils/uploadImage";
import { TProduct } from "@/types/product";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ProductForm = () => {
  const router = useRouter();
  const [product, setProduct] = useState<TProduct>({
    name: "",
    product: {
      name: "",
      image: "",
    },
    image: "",
    totalPrice: 0,
    description: "",
    price: 0,
    inStock: true,
    quantity: 0,
    expiryDate: "",
    manufacturer: {
      name: "",
      address: "",
      contact: "",
    },
    updated_at: "",
  });

  const [loading, setLoading] = useState(false); // Add loading state
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;

    const { name, value, type } = target;
    const checked = target.checked;

    if (name.includes("manufacturer.")) {
      const field = name.split(".")[1];
      setProduct((prev) => ({
        ...prev,
        manufacturer: { ...prev.manufacturer, [field]: value },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    let imageUrl = product.image;

    try {
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile, "beautymart/products");
        toast.success("Image uploaded to Cloudinary.");
      }

      const res = await createProduct({ ...product, image: imageUrl });
      console.log(res, "res");
      if (res?.data) {
        toast.success("Medicine added successfully");
        router.push("/manage-medicines");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create product.");
    } finally {
      setLoading(false); // Set loading to false after product creation
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 py-8">
      <div className="mx-auto w-11/12 max-w-5xl rounded-3xl bg-white/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pink-500">Admin</p>
            <h2 className="text-2xl font-bold text-gray-900">Add new product</h2>
            <p className="text-sm text-gray-600">
              Create an item with full details for the storefront.
            </p>
          </div>
          <span className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow">
            Inventory
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800">Product Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800">Product image</label>
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                        <ImageIcon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Upload product image</p>
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
                          return;
                        }
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                        setImageFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }}
                    />
                  </div>
                  {(previewUrl || product.image) && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-pink-100 bg-white">
                      <img
                        src={previewUrl || product.image}
                        alt="Product preview"
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  name="image"
                  value={product.image}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  required
                />
                <p className="text-xs text-gray-500">
                  Upload to Cloudinary happens when you submit, or paste an existing image URL.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-800">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="inStock"
                checked={product.inStock}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-400"
              />
              <label className="text-sm font-semibold text-gray-800">In Stock</label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={product.expiryDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800">Manufacturer Name</label>
              <input
                type="text"
                name="manufacturer.name"
                value={product.manufacturer.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-800">Manufacturer Address</label>
                <input
                  type="text"
                  name="manufacturer.address"
                  value={product.manufacturer.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800">Manufacturer Contact</label>
                <input
                  type="text"
                  name="manufacturer.contact"
                  value={product.manufacturer.contact}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className={`w-full rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5 hover:shadow-xl ${
                loading || uploading ? "opacity-70" : ""
              }`}
              disabled={loading || uploading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin border-t-2 border-white w-5 h-5 rounded-full"></div>
                  <span className="ml-2">Creating...</span>
                </div>
              ) : uploading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin border-t-2 border-white w-5 h-5 rounded-full"></div>
                  <span className="ml-2">Uploading image...</span>
                </div>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAdminAuth(ProductForm);


// "use client";
// import withAdminAuth from "@/hoc/withAdminAuth";
// import { createProduct } from "@/services/Products";
// import { TProduct } from "@/types/product";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { toast } from "react-toastify";

// const formOptions = ["Tablet", "Syrup", "Injection", "Ointment", "Capsule"];
// const categoryOptions = ["Painkiller", "Antibiotic", "Cold", "Vitamin", "Antacid"];

// const ProductForm = () => {
//   const router = useRouter();
//   const [product, setProduct] = useState<TProduct>({
//     name: "",
//     image: "",
//     description: "",
//     form: "Tablet",
//     rating: 1,
//     discount: 0,
//     packSize: "",
//     dosage: "",
//     category: "Painkiller",
//     price: 0,
//     inStock: true,
//     quantity: 0,
//     expiryDate: "",
//     manufacturer: {
//       name: "",
//       address: "",
//       contact: "",
//     },
//     updated_at: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const target = e.target;
//     const { name, value, type } = target;
//     const checked = (target as HTMLInputElement).checked;

//     if (name.includes("manufacturer.")) {
//       const field = name.split(".")[1];
//       setProduct((prev) => ({
//         ...prev,
//         manufacturer: { ...prev.manufacturer, [field]: value },
//       }));
//     } else {
//       setProduct((prev) => ({
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await createProduct(product);
//     if (res?.data) {
//       toast.success("Medicine added successfully");
//       router.push("/manage-medicines");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-4xl w-full p-6 bg-white shadow-lg rounded-lg border">
//         <h2 className="text-2xl font-bold mb-6 text-center">Create New Medicine</h2>
//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//           {/* Left column */}
//           <div className="space-y-4">
//             <Input label="Medicine Name" name="name" value={product.name} onChange={handleChange} />
//             <Input label="Image URL" name="image" value={product.image} onChange={handleChange} />
//             <TextArea label="Description" name="description" value={product.description} onChange={handleChange} />
//             <Input label="Price" name="price" type="number" value={product.price} onChange={handleChange} />
//             <Input label="Quantity" name="quantity" type="number" value={product.quantity} onChange={handleChange} />
//             <Select label="Form" name="form" value={product.form} options={formOptions} onChange={handleChange} />
//             <Input label="Dosage" name="dosage" value={product.dosage} onChange={handleChange} />
//           </div>

//           {/* Right column */}
//           <div className="space-y-4">
//             <Input label="Discount (%)" name="discount" type="number" value={product.discount} onChange={handleChange} />
//             <Input label="Rating" name="rating" type="number" value={product.rating} onChange={handleChange} />
//             <Input label="Pack Size" name="packSize" value={product.packSize} onChange={handleChange} />
//             <Select label="Category" name="category" value={product.category} options={categoryOptions} onChange={handleChange} />
//             <Input label="Expiry Date" name="expiryDate" type="date" value={product.expiryDate} onChange={handleChange} />

//             <Checkbox label="In Stock" name="inStock" checked={product.inStock} onChange={handleChange} />

//             <Input label="Manufacturer Name" name="manufacturer.name" value={product.manufacturer.name} onChange={handleChange} />
//             <Input label="Manufacturer Address" name="manufacturer.address" value={product.manufacturer.address} onChange={handleChange} />
//             <Input label="Manufacturer Contact" name="manufacturer.contact" value={product.manufacturer.contact} onChange={handleChange} />
//           </div>

//           <div className="col-span-2">
//             <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
//               Create Product
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Reusable components
// const Input = ({ label, ...props }: any) => (
//   <div>
//     <label className="block text-sm font-medium">{label}</label>
//     <input className="w-full p-2 border border-gray-300 rounded" {...props} required />
//   </div>
// );

// const TextArea = ({ label, ...props }: any) => (
//   <div>
//     <label className="block text-sm font-medium">{label}</label>
//     <textarea className="w-full p-2 border border-gray-300 rounded" {...props} required />
//   </div>
// );

// const Select = ({ label, options, ...props }: any) => (
//   <div>
//     <label className="block text-sm font-medium">{label}</label>
//     <select className="w-full p-2 border border-gray-300 rounded" {...props} required>
//       {options.map((option: string) => (
//         <option key={option} value={option}>
//           {option}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const Checkbox = ({ label, ...props }: any) => (
//   <div className="flex items-center space-x-2">
//     <input type="checkbox" {...props} />
//     <label className="text-sm font-medium">{label}</label>
//   </div>
// );

// export default withAdminAuth(ProductForm);
