import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-brand-blue-700 text-brand-white">
      {/* Newsletter Section */}
      

      {/* Main Footer */}
      <div className="py-16 bg-brand-blue-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-brand-white">DearNeuro</h3>
              <p className="text-brand-gray-200 mb-4">
                Premium neurological supplements crafted with care and backed by science.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-brand-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/shop-all" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link to="/the-science" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    The Science
                  </Link>
                </li>
                <li>
                  <Link to="/ethos" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    Ethos
                  </Link>
                </li>
                <li>
                  <Link to="/journal" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    Journal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-brand-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-brand-white">Account</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/account" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/rewards" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    Rewards
                  </Link>
                </li>
                <li>
                  <Link to="/refer" className="text-brand-gray-200 hover:text-brand-white transition-colors">
                    Refer a Friend
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-brand-blue-500 mt-12 pt-8 text-center">
            <p className="text-brand-gray-200">
              © 2024 DearNeuro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;