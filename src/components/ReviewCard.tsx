import { FaStar, FaStarHalfAlt, FaRegStar, FaThumbsUp, FaThumbsDown, FaRegComment } from "react-icons/fa";

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

const ReviewCard = ({ review }: { review: Review }) => {
    
  const renderStars = (rating: number, size = "text-sm") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className={`text-yellow-400 ${size}`} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={`text-gray-300 ${size}`} />);
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

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
        <span className="ml-3 text-sm font-medium text-gray-800">{review.users?.email.split('@')[0] ?? 'Anonymous'}</span>
        <span className="text-sm text-gray-500 mx-2">•</span>
        <span className="text-sm text-gray-500">{formatTimeAgo(review.created_at)}</span>
      </div>
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
      {review.admin_reply && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4 border-l-4 border-gray-300">
          <p className="text-sm font-semibold text-gray-800">Reply from DearNeuro</p>
          <p className="text-sm text-gray-600 mt-1">{review.admin_reply}</p>
        </div>
      )}
      <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
        <button className="flex items-center gap-1 hover:text-gray-800"><FaThumbsUp className="w-4 h-4" />Helpful</button>
        <button className="flex items-center gap-1 hover:text-gray-800"><FaThumbsDown className="w-4 h-4" /></button>
        <button className="flex items-center gap-1 hover:text-gray-800"><FaRegComment className="w-4 h-4" />Comment</button>
      </div>
    </div>
  );
};

export default ReviewCard;
