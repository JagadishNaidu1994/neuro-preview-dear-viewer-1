import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
const MessagesSection = () => {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const fetchContactSubmissions = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("contact_submissions").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setContactSubmissions(data || []);
      if (data && data.length > 0 && !selectedContact) {
        setSelectedContact(data[0]);
      }
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
    }
  };
  useEffect(() => {
    fetchContactSubmissions();
  }, []);
  const filteredMessages = contactSubmissions.filter(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.email.toLowerCase().includes(searchTerm.toLowerCase()) || contact.message.toLowerCase().includes(searchTerm.toLowerCase()));
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

    // Here you would typically send the reply via your backend
    console.log('Sending reply:', replyMessage);
    setReplyMessage("");
  };
  return <div className="h-[800px] bg-white rounded-lg border overflow-hidden flex">
      {/* Left Sidebar - Message List */}
      <div className="w-80 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Message</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">All Inbox</span>
              <Button variant="ghost" size="sm" className="text-blue-600">
                All Inbox
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search for messages" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* Message List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-600 mb-2 px-2">All Inbox</div>
            {filteredMessages.map(contact => <div key={contact.id} onClick={() => setSelectedContact(contact)} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}>
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
              </div>)}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side - Message Detail */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? <>
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
              
              <div className="flex items-center gap-4">
                {/* Order Status Tabs */}
                
                
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Customer Message */}
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                      {getInitials(selectedContact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{selectedContact.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(selectedContact.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg max-w-md">
                      <p className="text-sm">{selectedContact.message}</p>
                    </div>
                  </div>
                </div>

                {/* Sample Admin Response */}
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 flex justify-end">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <span className="text-xs text-gray-500">2:30 PM</span>
                        <span className="font-medium text-sm">You</span>
                      </div>
                      <div className="bg-blue-600 text-white p-3 rounded-lg">
                        <p className="text-sm">How are you! How Can I help you!</p>
                      </div>
                    </div>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                      A
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                      {getInitials(selectedContact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{selectedContact.name}</span>
                      <span className="text-xs text-gray-500">2:35 PM</span>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg max-w-md">
                      <p className="text-sm">I need a Product, I place order.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="flex-1 flex justify-end">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <span className="text-xs text-gray-500">2:45 PM</span>
                        <span className="font-medium text-sm">You</span>
                      </div>
                      <div className="bg-blue-600 text-white p-3 rounded-lg">
                        <p className="text-sm">Great! We will delivery within an hour</p>
                      </div>
                    </div>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                      A
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input placeholder="Type your message here..." value={replyMessage} onChange={e => setReplyMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendReply()} className="flex-1" />
                <Button onClick={handleSendReply} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </> : <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a message to view conversation
          </div>}
      </div>
    </div>;
};
export default MessagesSection;