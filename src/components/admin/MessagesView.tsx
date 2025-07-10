
import React, { useState, useEffect } from "react";
import { Search, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
}

const MessagesView = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
      if (data && data.length > 0 && !selectedContact) {
        setSelectedContact(data[0]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-color-2 text-color-8';
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedContact) return;
    
    try {
      // Update contact status to replied
      await supabase
        .from("contact_submissions")
        .update({ status: "replied" })
        .eq("id", selectedContact.id);

      setReplyMessage("");
      fetchContacts();
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <div className="bg-white h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-color-2 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-color-2">
          <h2 className="text-lg font-semibold text-color-12 mb-3">Message</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-color-4" />
            <Input
              placeholder="Search in dashboard"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-color-1 border-color-3"
            />
          </div>
        </div>

        {/* Filter Options */}
        <div className="p-4 border-b border-color-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-color-8">All Inbox</span>
            <Search className="h-4 w-4 text-color-4" />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 border-b border-color-2 cursor-pointer hover:bg-color-1 ${
                selectedContact?.id === contact.id ? 'bg-color-1' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-color-3 rounded-full flex items-center justify-center text-white font-medium">
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-color-12 truncate">{contact.name}</p>
                    {contact.status === 'unread' && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-color-5 truncate mt-1">{contact.subject || "No subject"}</p>
                  <p className="text-xs text-color-5 truncate mt-1">{contact.message}</p>
                  <p className="text-xs text-color-4 mt-1">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-color-2 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-color-3 rounded-full flex items-center justify-center text-white font-medium">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-color-12">{selectedContact.name}</h3>
                  <p className="text-sm text-color-5">{selectedContact.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* Customer Message */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-color-3 rounded-full flex items-center justify-center text-white text-sm">
                  {selectedContact.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="bg-color-1 rounded-lg p-3 max-w-md">
                    <p className="text-sm text-color-12">{selectedContact.message}</p>
                  </div>
                  <p className="text-xs text-color-4 mt-1">
                    {new Date(selectedContact.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>

              {/* Admin Reply (if status is replied) */}
              {selectedContact.status === 'replied' && (
                <div className="flex space-x-3 justify-end">
                  <div className="flex-1 flex justify-end">
                    <div className="bg-color-6 rounded-lg p-3 max-w-md">
                      <p className="text-sm text-white">
                        Thank you for your message. We've received your inquiry and will get back to you soon.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-color-6 rounded-full flex items-center justify-center text-white text-sm">
                    A
                  </div>
                </div>
              )}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-color-2">
              <div className="flex items-center space-x-3">
                <Input
                  placeholder="Type a message..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                />
                <Button onClick={handleSendReply} className="bg-color-6 hover:bg-color-7">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-color-5">Select a message to view conversation</p>
          </div>
        )}
      </div>

      {/* Order Status Sidebar */}
      <div className="w-64 bg-color-1 border-l border-color-2 p-4">
        <h3 className="font-medium text-color-12 mb-4">Order Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-color-5">#256894</span>
            <span className="text-color-12">Delivered</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-color-5">#256893</span>
            <span className="text-color-12">Blocked</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-color-5">#256892</span>
            <span className="text-color-12">Delivered</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-color-5">#256891</span>
            <span className="text-color-12">Refund</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-color-5">#256258</span>
            <span className="text-color-12">Completed</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-color-5">#256644</span>
            <span className="text-color-12">Refund</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
