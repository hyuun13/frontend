// src/pages/BookDetail.tsx
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useBookDetails } from "../hooks/useBookDetails";
import { formatDate } from "../utils/formatters";
import { DetailedBook } from "../types/book";

const StatusMessage: FC<{
  message: string;
  type: "loading" | "error" | "not-found";
}> = ({ message, type }) => {
  const classNames = {
    loading: "text-blue-500",
    error: "text-red-500",
    "not-found": "text-gray-600",
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`text-lg ${classNames[type]}`}>{message}</div>
    </div>
  );
};

const BookDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { book, loading, error } = useBookDetails(id || "");

  if (loading) return <StatusMessage message="로딩 중..." type="loading" />;
  if (error) return <StatusMessage message={error} type="error" />;
  if (!book)
    return (
      <StatusMessage message="도서 정보를 찾을 수 없습니다." type="not-found" />
    );

  return (
    <div className="relative min-h-screen p-4 overflow-hidden bg-transparent sm:p-6 lg:p-8">
      <BlurryBackground imageUrl={book.coverImageUrl} />
      <div className="container relative z-10 mx-auto">
        <div className="md:flex md:items-center md:space-x-6">
          <BookCover imageUrl={book.coverImageUrl} title={book.title} />
          <div className="w-full overflow-hidden transition-all duration-300 bg-white shadow-xl backdrop-blur-md rounded-xl hover:shadow-xl">
            <BookInfo book={book} />
          </div>
        </div>
      </div>
    </div>
  );
};

const BlurryBackground: FC<{ imageUrl: string }> = ({ imageUrl }) => (
  <div
    className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-50 blur-xl"
    style={{ backgroundImage: `url(${imageUrl})` }}
  />
);

const BookCover: FC<{ imageUrl: string; title: string }> = ({
  imageUrl,
  title,
}) => (
  <div className="flex items-center justify-center p-8 md:w-2/5 lg:w-1/3">
    <div className="w-full max-w-[300px] aspect-[3/4] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-white">
          <span className="text-gray-500">이미지 없음</span>
        </div>
      )}
    </div>
  </div>
);

const BookInfo: FC<{ book: DetailedBook }> = ({ book }) => {
  return (
    <div className="p-9 md:p-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">{book.title}</h1>
      <p className="mb-2 text-xl font-semibold text-gray-800">{book.writer}</p>
      <p className="mb-4 text-sm text-gray-600">
        {book.publisher}
        {book.publisher && book.publishDate && " · "}
        {book.publishDate && formatDate(book.publishDate)}
      </p>
      <div className="mb-6 space-y-2">
        <InfoItem label="청구기호" value={book.callNumber ?? "정보 없음"} />
        <InfoItem label="도서상태" value={book.status} />
        <InfoItem
          label="반납예정일"
          value={
            book.plannedReturnDate ? formatDate(book.plannedReturnDate) : "없음"
          }
        />
        <InfoItem label="등록번호" value={book.id ?? "정보 없음"} />
      </div>
      {book.description && (
        <p className="text-sm leading-relaxed text-gray-700">
          {book.description}
        </p>
      )}
    </div>
  );
};

const InfoItem: FC<{ label: string; value: string }> = ({ label, value }) => (
  <p className="text-sm">
    <span className="mr-2 font-medium text-gray-600">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </p>
);

export default BookDetail;
