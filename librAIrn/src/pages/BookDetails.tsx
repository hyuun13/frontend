import { FC, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchBookDetails } from "../services/bookService";
import { fillBookDetailsNaver } from "../utils/fillBookDetailsNaver";
import { formatDate } from "../utils/formatters";
import { DetailedBook } from "../types/book";

const BookDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<DetailedBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isbnCache = useRef(new Map());

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchBookDetails(id);
        if (!response) {
          setError("도서 정보를 찾을 수 없습니다.");
          return;
        }

        const initialBookData: Partial<DetailedBook> = {
          id,
          isbn: response.bookIsbn || "",
          status: response.bookStatus || "상태 정보 없음",
          callNumber: response.bookSign,
          plannedReturnDate: response.bookReturn,
        };

        if (isbnCache.current.has(initialBookData.isbn)) {
          setBook({
            ...initialBookData,
            ...isbnCache.current.get(initialBookData.isbn),
          });
        } else {
          const naverData = await fillBookDetailsNaver(initialBookData);
          if (naverData) isbnCache.current.set(initialBookData.isbn, naverData);
          setBook({ ...initialBookData, ...naverData });
        }
      } catch (err) {
        console.error("도서 상세 정보 조회 실패:", err);
        setError("도서 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <StatusMessage message={error} type="error" />;
  if (!book)
    return (
      <StatusMessage message="도서 정보를 찾을 수 없습니다." type="not-found" />
    );

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-transparent sm:p-6 lg:p-8">
      <div className="container relative z-10 mx-auto flex flex-col md:flex-row items-center space-x-6">
        <BookCover imageUrl={book.coverImageUrl} title={book.title} />
        <div className="w-full max-w-2xl bg-white shadow-xl backdrop-blur-md rounded-xl p-6 md:p-8">
          <BookInfo book={book} />
        </div>
      </div>
    </div>
  );
};

const BookCover: FC<{ imageUrl: string; title: string }> = ({
  imageUrl,
  title,
}) => (
  <div className="w-full max-w-[300px] md:w-1/3 aspect-[3/4] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
    {imageUrl ? (
      <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
    ) : (
      <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
        이미지 없음
      </div>
    )}
  </div>
);

const BookInfo: FC<{ book: DetailedBook }> = ({ book }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
    <p className="text-xl font-semibold text-gray-800 mb-2">{book.writer}</p>
    <p className="text-sm text-gray-600 mb-4">
      {book.publisher} {book.publisher && book.publishDate && " · "}{" "}
      {book.publishDate && formatDate(book.publishDate)}
    </p>
    <InfoItem label="청구기호" value={book.callNumber ?? "정보 없음"} />
    <InfoItem label="도서상태" value={book.status} />
    <InfoItem
      label="반납예정일"
      value={
        book.plannedReturnDate ? formatDate(book.plannedReturnDate) : "없음"
      }
    />
    <InfoItem label="등록번호" value={book.id ?? "정보 없음"} />
    {book.description && (
      <p className="text-sm text-gray-700 mt-4">{book.description}</p>
    )}
  </div>
);

const InfoItem: FC<{ label: string; value: string }> = ({ label, value }) => (
  <p className="text-sm">
    <span className="font-medium text-gray-600 mr-2">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </p>
);

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

const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin" />
  </div>
);

export default BookDetail;
