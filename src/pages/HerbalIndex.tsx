import { Link } from "react-router-dom";

const HerbalIndex = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-8 py-4 max-w-[1920px] mx-auto">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-black">
            NOON
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm text-black hover:text-gray-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop-all"
              className="text-sm text-black hover:text-gray-600 transition-colors"
            >
              Shop All
            </Link>
            <Link
              to="/the-science"
              className="text-sm text-black hover:text-gray-600 transition-colors"
            >
              The Science
            </Link>
            <Link
              to="/ethos"
              className="text-sm text-black hover:text-gray-600 transition-colors"
            >
              Our Ethos
            </Link>
            <Link
              to="/herbal-index"
              className="text-sm text-black hover:text-gray-600 transition-colors"
            >
              Herbal Index
            </Link>
          </div>

          {/* Account Section */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs">👤</span>
            </div>
            <span className="text-sm text-black">Account</span>
            <span className="text-sm text-black">(0)</span>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-[#F8F8F5] p-8">
        <div className="max-w-[1905px] mx-auto">
          <h1 className="text-6xl font-normal text-[#1E1E1E] mb-8">
            Herbal Index
          </h1>
          <p className="text-xl text-[#231F20] mb-16">
            Explore our comprehensive guide to functional mushrooms and their
            cognitive benefits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-[20px] p-6">
              <h3 className="text-2xl font-medium text-[#161616] mb-4">
                Lion's Mane
              </h3>
              <p className="text-[#B2AFAB] mb-4">
                Known for supporting cognitive function and nerve health
              </p>
              <div className="space-y-2">
                <div className="text-sm text-[#161616]">
                  <strong>Benefits:</strong> Memory support, focus enhancement
                </div>
                <div className="text-sm text-[#161616]">
                  <strong>Usage:</strong> Daily cognitive support
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] p-6">
              <h3 className="text-2xl font-medium text-[#161616] mb-4">
                Reishi
              </h3>
              <p className="text-[#B2AFAB] mb-4">
                The mushroom of immortality, supports stress management
              </p>
              <div className="space-y-2">
                <div className="text-sm text-[#161616]">
                  <strong>Benefits:</strong> Stress relief, sleep quality
                </div>
                <div className="text-sm text-[#161616]">
                  <strong>Usage:</strong> Evening relaxation
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] p-6">
              <h3 className="text-2xl font-medium text-[#161616] mb-4">
                Cordyceps
              </h3>
              <p className="text-[#B2AFAB] mb-4">
                Energy and endurance support for active lifestyles
              </p>
              <div className="space-y-2">
                <div className="text-sm text-[#161616]">
                  <strong>Benefits:</strong> Energy boost, stamina
                </div>
                <div className="text-sm text-[#161616]">
                  <strong>Usage:</strong> Pre-workout or morning
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] p-6">
              <h3 className="text-2xl font-medium text-[#161616] mb-4">
                Chaga
              </h3>
              <p className="text-[#B2AFAB] mb-4">
                Antioxidant powerhouse for immune system support
              </p>
              <div className="space-y-2">
                <div className="text-sm text-[#161616]">
                  <strong>Benefits:</strong> Immune support, antioxidants
                </div>
                <div className="text-sm text-[#161616]">
                  <strong>Usage:</strong> Daily wellness routine
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] p-6">
              <h3 className="text-2xl font-medium text-[#161616] mb-4">
                Turkey Tail
              </h3>
              <p className="text-[#B2AFAB] mb-4">
                Gut health and immune system modulation
              </p>
              <div className="space-y-2">
                <div className="text-sm text-[#161616]">
                  <strong>Benefits:</strong> Digestive health, immunity
                </div>
                <div className="text-sm text-[#161616]">
                  <strong>Usage:</strong> With meals
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] p-6">
              <h3 className="text-2xl font-medium text-[#161616] mb-4">
                Shiitake
              </h3>
              <p className="text-[#B2AFAB] mb-4">
                Cardiovascular and liver health support
              </p>
              <div className="space-y-2">
                <div className="text-sm text-[#161616]">
                  <strong>Benefits:</strong> Heart health, detox support
                </div>
                <div className="text-sm text-[#161616]">
                  <strong>Usage:</strong> Daily nutrition
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HerbalIndex;
