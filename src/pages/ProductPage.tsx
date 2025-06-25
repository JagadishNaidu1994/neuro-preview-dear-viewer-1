import { useParams } from "react-router-dom";
import Header from "@/components/Header";

const products = {
  focusmushroomgummies: {
    title: "Focus Mushroom Gummy Delights",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/focus.png",
    description:
      "Enhance your cognitive clarity and maintain focus all day with our natural mushroom blend, featuring Lion's Mane and L-Theanine.",
    price: "$52",
  },
  calmmushroomgummies: {
    title: "Calm Mushroom Gummy Delights",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/calm.png",
    description:
      "De-stress and find calm in chaos with our relaxing blend of Reishi, Ashwagandha, and Magnesium.",
    price: "$32",
  },
  sleepmushroomgummies: {
    title: "Sleep Mushroom Gummy Delights",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/sleep.png",
    description:
      "Fall asleep faster and wake up refreshed with our sleep support formula of Melatonin, Chamomile, and Jatamansi.",
    price: "$48",
  },
  matchachocolatedelights: {
    title: "Matcha Chocolate Delights",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/matcha.png",
    description:
      "Enjoy clean energy and a good mood with ceremonial-grade matcha, L-Theanine, and adaptogenic cacao.",
    price: "$23",
  },
};

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products[slug as keyof typeof products];

  if (!product) {
    return (
      <div className="bg-[#F8F8F5] min-h-screen text-center py-24 text-2xl text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F5] min-h-screen">
                <Header />
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src={product.image}
            alt={product.title}
            className="w-full rounded-2xl shadow-lg object-cover"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl text-[#1E1E1E] font-semibold">
            {product.title}
          </h1>
          <p className="text-lg md:text-xl text-[#231F20]">
            {product.description}
          </p>
          <div className="text-3xl text-[#161616] font-bold">{product.price}</div>
          <button className="mt-6 px-6 py-3 bg-[#161616] text-white rounded-2xl text-sm hover:bg-[#333] transition-all">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
