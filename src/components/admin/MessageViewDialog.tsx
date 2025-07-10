
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
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

interface MessageViewDialogProps {
  contact: ContactSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const MessageViewDialog = ({ contact, isOpen, onClose, onUpdate }: MessageViewDialogProps) => {
  const { toast } = useToast();
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!contact || !replyMessage.trim()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-contact-reply', {
        body: {
          to: contact.email,
          subject: contact.subject || "Your Inquiry",
          replyMessage: replyMessage,
          originalMessage: contact.message,
          userName: contact.name,
        },
      });

      if (error) throw error;

      // Mark as replied
      await supabase
        .from("contact_submissions")
        .update({ status: 'replied' })
        .eq("id", contact.id);

      toast({
        title: "Reply Sent!",
        description: "Your reply has been sent to the customer.",
      });

      setReplyMessage("");
      onUpdate();
      onClose();
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

  const markAsRead = async () => {
    if (!contact) return;
    
    try {
      await supabase
        .from("contact_submissions")
        .update({ status: 'read' })
        .eq("id", contact.id);
      
      onUpdate();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Contact Message from {contact?.name}</span>
            <Badge variant={contact?.status === "read" ? "default" : contact?.status === "replied" ? "secondary" : "destructive"}>
              {contact?.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {contact && (
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="font-semibold">Name:</Label>
                <p>{contact.name}</p>
              </div>
              <div>
                <Label className="font-semibold">Email:</Label>
                <p>{contact.email}</p>
              </div>
              <div>
                <Label className="font-semibold">Subject:</Label>
                <p>{contact.subject || "No Subject"}</p>
              </div>
              <div>
                <Label className="font-semibold">Date:</Label>
                <p>{new Date(contact.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Original Message */}
            <div className="space-y-2">
              <Label className="font-semibold text-lg">Original Message:</Label>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>

            {/* Reply Section */}
            <div className="space-y-4">
              <Label className="font-semibold text-lg">Send Reply:</Label>
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={8}
                placeholder="Type your reply here..."
                className="min-h-[200px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={markAsRead}
                  disabled={contact.status === 'read' || contact.status === 'replied'}
                >
                  Mark as Read
                </Button>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  onClick={handleReply}
                  disabled={loading || !replyMessage.trim()}
                >
                  {loading ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MessageViewDialog;
