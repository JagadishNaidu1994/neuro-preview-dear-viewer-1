
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="bg-card py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-foreground">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get the latest insights on cognitive wellness, nutrition science, and product updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-primary py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-primary-foreground">DearNeuro</h3>
              <p className="text-primary-foreground/80 mb-4">
                Premium neurological supplements crafted with care and backed by science.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-primary-foreground">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/shop-all" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link to="/the-science" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    The Science
                  </Link>
                </li>
                <li>
                  <Link to="/ethos" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Ethos
                  </Link>
                </li>
                <li>
                  <Link to="/journal" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Journal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-primary-foreground">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-primary-foreground">Account</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/account" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/rewards" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Rewards
                  </Link>
                </li>
                <li>
                  <Link to="/refer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Refer a Friend
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
            <p className="text-primary-foreground/80">
              © 2024 DearNeuro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
