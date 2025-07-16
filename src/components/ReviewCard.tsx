import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { FaStar, FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_id: string;
    admin_reply?: string;
    admin_reply_date?: string;
  };
  userEmail?: string;
  onReplySubmitted?: () => void;
  showAdminActions?: boolean;
}

const ReviewCard = ({ review, userEmail, onReplySubmitted, showAdminActions = false }: ReviewCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [adminReply, setAdminReply] = useState(review.admin_reply || "");

  const getRatingBadge = (rating: number) => {
    if (rating === 1) return { text: "BAD", color: "bg-red-500 text-white" };
    if (rating === 2) return { text: "Okay", color: "bg-orange-500 text-white" };
    if (rating === 3) return { text: "Good", color: "bg-yellow-500 text-white" };
    if (rating === 4) return { text: "Best", color: "bg-green-500 text-white" };
    if (rating === 5) return { text: "Amazing", color: "bg-green-600 text-white" };
    return { text: "Good", color: "bg-gray-500 text-white" };
  };

  const handleReaction = async (isLike: boolean) => {
    if (!user) {
      toast({ title: "Error", description: "Please login to react to reviews", variant: "destructive" });
      return;
    }

    try {
      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from("review_likes")
        .select("*")
        .eq("review_id", review.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingReaction) {
        if (existingReaction.is_like === isLike) {
          // Remove reaction if clicking the same button
          await supabase
            .from("review_likes")
            .delete()
            .eq("id", existingReaction.id);
          setUserReaction(null);
        } else {
          // Update reaction
          await supabase
            .from("review_likes")
            .update({ is_like: isLike })
            .eq("id", existingReaction.id);
          setUserReaction(isLike ? 'like' : 'dislike');
        }
      } else {
        // Create new reaction
        await supabase
          .from("review_likes")
          .insert({
            review_id: review.id,
            user_id: user.id,
            is_like: isLike,
          });
        setUserReaction(isLike ? 'like' : 'dislike');
      }

      // Refresh counts
      await fetchReactionCounts();
    } catch (error) {
      console.error("Error handling reaction:", error);
      toast({ title: "Error", description: "Failed to update reaction", variant: "destructive" });
    }
  };

  const fetchReactionCounts = async () => {
    try {
      const { data: likes } = await supabase
        .from("review_likes")
        .select("*")
        .eq("review_id", review.id);

      if (likes) {
        setLikeCount(likes.filter(like => like.is_like).length);
        setDislikeCount(likes.filter(like => !like.is_like).length);
        
        if (user) {
          const userLike = likes.find(like => like.user_id === user.id);
          if (userLike) {
            setUserReaction(userLike.is_like ? 'like' : 'dislike');
          }
        }
      }
    } catch (error) {
      console.error("Error fetching reaction counts:", error);
    }
  };

  const handleAdminReply = async () => {
    if (!adminReply.trim()) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .update({ 
          admin_reply: adminReply,
          admin_reply_date: new Date().toISOString()
        })
        .eq("id", review.id);
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Reply added successfully." });
      setReplyDialogOpen(false);
      onReplySubmitted?.();
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({ title: "Error", description: "Failed to add reply.", variant: "destructive" });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMonths = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffInMonths === 0) return "Recently";
    if (diffInMonths === 1) return "1 month ago";
    return `${diffInMonths} months ago`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  // Initialize counts on mount
  useEffect(() => {
    fetchReactionCounts();
  }, [review.id]);

  const ratingBadge = getRatingBadge(review.rating);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex">
            {renderStars(review.rating)}
          </div>
          <Badge className={`${ratingBadge.color} text-xs font-medium`}>
            {ratingBadge.text}
          </Badge>
          <span className="text-sm text-gray-500">
            {formatTimeAgo(review.created_at)}
          </span>
        </div>
        {userEmail && (
          <span className="text-sm text-gray-600 truncate">{userEmail}</span>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Admin Reply */}
      {review.admin_reply && (
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm font-medium text-blue-800">Admin Reply</span>
            {review.admin_reply_date && (
              <span className="text-xs text-blue-600">
                {formatTimeAgo(review.admin_reply_date)}
              </span>
            )}
          </div>
          <p className="text-blue-700 text-sm leading-relaxed">{review.admin_reply}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant={userReaction === 'like' ? "default" : "outline"}
            onClick={() => handleReaction(true)}
            className="flex items-center gap-2 text-xs"
          >
            <FaThumbsUp className="w-3 h-3" />
            <span>{likeCount}</span>
          </Button>
          <Button
            size="sm"
            variant={userReaction === 'dislike' ? "destructive" : "outline"}
            onClick={() => handleReaction(false)}
            className="flex items-center gap-2 text-xs"
          >
            <FaThumbsDown className="w-3 h-3" />
            <span>{dislikeCount}</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDetailDialogOpen(true)}
            className="flex items-center gap-2 text-xs"
          >
            <Eye className="w-3 h-3" />
            <span>View Details</span>
          </Button>
        </div>

        {showAdminActions && !review.admin_reply && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setReplyDialogOpen(true)}
            className="flex items-center gap-2 text-xs"
          >
            <FaReply className="w-3 h-3" />
            <span>Reply</span>
          </Button>
        )}
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
                <Badge className={ratingBadge.color}>
                  {ratingBadge.text}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatTimeAgo(review.created_at)}
              </span>
            </div>
            
            {userEmail && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Reviewer: {userEmail}</span>
              </div>
            )}
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Review:</h4>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
            
            {review.admin_reply && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-800">Admin Reply</span>
                  {review.admin_reply_date && (
                    <span className="text-sm text-blue-600">
                      {formatTimeAgo(review.admin_reply_date)}
                    </span>
                  )}
                </div>
                <p className="text-blue-700 leading-relaxed">{review.admin_reply}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Community Feedback:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaThumbsUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{likeCount} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaThumbsDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm">{dislikeCount} dislikes</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex mb-2">
                {renderStars(review.rating)}
              </div>
              <p>{review.comment}</p>
            </div>
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
              <Button onClick={handleAdminReply}>
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewCard;