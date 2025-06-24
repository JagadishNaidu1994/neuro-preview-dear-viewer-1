const ShopAll = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F5] p-8">
      <div className="max-w-[1905px] mx-auto">
        <h1 className="text-6xl font-normal text-[#1E1E1E] mb-8">
          Shop All Products
        </h1>
        <p className="text-xl text-[#231F20] mb-16">
          Discover our complete collection of functional mushroom products
          designed for cognitive wellness.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-[20px] p-6 shadow-sm">
            <h3 className="text-lg font-medium text-[#161616] mb-4">
              Chill Mushroom Gummy Delights
            </h3>
            <p className="text-sm text-[#B2AFAB] mb-4">
              For Happy Calm & Less Stress
            </p>
            <p className="text-[#161616] font-medium">$32</p>
          </div>
          <div className="bg-white rounded-[20px] p-6 shadow-sm">
            <h3 className="text-lg font-medium text-[#161616] mb-4">
              Matcha Chocolate Delights
            </h3>
            <p className="text-sm text-[#B2AFAB] mb-4">
              For Clean Energy, Calm Focus & Good Mood
            </p>
            <p className="text-[#161616] font-medium">$23</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAll;
