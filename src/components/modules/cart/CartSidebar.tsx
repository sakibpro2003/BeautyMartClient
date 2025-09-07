// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";

// interface CartItem {
//   _id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface CartSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log(token,'token')
//       const response = await fetch("/api/cart", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error("Failed to fetch cart");
//       const data = await response.json();
//       setCartItems(data.items);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   return (
//     <div
//       className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform transition-transform ${
//         isOpen ? "translate-x-0" : "translate-x-full"
//       } z-50`}
//     >
//       <div className="p-4 flex justify-between items-center border-b">
//         <h2 className="text-lg font-semibold">Shopping Cart</h2>
//         <button onClick={onClose} className="text-gray-600">
//           {/* <IoClose size={24} /> */}
//           icon
//         </button>
//       </div>

//       <div className="p-4 space-y-4">
//         {cartItems.length === 0 ? (
//           <p className="text-gray-500">Your cart is empty.</p>
//         ) : (
//           cartItems.map((item) => (
//             <div key={item._id} className="flex items-center space-x-4 border-b pb-2">
//               <Image src={item.image} alt={item.name} width={50} height={50} className="rounded" />
//               <div className="flex-1">
//                 <h3 className="text-sm font-semibold">{item.name}</h3>
//                 <p className="text-gray-600">${item.price} x {item.quantity}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="p-4 border-t">
//         <p className="font-semibold">Total: ${totalPrice.toFixed(2)}</p>
//         <button className="w-full bg-green-500 text-white py-2 mt-2 rounded">
//           Checkout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartSidebar;
