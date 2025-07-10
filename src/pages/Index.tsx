
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleAccountClick = () => {
    setIsAuthModalOpen(true);
  };

  // Carousel data with 3 different products
  const carouselItems = [
    {
      id: 1,
      name: "Chill Mushroom Gummy Delights",
      price: "$32",
      description: "For Happy Calm & Less Stress",
      image: "https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 2,
      name: "Focus Mushroom Gummy Delights", 
      price: "$32",
      description: "For Mental Clarity & Sharp Focus",
      image: "https://images.pexels.com/photos/5946071/pexels-photo-5946071.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 3,
      name: "Sleep Mushroom Gummy Delights",
      price: "$32", 
      description: "For Deep Sleep & Recovery",
      image: "https://images.pexels.com/photos/5946063/pexels-photo-5946063.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  // Auto-rotate carousel every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      {/* Main Content */}
      <main className="max-w-[1905px] mx-auto px-4 md:px-[15px] pt-[18px]">
        <div className="space-y-[60px] md:space-y-[90px]">
          {/* Hero Section */}
          <section className="h-[400px] md:h-[600px] lg:h-[783px] relative">
            <div
              className="w-full h-full rounded-[20px] md:rounded-[30px] relative overflow-hidden"
              style={{
                backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2Fa01fc8006bac4571b568086c6ecf7141')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 w-[calc(100%-48px)] md:w-[470px]">
                <div className="space-y-4 md:space-y-5">
                  <h1 className="text-white text-lg md:text-xl font-normal leading-tight md:leading-6 tracking-tight">
                    Celebrating the brightest minds of our generation.
                    Experience mushrooms for clarity, calm and deep sleep.
                  </h1>
                  <Link to="/shop-all">
                    <Button
                      variant="outline"
                      className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black rounded-2xl px-4 py-2 md:px-6 md:py-3 opacity-70 hover:opacity-100 transition-all text-sm"
                    >
                      <span className="underline">Shop All Products</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Product Showcase Carousel Section */}
          <section className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[866px]">
              {/* Left Product Carousel */}
              <div className="bg-[#EEEEEA] rounded-[20px] relative overflow-hidden h-[400px] lg:h-full">
                <div className="h-full flex flex-col justify-center items-center relative">
                  {/* Carousel Images */}
                  <div className="relative w-full h-full overflow-hidden">
                    {carouselItems.map((item, index) => (
                      <img
                        key={item.id}
                        src={item.image}
                        alt={item.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                          index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Product Info Overlay */}
                  <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-[#161616] text-xs">
                        {carouselItems[currentSlide].name}
                      </span>
                      <span className="text-[#161616] text-xs">·</span>
                      <span className="text-[#161616] text-xs">{carouselItems[currentSlide].price}</span>
                    </div>
                    <p className="text-[#B2AFAB] text-xs text-center">
                      {carouselItems[currentSlide].description}
                    </p>
                  </div>

                  {/* Carousel Dots */}
                  <div className="absolute bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 bg-[#C2C2C2] rounded-[10px] px-3 py-3 flex gap-1">
                    {carouselItems.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                          index === currentSlide ? 'bg-[#3D3D3D]' : 'bg-[#F6F6F6]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="rounded-[20px] overflow-hidden h-[400px] lg:h-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/acc73dfe007e772951581d91e62c6a9de4c7bbb4"
                  alt="DearNeuro gummies in hand"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Tagline Section */}
            <div className="text-center py-12 md:py-24">
              <div className="max-w-[900px] md:max-w-[1050px] mx-auto px-4">
                <h2 className="text-[#1E1E1E] text-3xl md:text-5xl lg:text-6xl font-normal leading-tight md:leading-[65px] tracking-[-2px] md:tracking-[-3px]">
                  Next generation cognitive wellness for your best mind & mood,
                  where neuroscience meets nature
                </h2>
              </div>
            </div>

            {/* Science Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 min-h-auto lg:min-h-[785px] items-center">
              <div className="flex flex-col justify-center items-start lg:items-end space-y-6 order-2 lg:order-1">
                <div className="max-w-[350px] text-left lg:text-right">
                  <p className="text-[#231F20] text-lg md:text-xl font-normal leading-6 tracking-tight mb-6">
                    A new era of wellbeing made by a team of neuroscientists and
                    functional health doctors harnessing plant technology into
                    powerful, delightful rituals.
                  </p>
                </div>
                <Link to="/the-science">
                  <Button
                    variant="outline"
                    className="border-2 border-[#161616] text-[#161616] bg-transparent hover:bg-[#161616] hover:text-white rounded-2xl px-6 py-3"
                  >
                    Our Science
                  </Button>
                </Link>
              </div>
              <div className="rounded-[20px] overflow-hidden h-[300px] md:h-[400px] lg:h-full order-1 lg:order-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a760dbb1fd453f7e5e2af17f5fe0ba0eb31cb2e"
                  alt="Neuroscience"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Matcha Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[1067px]">
              <div className="rounded-[20px] overflow-hidden h-[400px] lg:h-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/51ae52ca24602470e69283533a66972c73f4a355"
                  alt="Matcha in hand"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#EEEEEA] rounded-[20px] relative overflow-hidden h-[400px] lg:h-full">
                <div className="h-full flex flex-col justify-center items-center relative">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d0995167772a5034c3deecba822595a5b4ac0b48"
                    alt="Matcha Chocolate Delights"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-[#161616] text-xs">
                        Matcha Chocolate Delights
                      </span>
                      <span className="text-[#161616] text-xs">·</span>
                      <span className="text-[#161616] text-xs">$23</span>
                    </div>
                    <p className="text-[#B2AFAB] text-xs text-center">
                      For Clean Energy, Calm Focus & Good Mood
                    </p>
                  </div>
                  <div className="absolute bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 bg-[#C2C2C2] rounded-[10px] px-3 py-3 flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-[#F6F6F6]"></div>
                    <div className="w-1 h-1 rounded-full bg-[#3D3D3D]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ethos Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 min-h-auto lg:min-h-[928px] items-center">
              <div className="rounded-[20px] overflow-hidden h-[300px] md:h-[400px] lg:h-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f0bc87702f82d2d91ac7b2a3864f5948ad805ff7"
                  alt="Ethos featured"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div className="max-w-[520px]">
                  <h3 className="text-[#1E1E1E] text-2xl md:text-3xl lg:text-4xl font-normal leading-tight md:leading-[44px] tracking-[-1.5px] md:tracking-[-2.4px]">
                    Connecting you to a new level of cognitive care- mind to the
                    body- with the everyday ritual of functional mushrooms
                  </h3>
                </div>
                <Link to="/ethos">
                  <Button
                    variant="outline"
                    className="border-2 border-[#161616] text-[#161616] bg-transparent hover:bg-[#161616] hover:text-white rounded-2xl px-6 py-3 w-fit"
                  >
                    Our Ethos
                  </Button>
                </Link>
              </div>
            </div>

            {/* Call to Action Section */}
            <div className="text-center py-12 md:py-16">
              <div className="max-w-[550px] md:max-w-[650px] mx-auto px-4">
                <h2 className="text-[#1E1E1E] text-3xl md:text-5xl lg:text-6xl font-normal leading-tight md:leading-[65px] tracking-[-2px] md:tracking-[-3px]">
                  Tap into your best state of mind with us.
                </h2>
              </div>
            </div>

            {/* Final Hero Image */}
            <div className="rounded-[20px] overflow-hidden h-[400px] md:h-[600px] lg:h-[1038px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5bf61355202313d21636053ee5780caa87b95552"
                alt="Man with face shadow"
                className="w-full h-full object-cover"
              />
            </div>
          </section>
        </div>
      </main>

      {/* Logo Marquee Section */}
      <section className="py-8 md:py-16 overflow-hidden">
        <div className="relative">
          <div className="flex animate-scroll">
            <div className="flex items-center justify-around w-[1200px] md:w-[1708px] flex-shrink-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5128296a9628522dbdca197b9e29a7e3a077757b"
                alt="Vogue"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/d41c325bba953f413ba7df64f41310e7516f77ec"
                alt="Elle"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7878c3dbec794339c26e6f2822118b3382c65d1"
                alt="Wallpaper"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5eeb8ee4b2ab59e5ded0c9bf065980abc8935f54"
                alt="Hunger"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f9b8a5f574d2bf861d6335d6d7f048fd95c1762c"
                alt="Bazaar"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6def4ee2043594b1f746f42a8a028922876bdbdb"
                alt="Vanity Fair"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/07ff7536b939e5dd4ce4717d7e5a9876c8c01d69"
                alt="Marie Claire"
                className="h-6 md:h-10"
              />
            </div>
            <div className="flex items-center justify-around w-[1200px] md:w-[1708px] flex-shrink-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5128296a9628522dbdca197b9e29a7e3a077757b"
                alt="Vogue"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/d41c325bba953f413ba7df64f41310e7516f77ec"
                alt="Elle"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7878c3dbec794339c26e6f2822118b3382c65d1"
                alt="Wallpaper"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5eeb8ee4b2ab59e5ded0c9bf065980abc8935f54"
                alt="Hunger"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f9b8a5f574d2bf861d6335d6d7f048fd95c1762c"
                alt="Bazaar"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6def4ee2043594b1f746f42a8a028922876bdbdb"
                alt="Vanity Fair"
                className="h-6 md:h-10"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/07ff7536b939e5dd4ce4717d7e5a9876c8c01d69"
                alt="Marie Claire"
                className="h-6 md:h-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8F8F5] pt-8 md:pt-16 pb-8">
        <div className="max-w-[1905px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 mb-8 md:mb-16">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#161616] tracking-tight">
                  DearNeuro
                </h2>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-8 md:gap-20">
              <div className="space-y-3">
                <Link
                  to="/shop-all"
                  className="block text-xs text-black hover:underline"
                >
                  Shop All
                </Link>
                <Link
                  to="/the-science"
                  className="block text-xs text-black hover:underline"
                >
                  The Science
                </Link>
                <Link
                  to="/ethos"
                  className="block text-xs text-black hover:underline"
                >
                  Our Ethos
                </Link>
                <Link
                  to="/herbal-index"
                  className="block text-xs text-black hover:underline"
                >
                  Herbal Index
                </Link>
                <div className="pt-6 md:pt-10">
                  <Link
                    to="/privacy"
                    className="block text-[9px] text-black hover:underline"
                  >
                    Privacy & Cookies Policy
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                <Link
                  to="/faqs"
                  className="block text-xs text-black hover:underline"
                >
                  FAQs
                </Link>
                <Link
                  to="/shipping"
                  className="block text-xs text-black hover:underline"
                >
                  Shipping & Returns
                </Link>
                <Link
                  to="/terms"
                  className="block text-xs text-black hover:underline"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="/contact"
                  className="block text-xs text-black hover:underline"
                >
                  Contact Us
                </Link>
                <div className="pt-6 md:pt-10">
                  <Link
                    to="/accessibility"
                    className="block text-[9px] text-black hover:underline"
                  >
                    Accessibility Statement
                  </Link>
                </div>
              </div>
            </div>

            {/* Social & Legal */}
            <div className="lg:col-span-1 space-y-6 md:space-y-8">
              <div className="flex gap-3">
                <a href="#" className="w-[18px] h-[18px]">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_161_67)">
                      <path
                        d="M9.5 5.30153C8.69724 5.30153 7.91251 5.53957 7.24504 5.98556C6.57757 6.43155 6.05734 7.06545 5.75014 7.80711C5.44293 8.54876 5.36256 9.36485 5.51917 10.1522C5.67578 10.9396 6.06234 11.6628 6.62998 12.2304C7.19762 12.7981 7.92083 13.1846 8.70816 13.3412C9.4955 13.4978 10.3116 13.4175 11.0532 13.1103C11.7949 12.8031 12.4288 12.2828 12.8748 11.6154C13.3208 10.9479 13.5588 10.1631 13.5588 9.36035C13.5574 8.28431 13.1293 7.25275 12.3685 6.49188C11.6076 5.731 10.576 5.30293 9.5 5.30153ZM9.5 12.3604C8.90666 12.3604 8.32664 12.1845 7.83329 11.8548C7.33994 11.5252 6.95542 11.0566 6.72836 10.5085C6.5013 9.96022 6.44189 9.35702 6.55764 8.77508C6.6734 8.19314 6.95912 7.65859 7.37868 7.23903C7.79824 6.81947 8.33279 6.53375 8.91473 6.41799C9.49667 6.30224 10.0999 6.36165 10.6481 6.58871C11.1962 6.81577 11.6648 7.20029 11.9944 7.69364C12.3241 8.18699 12.5 8.76701 12.5 9.36035C12.5 10.156 12.1839 10.9191 11.6213 11.4817C11.0587 12.0443 10.2957 12.3604 9.5 12.3604ZM13.7353 0.360352H5.26471C4.00146 0.361753 2.79035 0.864198 1.8971 1.75745C1.00385 2.6507 0.501401 3.86181 0.5 5.12506V13.5957C0.501401 14.8589 1.00385 16.0701 1.8971 16.9633C2.79035 17.8566 4.00146 18.359 5.26471 18.3604H13.7353C14.9985 18.359 16.2097 17.8566 17.1029 16.9633C17.9962 16.0701 18.4986 14.8589 18.5 13.5957V5.12506C18.4986 3.86181 17.9962 2.6507 17.1029 1.75745C16.2097 0.864198 14.9985 0.361753 13.7353 0.360352ZM17.4412 13.5957C17.4412 14.5786 17.0507 15.5212 16.3557 16.2161C15.6608 16.9111 14.7182 17.3016 13.7353 17.3016H5.26471C4.28184 17.3016 3.33924 16.9111 2.64425 16.2161C1.94926 15.5212 1.55882 14.5786 1.55882 13.5957V5.12506C1.55882 4.14219 1.94926 3.19959 2.64425 2.5046C3.33924 1.80961 4.28184 1.41917 5.26471 1.41917H13.7353C14.7182 1.41917 15.6608 1.80961 16.3557 2.5046C17.0507 3.19959 17.4412 4.14219 17.4412 5.12506V13.5957ZM14.9706 4.77211C14.9706 4.94663 14.9188 5.11722 14.8219 5.26232C14.7249 5.40743 14.5871 5.52052 14.4259 5.5873C14.2647 5.65409 14.0873 5.67156 13.9161 5.63751C13.7449 5.60347 13.5877 5.51943 13.4643 5.39603C13.3409 5.27263 13.2569 5.11541 13.2228 4.94425C13.1888 4.77309 13.2063 4.59568 13.273 4.43445C13.3398 4.27322 13.4529 4.13542 13.598 4.03847C13.7431 3.94151 13.9137 3.88976 14.0882 3.88976C14.3223 3.88976 14.5467 3.98272 14.7122 4.1482C14.8776 4.31367 14.9706 4.5381 14.9706 4.77211Z"
                        fill="#1E1E1E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_161_67">
                        <rect
                          width="18"
                          height="18"
                          fill="white"
                          transform="translate(0.5 0.360352)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                <a href="#" className="w-[18px] h-[18px]">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_161_44)">
                      <path
                        d="M13.0261 -0.0165932L12.5517 -0.764648H9.68061V5.97273L9.67082 12.5537C9.67571 12.6026 9.68061 12.6564 9.68061 12.7052C9.68061 14.3529 8.34044 15.6975 6.68725 15.6975C5.03405 15.6975 3.6939 14.3578 3.6939 12.7052C3.6939 11.0575 5.03405 9.71301 6.68725 9.71301C7.02962 9.71301 7.36222 9.77657 7.67036 9.88413V6.59856C7.35244 6.54478 7.02473 6.51544 6.68725 6.51544C3.27815 6.52033 0.5 9.29742 0.5 12.7102C0.5 16.1228 3.27814 18.8999 6.69213 18.8999C10.1061 18.8999 12.8842 16.1228 12.8842 12.7102V4.88244C14.1217 6.11941 15.7211 7.32706 17.4917 7.71331V4.35439C15.5695 3.50367 13.6571 0.990588 13.0261 -0.0165932Z"
                        fill="#1E1E1E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_161_44">
                        <rect
                          width="18"
                          height="20.25"
                          fill="white"
                          transform="translate(0.5 -0.764648)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </div>

              <div className="max-w-[180px]">
                <p className="text-[9px] text-black leading-3">
                  These statements have not been evaluated by the Food and Drug
                  Administration. This product is not intended to diagnose,
                  treat, cure, or prevent any disease.
                </p>
              </div>

              <div>
                <p className="text-[9px] text-black">
                  © 2025 All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-1200px);
            }
          }
          @media (min-width: 768px) {
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-1708px);
              }
            }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Index;
