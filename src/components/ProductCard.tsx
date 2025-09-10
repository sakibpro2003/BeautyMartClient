/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/services/AuthService";
import Image from "next/image";
import Link from "next/link";
import Loader from "./Loader";
import { useSearchParams } from "next/navigation";

const ProductCard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formFilter, setFormFilter] = useState("");
  const [prescriptionFilter, setPrescriptionFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const itemsPerPage = 8;

  const searchParams = useSearchParams();
  const brandFilter = searchParams.get("brand");
  const categoryQuery = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        if (Array.isArray(response?.data)) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else {
          console.log("Unexpected API response:", response);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let updated = [...products];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      updated = updated.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // Filters
    // if (categoryFilter)
    //   updated = updated.filter((p) => p.category === categoryFilter);
    const effectiveCategory = categoryQuery || categoryFilter;
    if (effectiveCategory)
      updated = updated.filter((p) => p.category === effectiveCategory);

    if (formFilter) updated = updated.filter((p) => p.form === formFilter);
    if (prescriptionFilter)
      updated = updated.filter(
        (p) => p.requiredPrescription === (prescriptionFilter === "yes")
      );
    if (stockFilter)
      updated = updated.filter((p) => p.inStock === (stockFilter === "in"));

    // Brand filter from URL query
    if (brandFilter) {
      const brandLower = brandFilter.toLowerCase();
      updated = updated.filter(
        (p) => p.manufacturer?.name?.toLowerCase() === brandLower
      );
    }

    // Sorting
    if (sortOption === "lowToHigh") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      updated.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updated);
    setCurrentPage(1);
  }, [
    searchQuery,
    products,
    sortOption,
    categoryFilter,
    formFilter,
    prescriptionFilter,
    stockFilter,
    brandFilter,
    categoryQuery,
  ]);

  if (loading) return <Loader />;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-4 w-11/12 mx-auto h-screen">
      <div className="flex flex-col  lg:flex-row gap-6">
        {/* Sidebar Filters */}
        {/* <div className="lg:w-1/4 w-full p-4 border-2  rounded-md space-y-4">
          <div>
            <h3 className="font-bold text-xl mb-2">Search</h3>
            <input
              type="text"
              placeholder="Name or symptoms"
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Sort by Price</label>
            <select
              className="select select-bordered w-full mt-1"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Category</label>
            <select
              className="select select-bordered w-full mt-1"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Painkiller">Painkiller</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Cold">Cold</option>
              <option value="Vitamin">Vitamin</option>
              <option value="Antacid">Antacid</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Form</label>
            <select
              className="select select-bordered w-full mt-1"
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Tablet">Tablet</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Prescription</label>
            <select
              className="select select-bordered w-full mt-1"
              value={prescriptionFilter}
              onChange={(e) => setPrescriptionFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="yes">Required</option>
              <option value="no">Not Required</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Stock</label>
            <select
              className="select select-bordered w-full mt-1"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div> */}

        {/* Products Grid */}
        <div className="lg:w-3/4 w-full mx-auto">
          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {selectedProducts.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">
                No products found
              </p>
            ) : (
              selectedProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white relative rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col justify-between"
                >
                  <span className="inline-flex absolute items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    {p.discount}%
                  </span>
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={200}
                    height={200}
                    className="rounded-xl mx-auto"
                    unoptimized
                  />
                  <div className="mt-4 ">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      {p.requiredPrescription && (
                        <span className="bg-black text-white text-xs px-2 py-0.5 rounded">
                          Prescription
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {p.description}
                    </p>
                    <p className="font-bold text-green-600 mb-1">${p.price}</p>
                    {/* <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Badge</span> */}
                    <div className="text-xs flex justify-between items-center mt-2">
                      <span className="text-gray-500">
                        {p.manufacturer?.name}
                      </span>
                      <span
                        className={`rounded-full text-white text-xs px-2 py-0.5 ${
                          p.inStock ? "bg-green-600" : "bg-red-500"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/products/${p._id}`}
                    className="mt-3 inline-block text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                  >
                    View Details
                  </Link>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-4">
              <button
                className="btn btn-outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <span className="py-2 px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-outline"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
