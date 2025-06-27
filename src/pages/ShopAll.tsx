// src/pages/ShopAll.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/Header";

const products = [
  {
    id: 1,
    name: "Focus Mushroom Gummy Delights",
    price: "$52",
    rating: 5,
    reviews: 8,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
    description: "For Enhanced Focus & Mental Clarity",
  },
  // ...more items
];

const ShopAll = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />

      <main className="max-w-[1905px] mx-auto px-4 md:px-8 pt-12 pb-16">
        {/* Hero Banner */}
        <section className="relative h-64 md:h-96 overflow-hidden rounded-xl mb-12">
          <img
            src="/images/shop-hero.jpg"
            alt="Shop Banner"
            className="object-cover w-full h-full brightness-90 transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">
              Shop All Products
            </h1>
          </div>
        </section>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {products.map((product) => (
            <Link
              to={`/product?id=${product.id}`}
              key={product.id}
              className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden rounded-t-lg bg-[#EEEEEA]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 md:p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-[#161616] text-lg font-medium mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[#B2AFAB] text-sm mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(product.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-base">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({product.reviews})
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-[#161616] text-xl font-semibold">
                    {product.price}
                  </span>
                  <Button
                    variant="outline"
                    className="border-2 border-[#161616] text-[#161616] bg-transparent hover:bg-[#161616] hover:text-white rounded-full px-5 py-2 text-sm transition-colors"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShopAll;
