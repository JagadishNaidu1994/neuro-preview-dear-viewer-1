import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-[#514B3D] text-white">
      {/* Newsletter Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-[#161616]">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest insights on cognitive wellness, nutrition science, and product updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#514B3D]" />
            <button className="px-6 py-3 bg-[#514B3D] text-white rounded-lg hover:bg-[#3f3a2f] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">DearNeuro</h3>
              <p className="text-gray-300 mb-4">
                Premium neurological supplements crafted with care and backed by science.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/shop-all" className="text-gray-300 hover:text-white transition-colors">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link to="/the-science" className="text-gray-300 hover:text-white transition-colors">
                    The Science
                  </Link>
                </li>
                <li>
                  <Link to="/ethos" className="text-gray-300 hover:text-white transition-colors">
                    Ethos
                  </Link>
                </li>
                <li>
                  <Link to="/journal" className="text-gray-300 hover:text-white transition-colors">
                    Journal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-gray-300 hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Account</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/account" className="text-gray-300 hover:text-white transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/rewards" className="text-gray-300 hover:text-white transition-colors">
                    Rewards
                  </Link>
                </li>
                <li>
                  <Link to="/refer" className="text-gray-300 hover:text-white transition-colors">
                    Refer a Friend
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-600 mt-12 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 DearNeuro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;