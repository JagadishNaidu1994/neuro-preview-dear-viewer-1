import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex">
            {renderStars(review.rating)}
          </div>
          <Badge className={ratingBadge.color}>
            {ratingBadge.text}
          </Badge>
          <span className="text-sm text-gray-500">
            {formatTimeAgo(review.created_at)}
          </span>
        </div>
        {userEmail && (
          <span className="text-sm text-gray-600">{userEmail}</span>
        )}
      </div>

      <p className="text-gray-700 mb-4">{review.comment}</p>

      {/* Admin Reply */}
      {review.admin_reply && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-blue-800">Admin Reply</span>
            <span className="text-xs text-blue-600 ml-2">
              {review.admin_reply_date && formatTimeAgo(review.admin_reply_date)}
            </span>
          </div>
          <p className="text-blue-700">{review.admin_reply}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Button
            size="sm"
            variant={userReaction === 'like' ? "default" : "outline"}
            onClick={() => handleReaction(true)}
            className="flex items-center space-x-2"
          >
            <FaThumbsUp className="w-4 h-4" />
            <span>{likeCount}</span>
          </Button>
          <Button
            size="sm"
            variant={userReaction === 'dislike' ? "destructive" : "outline"}
            onClick={() => handleReaction(false)}
            className="flex items-center space-x-2"
          >
            <FaThumbsDown className="w-4 h-4" />
            <span>{dislikeCount}</span>
          </Button>
        </div>

        {showAdminActions && !review.admin_reply && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setReplyDialogOpen(true)}
            className="flex items-center space-x-2"
          >
            <FaReply className="w-4 h-4" />
            <span>Reply</span>
          </Button>
        )}
      </div>

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