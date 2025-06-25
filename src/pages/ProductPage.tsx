import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('all_products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Product fetch error:', error);
        setProduct(null);
      } else {
        setProduct(data);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-24 text-gray-500">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-24 text-gray-500">Product not found.</div>;
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
          <p className="text-lg md:text-xl text-[#231F20]">{product.description}</p>
          <div className="text-3xl text-[#161616] font-bold">${product.price}</div>
          <button className="mt-6 px-6 py-3 bg-[#161616] text-white rounded-2xl text-sm hover:bg-[#333] transition-all">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
