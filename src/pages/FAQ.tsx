import { useState } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What are adaptogenic mushrooms?",
    answer: "Adaptogenic mushrooms are functional fungi that help your body adapt to stress and maintain balance. They contain bioactive compounds that support cognitive function, immune health, and overall wellness. Our products feature Lion's Mane for brain health, Reishi for stress relief, and Cordyceps for energy.",
    category: "Products"
  },
  {
    id: 2,
    question: "How long does it take to see results?",
    answer: "Results can vary by individual and product. Many customers report feeling initial effects within 30-60 minutes for our gummies, with cumulative benefits building over 2-4 weeks of consistent use. For best results, we recommend taking our products daily as part of your wellness routine.",
    category: "Products"
  },
  {
    id: 3,
    question: "Are your products safe to take daily?",
    answer: "Yes, our products are designed for daily use and are made with natural, high-quality ingredients. All our formulations are third-party tested for purity and potency. However, we recommend consulting with your healthcare provider before starting any new supplement regimen, especially if you have existing health conditions or take medications.",
    category: "Safety"
  },
  {
    id: 4,
    question: "What is your shipping policy?",
    answer: "We offer free shipping on orders over $50 within the United States. Standard shipping typically takes 3-5 business days, while expedited shipping (2-3 business days) is available for an additional fee. International shipping is available to select countries.",
    category: "Shipping"
  },
  {
    id: 5,
    question: "Can I return products if I'm not satisfied?",
    answer: "Absolutely! We offer a 30-day money-back guarantee on all products. If you're not completely satisfied, you can return unopened products within 30 days of purchase for a full refund. Even opened products can be returned if you're not happy with the results.",
    category: "Returns"
  },
  {
    id: 6,
    question: "Do you offer subscriptions?",
    answer: "Yes! Our subscription service allows you to save 15% on every order and ensures you never run out of your favorite products. You can easily modify, pause, or cancel your subscription at any time through your account dashboard.",
    category: "Subscriptions"
  },
  {
    id: 7,
    question: "Are your products vegan and gluten-free?",
    answer: "Yes, all our products are 100% vegan and gluten-free. We use plant-based ingredients and natural fruit flavors. Our gummies are made with pectin instead of gelatin, making them suitable for all dietary preferences.",
    category: "Products"
  },
  {
    id: 8,
    question: "How should I store my products?",
    answer: "Store your products in a cool, dry place away from direct sunlight. Our gummies should be kept in their original container with the lid tightly closed. Avoid storing in humid areas like bathrooms. Proper storage helps maintain potency and freshness.",
    category: "Products"
  },
  {
    id: 9,
    question: "Can I take multiple products together?",
    answer: "Yes, our products are designed to work synergistically together. Many customers combine our Focus and Chill gummies for balanced cognitive support throughout the day. However, start with one product to assess your individual response before combining.",
    category: "Safety"
  },
  {
    id: 10,
    question: "Do you ship internationally?",
    answer: "We currently ship to the United States, Canada, and select European countries. International shipping rates and delivery times vary by destination. Please note that international orders may be subject to customs duties and taxes.",
    category: "Shipping"
  }
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Products", "Safety", "Shipping", "Returns", "Subscriptions"];

  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold mb-8 text-[#161616]">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our products, shipping, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? "bg-[#514B3D] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-[#161616] pr-4">
                  {item.question}
                </h3>
                {openItems.includes(item.id) ? (
                  <FaChevronUp className="text-[#514B3D] flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-[#514B3D] flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl p-12 mt-16 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-[#161616]">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Our customer support team is here to help. Reach out to us and we'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => window.location.href = "/contact"}
            className="px-8 py-3 bg-[#514B3D] text-white rounded-xl hover:bg-[#3f3a2f] transition-colors font-medium"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;