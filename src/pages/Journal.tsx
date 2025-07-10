
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { FaCalendar, FaClock, FaTag } from "react-icons/fa";

interface Journal {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  image_url?: string;
  published: boolean;
  created_at: string;
}

const Journal = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from("journals")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (error) {
      console.error("Error fetching journals:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5]">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="text-xl">Loading journals...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-[#161616]">
            Journal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, research, and stories from the world of cognitive wellness and functional nutrition.
          </p>
        </div>

        {/* Articles Grid */}
        {journals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journals.map((journal) => (
              <Link
                key={journal.id}
                to={`/journal/${journal.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={journal.image_url || "https://images.pexels.com/photos/5946071/pexels-photo-5946071.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={journal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendar className="mr-2" />
                      {new Date(journal.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      {getReadTime(journal.content)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-[#161616] group-hover:text-[#514B3D] transition-colors">
                    {journal.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {journal.excerpt || journal.content.substring(0, 150) + "..."}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      By {journal.author || "DearNeuro Team"}
                    </span>
                    <span className="text-[#514B3D] font-medium text-sm group-hover:underline">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">No articles published yet</h2>
            <p className="text-gray-600">Check back soon for insights and stories from our team!</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-white rounded-2xl p-12 mt-16 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-[#161616]">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest insights on cognitive wellness, nutrition science, and product updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#514B3D]"
            />
            <button className="px-6 py-3 bg-[#514B3D] text-white rounded-lg hover:bg-[#3f3a2f] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
