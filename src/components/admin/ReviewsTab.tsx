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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FaCheck, FaArchive, FaStar, FaReply, FaHeart, FaRegStar, FaRegHeart } from "react-icons/fa";
import ReviewCard from "@/components/ReviewCard";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  archived: boolean;
  admin_reply?: string;
  is_important: boolean;
  admin_reply_date?: string;
  created_at: string;
  product_name?: string;
  user_email?: string;
}

const ReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [archivedReviews, setArchivedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminReply, setAdminReply] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Fetch reviews without problematic joins first
      const { data: reviewsData, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch product and user details separately for better reliability
      const productIds = [...new Set(reviewsData?.map(r => r.product_id).filter(Boolean))];
      const userIds = [...new Set(reviewsData?.map(r => r.user_id).filter(Boolean))];

      const [{ data: products }, { data: users }] = await Promise.all([
        supabase.from("products").select("id, name").in("id", productIds),
        supabase.from("users").select("id, email").in("id", userIds)
      ]);

      const productMap = new Map(products?.map(p => [p.id, p.name]) || []);
      const userMap = new Map(users?.map(u => [u.id, u.email]) || []);

      const reviewsWithDetails: Review[] = [];
      const archivedWithDetails: Review[] = [];
      
      if (reviewsData) {
        reviewsData.forEach((review: any) => {
          const reviewWithDetails = {
            ...review,
            product_name: productMap.get(review.product_id) || "Unknown Product",
            user_email: userMap.get(review.user_id) || "Unknown User",
          };

          if (review.archived) {
            archivedWithDetails.push(reviewWithDetails);
          } else {
            reviewsWithDetails.push(reviewWithDetails);
          }
        });
      }

      setReviews(reviewsWithDetails);
      setArchivedReviews(archivedWithDetails);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setArchivedReviews([]);
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
      const { error } = await supabase
        .from("reviews")
        .update({ archived: true })
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

  const handleUnarchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ archived: false })
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Review unarchived." });
      await fetchReviews();
    } catch (error) {
      console.error("Error unarchiving review:", error);
      toast({
        title: "Error",
        description: "Failed to unarchive review.",
        variant: "destructive",
      });
    }
  };

  const handleToggleImportant = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_important: !currentState })
        .eq("id", id);
      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `Review ${!currentState ? 'marked as important' : 'removed from important'}.` 
      });
      await fetchReviews();
    } catch (error) {
      console.error("Error updating review importance:", error);
      toast({
        title: "Error",
        description: "Failed to update review importance.",
        variant: "destructive",
      });
    }
  };

  const handleReplySubmit = async () => {
    if (!selectedReview || !adminReply.trim()) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .update({ 
          admin_reply: adminReply,
          admin_reply_date: new Date().toISOString()
        })
        .eq("id", selectedReview.id);
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Reply added successfully." });
      setReplyDialogOpen(false);
      setAdminReply("");
      setSelectedReview(null);
      await fetchReviews();
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: "Failed to add reply.",
        variant: "destructive",
      });
    }
  };

  const ReviewTable = ({ reviewList, isArchived = false }: { reviewList: Review[], isArchived?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Important</TableHead>
          <TableHead>Reply</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : reviewList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              {isArchived ? "No archived reviews found" : "No reviews found"}
            </TableCell>
          </TableRow>
        ) : (
          reviewList.map((review) => (
            <TableRow key={review.id}>
              <TableCell>{review.product_name}</TableCell>
              <TableCell>{review.user_email}</TableCell>
              <TableCell>{review.rating}/5</TableCell>
              <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
              <TableCell>
                <Badge variant={review.is_approved ? "default" : "secondary"}>
                  {review.is_approved ? "Approved" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleToggleImportant(review.id, review.is_important)}
                >
                  {review.is_important ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400" />
                  )}
                </Button>
              </TableCell>
              <TableCell>
                {review.admin_reply ? (
                  <Badge variant="outline">Replied</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedReview(review);
                      setAdminReply(review.admin_reply || "");
                      setReplyDialogOpen(true);
                    }}
                  >
                    <FaReply />
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {!review.is_approved && !isArchived && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(review.id)}
                    >
                      <FaCheck />
                    </Button>
                  )}
                  {isArchived ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnarchive(review.id)}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
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
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({reviews.filter(r => r.is_important).length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedReviews.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="relative">
                <ReviewCard 
                  review={review}
                  userEmail={review.user_email}
                  onReplySubmitted={fetchReviews}
                  showAdminActions={true}
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  {!review.is_approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      <FaCheck className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleImportant(review.id, review.is_important)}
                    className={review.is_important ? "bg-red-50 hover:bg-red-100" : ""}
                  >
                    {review.is_important ? (
                      <FaHeart className="w-4 h-4 text-red-500" />
                    ) : (
                      <FaRegHeart className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleArchive(review.id)}
                    className="bg-gray-50 hover:bg-gray-100"
                  >
                    <FaArchive className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active reviews found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          {reviews.filter(r => r.is_important).length > 0 ? (
            reviews.filter(r => r.is_important).map((review) => (
              <div key={review.id} className="relative">
                <ReviewCard 
                  review={review}
                  userEmail={review.user_email}
                  onReplySubmitted={fetchReviews}
                  showAdminActions={true}
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  {!review.is_approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-50 hover:bg-green-100"
                    >
                      <FaCheck className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleImportant(review.id, review.is_important)}
                    className="bg-red-50 hover:bg-red-100"
                  >
                    <FaHeart className="w-4 h-4 text-red-500" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleArchive(review.id)}
                    className="bg-gray-50 hover:bg-gray-100"
                  >
                    <FaArchive className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No favorite reviews found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {archivedReviews.length > 0 ? (
            archivedReviews.map((review) => (
              <div key={review.id} className="relative">
                <ReviewCard 
                  review={review}
                  userEmail={review.user_email}
                  onReplySubmitted={fetchReviews}
                  showAdminActions={true}
                />
                <div className="absolute top-4 right-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUnarchive(review.id)}
                    className="bg-blue-50 hover:bg-blue-100"
                  >
                    Restore
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No archived reviews found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Admin Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReview && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedReview.product_name}</p>
                <p className="text-sm text-muted-foreground">By: {selectedReview.user_email}</p>
                <p className="mt-2">{selectedReview.comment}</p>
                <p className="text-sm text-muted-foreground mt-1">Rating: {selectedReview.rating}/5</p>
              </div>
            )}
            <Textarea
              placeholder="Write your admin reply..."
              value={adminReply}
              onChange={(e) => setAdminReply(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReplySubmit}>
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsTab;