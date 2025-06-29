import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { FaTruck, FaUndo, FaShieldAlt, FaGlobe } from "react-icons/fa";

const ShippingReturns = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold mb-8 text-[#161616]">
            Shipping & Returns
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about our shipping policies and hassle-free returns.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTruck className="text-[#514B3D]" />
            </div>
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUndo className="text-[#514B3D]" />
            </div>
            <h3 className="font-semibold mb-2">30-Day Returns</h3>
            <p className="text-sm text-gray-600">Money-back guarantee</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-[#514B3D]" />
            </div>
            <h3 className="font-semibold mb-2">Secure Packaging</h3>
            <p className="text-sm text-gray-600">Protected delivery</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-[#514B3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGlobe className="text-[#514B3D]" />
            </div>
            <h3 className="font-semibold mb-2">Global Shipping</h3>
            <p className="text-sm text-gray-600">Worldwide delivery</p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Shipping Information */}
          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-3xl font-semibold mb-8 text-[#161616]">Shipping Information</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Domestic Shipping (United States)</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Standard Shipping</p>
                      <p className="text-sm text-gray-600">3-5 business days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$5.99</p>
                      <p className="text-sm text-green-600">Free over $50</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Express Shipping</p>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$12.99</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Overnight Shipping</p>
                      <p className="text-sm text-gray-600">1 business day</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$24.99</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">International Shipping</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Canada</p>
                      <p className="text-sm text-gray-600">5-10 business days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$15.99</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Europe</p>
                      <p className="text-sm text-gray-600">7-14 business days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$25.99</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Rest of World</p>
                      <p className="text-sm text-gray-600">10-21 business days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$35.99</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold mb-2">Important Notes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Orders placed before 2 PM PST ship the same business day</li>
                  <li>• International orders may be subject to customs duties and taxes</li>
                  <li>• We provide tracking information for all shipments</li>
                  <li>• Delivery times may vary during peak seasons</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Returns & Exchanges */}
          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-3xl font-semibold mb-8 text-[#161616]">Returns & Exchanges</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">30-Day Money-Back Guarantee</h3>
                <p className="text-gray-600 mb-4">
                  We stand behind the quality of our products. If you're not completely satisfied with your purchase, 
                  you can return it within 30 days for a full refund.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-green-50 rounded-xl">
                    <h4 className="font-semibold mb-3 text-green-800">Eligible for Return:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Unopened products in original packaging</li>
                      <li>• Opened products if not satisfied with results</li>
                      <li>• Damaged or defective items</li>
                      <li>• Wrong items shipped</li>
                    </ul>
                  </div>
                  
                  <div className="p-6 bg-red-50 rounded-xl">
                    <h4 className="font-semibold mb-3 text-red-800">Not Eligible for Return:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Products returned after 30 days</li>
                      <li>• Items damaged by misuse</li>
                      <li>• Products without original packaging</li>
                      <li>• Gift cards and digital products</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">How to Return</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#514B3D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Contact Us</h4>
                      <p className="text-gray-600">Email support@dearneuro.com or call (555) 123-4567 to initiate your return.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#514B3D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Get Return Label</h4>
                      <p className="text-gray-600">We'll provide you with a prepaid return shipping label and instructions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#514B3D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Ship Your Return</h4>
                      <p className="text-gray-600">Package your items securely and ship using the provided label.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#514B3D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Get Your Refund</h4>
                      <p className="text-gray-600">Once we receive your return, we'll process your refund within 3-5 business days.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl">
                <h4 className="font-semibold mb-2">Refund Information:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Refunds are processed to the original payment method</li>
                  <li>• Shipping costs are non-refundable (except for our error)</li>
                  <li>• International customers are responsible for return shipping costs</li>
                  <li>• Refunds may take 5-10 business days to appear on your statement</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
            <h2 className="text-3xl font-semibold mb-6 text-[#161616]">
              Need Help?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Our customer support team is here to assist you with any shipping or return questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/contact"}
                className="px-8 py-3 bg-[#514B3D] text-white rounded-xl hover:bg-[#3f3a2f] transition-colors font-medium"
              >
                Contact Support
              </button>
              <button
                onClick={() => window.location.href = "/faqs"}
                className="px-8 py-3 border border-[#514B3D] text-[#514B3D] rounded-xl hover:bg-[#514B3D] hover:text-white transition-colors font-medium"
              >
                View FAQs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;