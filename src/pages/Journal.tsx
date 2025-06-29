import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";

interface JournalPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
}

const samplePosts: JournalPost[] = [
  {
    id: "1",
    title: "The Science Behind Adaptogenic Mushrooms",
    excerpt: "Discover how Lion's Mane, Reishi, and Cordyceps work synergistically to support cognitive function and stress resilience.",
    image: "https://images.pexels.com/photos/5938567/pexels-photo-5938567.jpeg",
    date: "2025-01-15",
    category: "Science",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "Morning Rituals for Mental Clarity",
    excerpt: "Simple practices to incorporate into your morning routine for enhanced focus and cognitive performance throughout the day.",
    image: "https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg",
    date: "2025-01-12",
    category: "Wellness",
    readTime: "3 min read"
  },
  {
    id: "3",
    title: "Understanding Nootropics: A Beginner's Guide",
    excerpt: "Everything you need to know about cognitive enhancers and how they can support your mental performance naturally.",
    image: "https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg",
    date: "2025-01-10",
    category: "Education",
    readTime: "7 min read"
  },
  {
    id: "4",
    title: "The Role of Sleep in Cognitive Health",
    excerpt: "How quality sleep impacts memory consolidation, focus, and overall brain health, plus tips for better rest.",
    image: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg",
    date: "2025-01-08",
    category: "Sleep",
    readTime: "4 min read"
  },
  {
    id: "5",
    title: "Stress Management Through Plant Medicine",
    excerpt: "Exploring how traditional herbs and modern science combine to create effective stress-relief solutions.",
    image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg",
    date: "2025-01-05",
    category: "Stress Relief",
    readTime: "6 min read"
  },
  {
    id: "6",
    title: "Nutrition for Brain Health",
    excerpt: "Essential nutrients and foods that support cognitive function and long-term brain health.",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    date: "2025-01-03",
    category: "Nutrition",
    readTime: "5 min read"
  }
];

const Journal = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const categories = ["All", "Science", "Wellness", "Education", "Sleep", "Stress Relief", "Nutrition"];
  
  const filteredPosts = selectedCategory === "All" 
    ? samplePosts 
    : samplePosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold mb-8 text-[#161616]">
            DearNeuro Journal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Daily insights on cognitive wellness, nutrition science, and the latest research 
            in plant-based mental health solutions.
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

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/journal/${post.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#514B3D] bg-[#514B3D]/10 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#161616] group-hover:text-[#514B3D] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-2xl p-12 mt-16 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-[#161616]">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Get the latest insights on cognitive wellness and nutrition science delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#514B3D]"
            />
            <button className="px-8 py-3 bg-[#514B3D] text-white rounded-xl hover:bg-[#3f3a2f] transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;