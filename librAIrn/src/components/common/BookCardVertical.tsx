import { FC } from "react";
import type { BookCardVertical } from "../../types/book";
import { useNavigate } from "react-router-dom";

/**
 * 세로형 카드 - 신착도서, 베스트 대출 도서 등에서 사용
 * 표시 항목: 도서 표지, 제목, 상태(status)
 */
const BookCardVertical: FC<BookCardVertical> = ({
  id,
  coverImageUrl,
  title,
  status,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="w-full max-w-xs p-2" onClick={handleClick}>
      <div className="transition-shadow duration-300 ease-in-out bg-white shadow-md rounded-xl hover:shadow-lg">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="object-cover w-full h-48 mb-2 rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-48 mb-2 bg-gray-300">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
      </div>
      {/* 제목에 truncate 적용 */}
      <h3
        className="mb-2 text-lg font-bold truncate"
        title={title} // 마우스 오버 시 전체 제목 표시
      >
        {title}
      </h3>
      {status && (
        <p
          className={
            status === "대출 가능"
              ? "text-blue font-bold"
              : "text-primary font-bold"
          }
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default BookCardVertical;
