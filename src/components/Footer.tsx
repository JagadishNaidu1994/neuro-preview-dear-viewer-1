
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#514B3D] text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">DearNeuro</h3>
            <p className="text-gray-300 text-sm">
              Premium neurological supplements crafted with care and backed by science.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop-all" className="text-gray-300 hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/the-science" className="text-gray-300 hover:text-white transition-colors">The Science</Link></li>
              <li><Link to="/ethos" className="text-gray-300 hover:text-white transition-colors">Ethos</Link></li>
              <li><Link to="/journal" className="text-gray-300 hover:text-white transition-colors">Journal</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faqs" className="text-gray-300 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-gray-300 hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/rewards" className="text-gray-300 hover:text-white transition-colors">Rewards</Link></li>
              <li><Link to="/refer" className="text-gray-300 hover:text-white transition-colors">Refer a Friend</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 DearNeuro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
