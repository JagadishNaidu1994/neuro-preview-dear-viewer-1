import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://bptuqhvcsfgjohguykct.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHVxaHZjc2Znam9oZ3V5a2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Nzc5NTcsImV4cCI6MjA2NjQ1Mzk1N30.YxxoYtnV8kmL55DNz3htu0AcGcf9V3B50HuRgDYyEZM" // replace with your actual Supabase anon key
);

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("all_products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#F8F8F5] min-h-screen text-center py-24 text-xl text-gray-500">
        Loading product...
      </div>
    );
  }

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
          <div className="text-3xl text-[#161616] font-bold">
            ${product.price}
          </div>
          <button className="mt-6 px-6 py-3 bg-[#161616] text-white rounded-2xl text-sm hover:bg-[#333] transition-all">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
