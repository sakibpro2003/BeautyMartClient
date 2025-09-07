"use client";
import withAdminAuth from "@/hoc/withAdminAuth";
import { createProduct } from "@/services/Products";
import { TProduct } from "@/types/product";
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
    requiredPrescription: false,
    expiryDate: "",
    manufacturer: {
      name: "",
      address: "",
      contact: "",
    },
    updated_at: "",
  });

  const [loading, setLoading] = useState(false); // Add loading state

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
    const res = await createProduct(product);
    console.log(res, "res");
    setLoading(false); // Set loading to false after product creation
    if (res?.data) {
      toast.success("Medicine added successfully");
      router.push("/manage-medicines");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto">
      <div className="max-w-3xl w-full p-6 bg-white shadow-lg rounded-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Medicine
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Medicine Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="inStock"
                checked={product.inStock}
                onChange={handleChange}
              />
              <label className="text-sm font-medium">In Stock</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="requiredPrescription"
                checked={product.requiredPrescription}
                onChange={handleChange}
              />
              <label className="text-sm font-medium">
                Requires Prescription
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={product.expiryDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Manufacturer Name
              </label>
              <input
                type="text"
                name="manufacturer.name"
                value={product.manufacturer.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Manufacturer Address
              </label>
              <input
                type="text"
                name="manufacturer.address"
                value={product.manufacturer.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Manufacturer Contact
              </label>
              <input
                type="text"
                name="manufacturer.contact"
                value={product.manufacturer.contact}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className={`w-full p-2 rounded-lg ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
              } text-white hover:bg-black/60`}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin border-t-2 border-white w-6 h-6 rounded-full"></div>
                  <span className="ml-2">Creating...</span>
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
//     requiredPrescription: false,
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
//             <Checkbox label="Requires Prescription" name="requiredPrescription" checked={product.requiredPrescription} onChange={handleChange} />

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
