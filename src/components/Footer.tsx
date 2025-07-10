
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-color-8 text-color-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-color-1">DearNeuro</span>
            </div>
            <p className="text-color-3">
              Premium brain nutrition supplements designed to enhance your cognitive performance and mental clarity.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-color-3 hover:text-color-1 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-color-3 hover:text-color-1 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-color-3 hover:text-color-1 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-color-3 hover:text-color-1 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-color-1">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop-all" className="text-color-3 hover:text-color-1 transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/herbal-index" className="text-color-3 hover:text-color-1 transition-colors">
                  Herbal Index
                </Link>
              </li>
              <li>
                <Link to="/the-science" className="text-color-3 hover:text-color-1 transition-colors">
                  The Science
                </Link>
              </li>
              <li>
                <Link to="/ethos" className="text-color-3 hover:text-color-1 transition-colors">
                  Ethos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-color-1">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-color-3 hover:text-color-1 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-color-3 hover:text-color-1 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="text-color-3 hover:text-color-1 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-color-1">Stay Updated</h3>
            <p className="text-color-3 mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-color-7 border border-color-6 text-color-1 placeholder-color-3 rounded-l focus:outline-none focus:ring-2 focus:ring-color-5"
              />
              <button className="bg-color-6 text-color-1 px-4 py-2 rounded-r hover:bg-color-5 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-color-6 mt-8 pt-8 text-center">
          <p className="text-color-3">
            © 2024 DearNeuro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
