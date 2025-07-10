import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await (supabase as any)
        .from("contact_submissions")
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb />
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-[#161616]">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our products, need support, or want to share feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-[#161616]">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="mt-1"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#514B3D] hover:bg-[#3f3a2f] text-white"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-[#161616]">Get in Touch</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-[#161616]">Email</h4>
                  <p className="text-gray-600">hello@dearneuro.com</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#161616]">Customer Support</h4>
                  <p className="text-gray-600">Available Monday - Friday, 9AM - 6PM EST</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#161616]">Response Time</h4>
                  <p className="text-gray-600">We typically respond within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-[#161616]">Frequently Asked About</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-[#161616]">Product Questions</h4>
                  <p className="text-sm text-gray-600">Ingredients, dosage, and benefits</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#161616]">Shipping & Returns</h4>
                  <p className="text-sm text-gray-600">Delivery times and return policies</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#161616]">Subscriptions</h4>
                  <p className="text-sm text-gray-600">Managing your recurring orders</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#161616]">Partnership Inquiries</h4>
                  <p className="text-sm text-gray-600">Collaboration and business opportunities</p>
                </div>
              </div>
            </div>

            <div className="bg-[#514B3D] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Need immediate help?</h3>
              <p className="mb-4">
                Check out our comprehensive FAQ section for quick answers to common questions.
              </p>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#514B3D]">
                Visit FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
