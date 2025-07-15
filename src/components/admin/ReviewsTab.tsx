
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
import { FaCheck, FaTrash } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  product_name?: string;
  user_email?: string;
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
      const { data: reviewsData, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch related product and user data separately
      const reviewsWithDetails: Review[] = [];
      if (reviewsData) {
        for (const review of reviewsData) {
          let productName = "Unknown Product";
          let userEmail = "Unknown User";

          // Fetch product name
          if (review.product_id) {
            const { data: product } = await supabase
              .from("products")
              .select("name")
              .eq("id", review.product_id)
              .single();
            if (product) productName = product.name;
          }

          // Fetch user email
          if (review.user_id) {
            const { data: user } = await supabase
              .from("users")
              .select("email")
              .eq("id", review.user_id)
              .single();
            if (user) userEmail = user.email;
          }

          reviewsWithDetails.push({
            ...review,
            product_name: productName,
            user_email: userEmail,
          });
        }
      }

      setReviews(reviewsWithDetails);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Review deleted." });
      await fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>

              
          <!--<TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell> -->

              
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
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No reviews found
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!review.is_approved && !review.is_archived && (

              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.product_name}</TableCell>
                  <TableCell>{review.user_email}</TableCell>
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
                      {!review.is_approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(review.id)}
                        >
                          <FaCheck />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(review.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReviewsTab;
