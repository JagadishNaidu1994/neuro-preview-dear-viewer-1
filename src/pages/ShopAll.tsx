// src/pages/ShopAll.tsx
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  reviews: number;
  rating: number;
  img: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Focus Mushroom Gummy Delights", price: "$32", rating: 5, reviews: 6, img: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da" },
  { id: 2, name: "Chill Mushroom Gummy Delights", price: "$32", rating: 5, reviews: 31, img: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da" },
  { id: 3, name: "Sleep Mushroom Gummy Delights", price: "$32", rating: 5, reviews: 112, img: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da" },
  { id: 4, name: "Matcha Chocolate Delights", price: "$23", rating: 5, reviews: 1, img: "https://cdn.builder.io/api/v1/image/assets/TEMP/d0995167772a5034c3deecba822595a5b4ac0b48" },
  // Add more items as needed...
];

export default function ShopAll() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCTS.map((p) => (
            <Link
              key={p.id}
              to={`/product?id=${p.id}`}
              className="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 font-medium mb-1">{p.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  {[...Array(p.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                  <span className="ml-2">({p.reviews})</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
