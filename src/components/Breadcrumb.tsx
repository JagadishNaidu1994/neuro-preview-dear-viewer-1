import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";
const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(x => x);
  const breadcrumbNameMap: {
    [key: string]: string;
  } = {
    "shop-all": "Shop All",
    "the-science": "The Science",
    "ethos": "Our Ethos",
    "herbal-index": "Herbal Index",
    "product": "Product",
    "cart": "Cart",
    "checkout": "Checkout",
    "order-success": "Order Success",
    "account": "Account",
    "profile": "Profile Settings",
    "subscriptions": "Subscriptions",
    "orders": "Order History",
    "preferences": "Preferences",
    "security": "Security",
    "addresses": "Address Book",
    "payments": "Payment Methods",
    "admin": "Admin Dashboard",
    "journal": "Journal",
    "refer": "Refer a Friend",
    "contact": "Contact Us",
    "faqs": "FAQs",
    "shipping": "Shipping & Returns",
    "rewards": "Rewards"
  };
  if (pathnames.length === 0) return null;
  return <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 px-[21px] my-0 py-[9px]">
      <Link to="/" className="hover:text-[#514B3D] flex items-center">
        <FaHome className="mr-1" />
        Home
      </Link>
      {pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      const isLast = index === pathnames.length - 1;
      const displayName = breadcrumbNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
      if (breadcrumbNameMap[name]) {
        return <React.Fragment key={name}>
              <FaChevronRight className="text-gray-400" />
              {isLast ? <span className="text-gray-900 font-medium">{displayName}</span> : <Link to={routeTo} className="hover:text-[#514B3D]">
                  {displayName}
                </Link>}
            </React.Fragment>;
      }
      return null;
    })}
    </nav>;
};
export default Breadcrumb;