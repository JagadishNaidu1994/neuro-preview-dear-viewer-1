
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FaEye, FaReply } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
}

const ContactSubmissionsTab = () => {
  const { toast } = useToast();
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchContactSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContactSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
    }
  };

  useEffect(() => {
    fetchContactSubmissions();
  }, []);

  const markContactAsRead = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: 'read' })
        .eq("id", contactId);

      if (error) throw error;
      await fetchContactSubmissions();
    } catch (error) {
      console.error("Error marking contact as read:", error);
    }
  };

  const handleReply = async () => {
    if (!selectedContact || !replyMessage.trim()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-contact-reply', {
        body: {
          to: selectedContact.email,
          subject: selectedContact.subject || "Your Inquiry",
          replyMessage: replyMessage,
          originalMessage: selectedContact.message,
          userName: selectedContact.name,
        },
      });

      if (error) throw error;

      // Mark as replied
      await supabase
        .from("contact_submissions")
        .update({ status: 'replied' })
        .eq("id", selectedContact.id);

      toast({
        title: "Reply Sent!",
        description: "Your reply has been sent to the customer.",
      });

      setIsReplyModalOpen(false);
      setReplyMessage("");
      setSelectedContact(null);
      await fetchContactSubmissions();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">User Contact Responses</h2>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactSubmissions.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.subject || "No Subject"}</TableCell>
                <TableCell>
                  <Badge variant={contact.status === "read" ? "default" : contact.status === "replied" ? "secondary" : "destructive"}>
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(contact.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        alert(`Message: ${contact.message}`);
                        markContactAsRead(contact.id);
                      }}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedContact(contact);
                        setIsReplyModalOpen(true);
                        markContactAsRead(contact.id);
                      }}
                    >
                      <FaReply />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedContact?.name}</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Original Message:</h4>
                <p className="text-sm text-gray-600">{selectedContact.message}</p>
              </div>
              <div>
                <Label htmlFor="reply">Your Reply</Label>
                <Textarea
                  id="reply"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={8}
                  placeholder="Type your reply here..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReplyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReply}
                  disabled={loading || !replyMessage.trim()}
                >
                  {loading ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactSubmissionsTab;
