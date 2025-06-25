import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";

const ShopAll = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAccountClick = () => {
    setIsAuthModalOpen(true);
  };

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
    {
      id: 2,
      name: "Calm Mushroom Gummy Delights",
      price: "$32",
      rating: 5,
      reviews: 12,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
      description: "For Happy Calm & Less Stress",
    },
    {
      id: 3,
      name: "Sleep Mushroom Gummy Delights",
      price: "$48",
      rating: 5,
      reviews: 15,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
      description: "For Deep Rest & Recovery",
    },
    {
      id: 4,
      name: "Matcha Chocolate Delights",
      price: "$23",
      rating: 5,
      reviews: 6,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d0995167772a5034c3deecba822595a5b4ac0b48",
      description: "For Clean Energy, Calm Focus & Good Mood",
    },
    {
      id: 5,
      name: "Energy Mushroom Blend",
      price: "$45",
      rating: 5,
      reviews: 9,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
      description: "For Natural Energy & Vitality",
    },
    {
      id: 6,
      name: "Immunity Mushroom Complex",
      price: "$55",
      rating: 5,
      reviews: 11,
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
      description: "For Immune System Support",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      {/* Main Content */}
      <main className="max-w-[1905px] mx-auto px-4 md:px-8 pt-8">
        {/* Page Title */}
        <div className="text-center py-12 md:py-16">
          <h1 className="text-[#1E1E1E] text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-[-2px] md:tracking-[-3px]">
            Shop All Products
          </h1>
          <p className="text-[#231F20] text-lg md:text-xl font-normal mt-6 max-w-[600px] mx-auto">
            Discover our complete collection of premium mushroom-based wellness
            products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-16">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products?id=${product.id}`}
              className="bg-[#EEEEEA] rounded-[20px] overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="aspect-square p-6 flex items-center justify-center bg-[#EEEEEA]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-[#161616] text-lg font-medium mb-2">
                  {product.name}
                </h3>
                <p className="text-[#B2AFAB] text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(product.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#161616] text-xl font-semibold">
                    {product.price}
                  </span>
                  <Button
                    variant="outline"
                    className="border-2 border-[#161616] text-[#161616] bg-transparent hover:bg-[#161616] hover:text-white rounded-2xl px-4 py-2 text-sm"
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