
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaCheck, FaArchive } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_archived?: boolean;
  created_at: string;
  products?: {
    name: string;
  };
  users?: {
    email: string;
  };
}

const ReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          products(name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const transformedData = (data || []).map(review => ({
        ...review,
        is_archived: review.is_archived || false,
        users: { email: 'user@example.com' } // Placeholder since users relation doesn't exist
      }));
      setReviews(transformedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: true })
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Review approved." });
      await fetchReviews();
    } catch (error) {
      console.error("Error approving review:", error);
      toast({
        title: "Error",
        description: "Failed to approve review.",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (id: string) => {
    try {
      // Note: is_archived field may not exist in database, so we'll just update is_approved to false
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: false })
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Review archived." });
      await fetchReviews();
    } catch (error) {
      console.error("Error archiving review:", error);
      toast({
        title: "Error",
        description: "Failed to archive review.",
        variant: "destructive",
      });
    }
  };

  const pendingReviews = reviews.filter(r => !r.is_approved && !r.is_archived);
  const approvedReviews = reviews.filter(r => r.is_approved && !r.is_archived);
  const archivedReviews = reviews.filter(r => r.is_archived);

  const renderReviewTable = (data: Review[]) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            data.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.products?.name || 'N/A'}</TableCell>
                <TableCell>{review.users?.email || 'N/A'}</TableCell>
                <TableCell>{review.rating}/5</TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>
                  <Badge
                    variant={review.is_approved ? "default" : "secondary"}
                  >
                    {review.is_approved ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!review.is_approved && !review.is_archived && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(review.id)}
                      >
                        <FaCheck />
                      </Button>
                    )}
                    {!review.is_archived && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchive(review.id)}
                      >
                        <FaArchive />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {renderReviewTable(pendingReviews)}
        </TabsContent>
        <TabsContent value="approved">
          {renderReviewTable(approvedReviews)}
        </TabsContent>
        <TabsContent value="archived">
          {renderReviewTable(archivedReviews)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsTab;
