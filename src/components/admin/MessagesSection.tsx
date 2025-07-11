
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Send, MoreHorizontal } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
}

interface MessageReply {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

const MessagesSection = () => {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [messages, setMessages] = useState<MessageReply[]>([]);

  useEffect(() => {
    fetchContactSubmissions();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      loadMessages(selectedContact.id);
    }
  }, [selectedContact]);

  const fetchContactSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContactSubmissions(data || []);
      
      if (data && data.length > 0 && !selectedContact) {
        setSelectedContact(data[0]);
      }
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
    }
  };

  const loadMessages = (contactId: string) => {
    // For now, we'll simulate messages based on the contact submission
    const contact = contactSubmissions.find(c => c.id === contactId);
    if (!contact) return;

    const simulatedMessages: MessageReply[] = [
      {
        id: '1',
        content: contact.message,
        sender: 'user',
        timestamp: contact.created_at,
      },
      {
        id: '2',
        content: "Thank you for contacting us! How can I help you?",
        sender: 'admin',
        timestamp: new Date(new Date(contact.created_at).getTime() + 5 * 60000).toISOString(),
      }
    ];

    setMessages(simulatedMessages);
  };

  const filteredMessages = contactSubmissions.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-orange-100 text-orange-800 text-xs">New</Badge>;
      case 'read':
        return null;
      case 'replied':
        return <Badge className="bg-green-100 text-green-800 text-xs">Replied</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 48) return '1d';
    return date.toLocaleDateString();
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedContact) return;

    // Add the reply to the messages
    const newMessage: MessageReply = {
      id: Date.now().toString(),
      content: replyMessage,
      sender: 'admin',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setReplyMessage("");

    // Update the contact status to replied
    try {
      await supabase
        .from("contact_submissions")
        .update({ status: 'replied' })
        .eq("id", selectedContact.id);

      // Refresh the contact submissions to show updated status
      fetchContactSubmissions();
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const handleContactSelect = async (contact: ContactSubmission) => {
    setSelectedContact(contact);
    
    // Mark as read if it's unread
    if (contact.status === 'unread') {
      try {
        await supabase
          .from("contact_submissions")
          .update({ status: 'read' })
          .eq("id", contact.id);

        // Update local state
        setContactSubmissions(prev =>
          prev.map(c => c.id === contact.id ? { ...c, status: 'read' } : c)
        );
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  return (
    <div className="h-[800px] bg-white rounded-lg border overflow-hidden flex">
      {/* Left Sidebar - Message List */}
      <div className="w-80 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <Button variant="ghost" size="sm" className="text-blue-600">
              All Inbox
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search for messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Message List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-600 mb-2 px-2">All Inbox</div>
            {filteredMessages.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">{contact.name}</span>
                    <div className="flex items-center gap-1">
                      {getStatusBadge(contact.status)}
                      <span className="text-xs text-gray-500">{formatTime(contact.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {contact.subject || contact.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side - Message Detail */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {getInitials(selectedContact.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">{selectedContact.email}</p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.sender === 'admin' ? 'justify-end' : ''}`}>
                    {message.sender === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                          {getInitials(selectedContact.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex-1 ${message.sender === 'admin' ? 'flex justify-end' : ''}`}>
                      <div className={`max-w-md ${message.sender === 'admin' ? '' : ''}`}>
                        <div className={`flex items-center gap-2 mb-1 ${message.sender === 'admin' ? 'justify-end' : ''}`}>
                          {message.sender === 'admin' && <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>}
                          <span className="font-medium text-sm">
                            {message.sender === 'admin' ? 'You' : selectedContact.name}
                          </span>
                          {message.sender === 'user' && <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'admin' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>

                    {message.sender === 'admin' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          A
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                  className="flex-1"
                />
                <Button onClick={handleSendReply} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a message to view conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesSection;
