import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ShopAll = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-50">
        {/* Subscription Banner */}
        <div className="fixed top-0 right-0 z-50 p-4">
          <div className="bg-[#514B3D] rounded-2xl px-4 py-4 shadow-lg">
            <div className="flex items-center gap-3 text-white">
              <div className="text-center">
                <span className="text-xs font-normal tracking-tight uppercase">
                  Join the NOON CLUB · SAVE 15%
                </span>
              </div>
              <div className="w-3 h-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/51f9ff1ba94976d6bae764c50356071e5febf861"
                  alt="Snowflake"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between px-8 py-6 max-w-[1905px] mx-auto gap-[169px]">
          {/* Logo */}
          <div className="flex items-center w-[500px]">
            <Link to="/" className="w-[90px] h-6">
              <svg
                width="91"
                height="25"
                viewBox="0 0 91 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_127_67)">
                  <path
                    d="M12.7493 10.1022H13.1565L12.1056 6.26145V1.81775H21.2627V22.8277H12.4274L9.0121 14.5432H8.60751L9.68728 18.3853V22.8277H0.5V1.81775H9.33655L12.7493 10.1022Z"
                    fill="#161616"
                  />
                  <path
                    d="M45.207 12.3223C45.207 18.6857 41.4147 23.3673 33.8037 23.3673C26.1927 23.3673 22.4004 18.6857 22.4004 12.3223C22.4004 5.95886 26.1914 1.27722 33.8037 1.27722C41.416 1.27722 45.207 5.96021 45.207 12.3223ZM33.8037 9.44136C33.3663 9.44136 33.1916 9.682 33.1916 10.0416V14.6381C33.1916 14.9977 33.3663 15.2383 33.8037 15.2383C34.27 15.2383 34.4158 14.9977 34.4158 14.6381V10.0416C34.4158 9.682 34.27 9.44136 33.8037 9.44136Z"
                    fill="#161616"
                  />
                  <path
                    d="M65.2605 4.01871C69.6322 8.51784 70.1694 14.5879 64.7863 20.1266C59.4032 25.6654 53.5065 25.1152 49.1348 20.616C44.7632 16.1169 44.2259 10.0469 49.609 4.50675C54.9922 -1.03335 60.8849 -0.475014 65.2605 4.01871ZM55.2142 10.2848C54.9041 10.6038 54.9514 10.9012 55.1931 11.1554L58.3458 14.4C58.5927 14.6541 58.8817 14.6974 59.1917 14.3783C59.5214 14.039 59.4544 13.7632 59.2114 13.5077L56.0588 10.2632C55.8118 10.009 55.5399 9.94545 55.2142 10.2848Z"
                    fill="#161616"
                  />
                  <path
                    d="M81.9837 10.1022H82.3922L81.3413 6.26145V1.81775H90.4997V22.8277H81.6631L78.2478 14.5432H77.8393L78.923 18.3853V22.8277H69.7344V1.81775H78.5709L81.9837 10.1022Z"
                    fill="#161616"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_127_67">
                    <rect
                      width="90"
                      height="24"
                      fill="white"
                      transform="translate(0.5 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Link>

            {/* Navigation */}
            <div className="bg-[rgba(237,236,235,0.85)] rounded-xl px-4 py-2 flex flex-row flex-wrap text-center mx-auto">
              <div className="flex items-center gap-4">
                <Link
                  to="/shop-all"
                  className="text-xs text-[#1E1E1E] underline hover:no-underline transition-all"
                >
                  Shop All
                </Link>
                <Link
                  to="/the-science"
                  className="text-xs text-[#1E1E1E] underline hover:no-underline transition-all"
                >
                  The Science
                </Link>
                <Link
                  to="/ethos"
                  className="text-xs text-[#1E1E1E] underline hover:no-underline transition-all"
                >
                  Our Ethos
                </Link>
                <Link
                  to="/herbal-index"
                  className="text-xs text-[#1E1E1E] underline hover:no-underline transition-all"
                >
                  Herbal Index
                </Link>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="w-[137px] bg-[rgba(237,236,235,0.60)] rounded-xl px-3 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/188f87c04d559086b018316cd8f419654422bb5a"
                  alt="Account"
                  className="w-3 h-4"
                />
                <span className="text-xs text-black">Account</span>
              </div>
              <span className="text-xs text-black">(0)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-7 py-[110px] bg-white">
        <div className="max-w-full mx-auto">
          {/* Product Grid - Matching Figma Layout */}
          <div className="space-y-4">
            {/* First Row - 4 Products Grid */}
            <div className="grid grid-cols-4 gap-4 h-[782px]">
              {/* FOCUS Product */}
              <div className="bg-[#F5F5F5] rounded-[24px] overflow-hidden relative flex flex-col">
                <div className="flex-1 flex items-center justify-center p-6">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2Fe61d0a85b1064b0991d96b698c24ae3d"
                    alt="FOCUS - Daily Cognitive Support Capsules"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-sm font-medium text-[#161616] mb-1">
                    Focus Mushroom Gummy Delights
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(8)</span>
                  </div>
                  <div className="text-sm font-medium text-[#161616]">$52</div>
                </div>
              </div>

              {/* FLUSH Product */}
              <div className="bg-[#F5F5F5] rounded-[24px] overflow-hidden relative flex flex-col">
                <div className="flex-1 flex items-center justify-center p-6">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2Fe4a7d6da6ecd4578a20efc399984fe53"
                    alt="FLUSH - Daily Gut Health Support Capsules"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-sm font-medium text-[#161616] mb-1">
                    Flush Mushroom Gummy Delights
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(4)</span>
                  </div>
                  <div className="text-sm font-medium text-[#161616]">$52</div>
                </div>
              </div>

              {/* CALM Product */}
              <div className="bg-[#F5F5F5] rounded-[24px] overflow-hidden relative flex flex-col">
                <div className="flex-1 flex items-center justify-center p-6">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2Fc5e3e9341b774f6e880638f8920c75dd"
                    alt="CALM - Daily Mood Support Capsules"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-sm font-medium text-[#161616] mb-1">
                    Calm Mushroom Gummy Delights
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(3)</span>
                  </div>
                  <div className="text-sm font-medium text-[#161616]">$52</div>
                </div>
              </div>

              {/* SLEEP Product */}
              <div className="bg-[#F5F5F5] rounded-[24px] overflow-hidden relative flex flex-col">
                <div className="flex-1 flex items-center justify-center p-6">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2F27bb006dba66428da19d49f300c856bf"
                    alt="SLEEP - Daily Rest Support Capsules"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-sm font-medium text-[#161616] mb-1">
                    Sleep Mushroom Gummy Delights
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(9)</span>
                  </div>
                  <div className="text-sm font-medium text-[#161616]">$52</div>
                </div>
              </div>
            </div>

            {/* Second Row - 2 Column Layout */}
            <div className="grid grid-cols-2 gap-4 h-[889px]">
              <div className="rounded-[24px] overflow-hidden relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2Fedbf7eae95b04ed8979240b3095670a2"
                  alt="Clear supplements"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[24px] overflow-hidden relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2F35be7d1ab9db43f988096ebe14342643"
                  alt="White gel supplements"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Third Row - 2 Column Layout with different heights */}
            <div className="grid grid-cols-2 gap-4 h-[807px]">
              <div className="rounded-[24px] overflow-hidden relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2Fffeb5804f7194b42aa08533263b01ce4"
                  alt="NOON couple lifestyle"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[24px] overflow-hidden relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2F99a98a2523c1490ab57e1b995ef5ed63"
                  alt="Chocolate lollipop detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Fourth Row - 2 Column Layout */}
            <div className="grid grid-cols-2 gap-4 h-[882px]">
              <div className="rounded-[24px] overflow-hidden relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2F6d8b82897a344e628efe4604f58c9a16"
                  alt="Artisanal chocolate grid"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[24px] overflow-hidden relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2Fbc4797cef429416e9499f81d1f3048d8"
                  alt="Matcha powder and capsules"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Fifth Row - Full Width */}
            <div className="h-[888px] rounded-[24px] overflow-hidden relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F51479f966515486a9935c0b0ada1db3f%2F35be7d1ab9db43f988096ebe14342643"
                alt="Final product showcase"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white pt-[26px] pb-8 px-[76px]">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-16">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <div className="mb-6 relative">
                <div className="w-[330px] h-[277px] relative">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/3d43223fd607c0f870e1388e1e92759ccce86cbc"
                    alt="NOON Logo Mark"
                    className="w-[330px] h-[359px] absolute top-0 left-0"
                  />
                </div>
                <div className="mt-[277px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/01be464a5b2cfcd30d76742d63777178622703e0"
                    alt="NOON Logo Text"
                    className="w-[659px] h-[166px]"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-20">
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
                <div className="pt-10">
                  <a
                    href="#"
                    className="block text-[9px] text-black hover:underline"
                  >
                    Privacy & Cookies Policy
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-xs text-black hover:underline"
                >
                  FAQs
                </a>
                <a
                  href="#"
                  className="block text-xs text-black hover:underline"
                >
                  Shipping & Returns
                </a>
                <a
                  href="#"
                  className="block text-xs text-black hover:underline"
                >
                  Terms & Conditions
                </a>
                <a
                  href="#"
                  className="block text-xs text-black hover:underline"
                >
                  Contact Us
                </a>
                <div className="pt-10">
                  <a
                    href="#"
                    className="block text-[9px] text-black hover:underline"
                  >
                    Accessibility Statement
                  </a>
                </div>
              </div>
            </div>

            {/* Social & Legal */}
            <div className="lg:col-span-1 space-y-8">
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
    </div>
  );
};

export default ShopAll;
