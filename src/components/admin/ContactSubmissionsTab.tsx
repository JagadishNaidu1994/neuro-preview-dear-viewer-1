
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaEye, FaReply } from "react-icons/fa";
import MessageViewDialog from "./MessageViewDialog";

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
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleViewMessage = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedContact(null);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">User Messages</CardTitle>
        <p className="text-muted-foreground">Manage customer inquiries and responses</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Subject</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactSubmissions.map((contact) => (
              <TableRow key={contact.id} className="border-border">
                <TableCell className="font-medium text-foreground">{contact.name}</TableCell>
                <TableCell className="text-foreground">{contact.email}</TableCell>
                <TableCell className="text-foreground">{contact.subject || "No Subject"}</TableCell>
                <TableCell>
                  <Badge variant={contact.status === "read" ? "default" : contact.status === "replied" ? "secondary" : "destructive"}>
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground">
                  {new Date(contact.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewMessage(contact)}
                      className="border-border"
                    >
                      <FaEye className="mr-1" />
                      View & Reply
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <MessageViewDialog
        contact={selectedContact}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onUpdate={fetchContactSubmissions}
      />
    </Card>
  );
};

export default ContactSubmissionsTab;
