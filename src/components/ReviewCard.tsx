import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  admin_reply?: string;
  admin_reply_date?: string;
  users?: { email: string } | null;
}

const renderStars = (rating: number, size = "text-sm") => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
  }

  if (hasHalfStar) {
    stars.push(
      <FaStarHalfAlt key="half" className={`text-yellow-400 ${size}`} />
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar key={`empty-${i}`} className={`text-gray-300 ${size}`} />
    );
  }

  return stars;
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMonths = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  if (diffInMonths === 0) return "Recently";
  if (diffInMonths === 1) return "1 month ago";
  return `${diffInMonths} months ago`;
};

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium">
            {review.users?.email?.[0].toUpperCase() || "A"}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">
              {review.users?.email || "Anonymous"}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-sm text-gray-500">
              {formatTimeAgo(review.created_at)}
            </span>
          </div>
          <p className="text-gray-700 mb-3">{review.comment}</p>
          {review.admin_reply && (
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="font-semibold text-sm">Reply from the team</p>
              <p className="text-gray-600 text-sm">{review.admin_reply}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
