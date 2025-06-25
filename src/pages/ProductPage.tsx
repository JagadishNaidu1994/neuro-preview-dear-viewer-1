import { useParams } from "react-router-dom";
import Header from "@/components/Header";

const productData = {
 {
    id: 1,
    slug: "focusmushroomgummies",
    name: "Focus Mushroom Gummy Delights",
    price: "$52",
    rating: 5,
    reviews: 8,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
    description: "For Enhanced Focus & Mental Clarity",
  },
  {
    id: 2,
    slug: "calmmushroomgummies",
    name: "Calm Mushroom Gummy Delights",
    price: "$32",
    rating: 5,
    reviews: 12,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
    description: "For Happy Calm & Less Stress",
  },
  {
    id: 3,
    slug: "sleepmushroomgummies",
    name: "Sleep Mushroom Gummy Delights",
    price: "$48",
    rating: 5,
    reviews: 15,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
    description: "For Deep Rest & Recovery",
  },
  {
    id: 4,
    slug: "matchachocolatedelights",
    name: "Matcha Chocolate Delights",
    price: "$23",
    rating: 5,
    reviews: 6,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d0995167772a5034c3deecba822595a5b4ac0b48",
    description: "For Clean Energy, Calm Focus & Good Mood",
  },
  {
    id: 5,
    slug: "energymushroomblend",
    name: "Energy Mushroom Blend",
    price: "$45",
    rating: 5,
    reviews: 9,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
    description: "For Natural Energy & Vitality",
  },
  {
    id: 6,
    slug: "immunitymushroomcomplex",
    name: "Immunity Mushroom Complex",
    price: "$55",
    rating: 5,
    reviews: 11,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8040d28d4a7ffcb143c97e6d28e82cbe1ee0a7da",
    description: "For Immune System Support",
  },
};

const ProductPage = () => {
  const { productId } = useParams();
  const product = productData[productId as keyof typeof productData];

  if (!product) return <div>Product not found.</div>;

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />

      <div className="max-w-[1905px] mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-[20px] w-full h-auto object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold text-[#1E1E1E] mb-4">{product.name}</h1>
            <p className="text-[#231F20] text-lg mb-4">{product.description}</p>
            <span className="text-xl font-semibold text-[#161616] mb-6 block">{product.price}</span>
            <button className="bg-[#161616] text-white rounded-xl px-6 py-3 hover:bg-[#333]">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
