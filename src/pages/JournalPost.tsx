import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { FaArrowLeft, FaCalendar, FaClock, FaTag } from "react-icons/fa";

const JournalPost = () => {
  const { id } = useParams();

  // Sample post data - in a real app, this would be fetched based on the ID
  const post = {
    id: id,
    title: "The Science Behind Adaptogenic Mushrooms",
    content: `
      <p>Adaptogenic mushrooms have been used for centuries in traditional medicine, but modern science is now validating their remarkable benefits for cognitive health and stress resilience. In this comprehensive guide, we'll explore the fascinating world of functional fungi and how they can support your mental well-being.</p>

      <h2>What Are Adaptogenic Mushrooms?</h2>
      <p>Adaptogens are natural substances that help the body adapt to stress and maintain homeostasis. Mushrooms like Lion's Mane, Reishi, and Cordyceps contain unique bioactive compounds that support various aspects of health, particularly cognitive function and stress response.</p>

      <h2>Lion's Mane: The Brain Booster</h2>
      <p>Lion's Mane (Hericium erinaceus) is perhaps the most well-known cognitive-supporting mushroom. It contains compounds called hericenones and erinacines, which can cross the blood-brain barrier and stimulate the production of nerve growth factor (NGF).</p>

      <p>Research has shown that Lion's Mane may:</p>
      <ul>
        <li>Support memory and cognitive function</li>
        <li>Promote nerve regeneration</li>
        <li>Reduce symptoms of anxiety and depression</li>
        <li>Support overall brain health</li>
      </ul>

      <h2>Reishi: The Stress Reliever</h2>
      <p>Known as the "mushroom of immortality," Reishi (Ganoderma lucidum) has been prized for its calming and stress-reducing properties. It contains triterpenes and beta-glucans that help modulate the stress response and support immune function.</p>

      <h2>Cordyceps: The Energy Enhancer</h2>
      <p>Cordyceps mushrooms are renowned for their ability to boost energy and endurance. They work by improving cellular energy production and oxygen utilization, making them excellent for both physical and mental performance.</p>

      <h2>The Synergistic Effect</h2>
      <p>When combined, these mushrooms work synergistically to provide comprehensive cognitive support. This is why our formulations at DearNeuro combine multiple mushroom extracts to maximize their benefits.</p>

      <h2>Quality Matters</h2>
      <p>Not all mushroom supplements are created equal. At DearNeuro, we use dual-extraction methods to ensure we capture both water-soluble and alcohol-soluble compounds, providing you with the full spectrum of benefits these remarkable fungi have to offer.</p>
    `,
    image: "https://images.pexels.com/photos/5938567/pexels-photo-5938567.jpeg",
    date: "2025-01-15",
    category: "Science",
    readTime: "5 min read",
    author: "Dr. Sarah Chen, PhD in Mycology"
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        {/* Back to Journal */}
        <Link 
          to="/journal"
          className="inline-flex items-center text-[#514B3D] hover:underline mb-8 font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to Journal
        </Link>

        {/* Article Header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-12">
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <FaTag className="mr-2" />
                <span className="bg-[#514B3D]/10 text-[#514B3D] px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
              </div>
              <div className="flex items-center">
                <FaCalendar className="mr-2" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2" />
                {post.readTime}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[#161616] leading-tight">
              {post.title}
            </h1>
            
            <p className="text-gray-600 text-lg">
              By {post.author}
            </p>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-2xl p-12 shadow-sm">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              lineHeight: '1.8',
              fontSize: '18px'
            }}
          />
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold mb-8 text-[#161616]">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/journal/2" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#161616]">
                Morning Rituals for Mental Clarity
              </h3>
              <p className="text-gray-600">
                Simple practices to incorporate into your morning routine for enhanced focus...
              </p>
            </Link>
            <Link to="/journal/3" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#161616]">
                Understanding Nootropics: A Beginner's Guide
              </h3>
              <p className="text-gray-600">
                Everything you need to know about cognitive enhancers and how they work...
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPost;