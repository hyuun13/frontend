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

        // 캐시에 존재하면 즉시 사용하고 최신 대출 상태만 업데이트
        if (isbnCache.current.has(initialBookData.isbn)) {
          const cachedData = isbnCache.current.get(initialBookData.isbn);
          setBook({
            ...initialBookData,
            ...cachedData,
          });

          // 최신 대출 상태만 갱신
          const updatedStatus = await fetchBookDetails(id);

          if (!updatedStatus) {
            setError("도서 정보를 찾을 수 없습니다.");
            setLoading(false);
            return;
          }

          setBook((prev) =>
            prev
              ? {
                  ...prev,
                  status: updatedStatus.bookStatus ?? "상태 정보 없음",
                }
              : null
          );

          setLoading(false);

          return;
        }

        // 백엔드 및 Naver API 요청 병렬 처리
        const [naverData] = await Promise.all([
          fillBookDetailsNaver(initialBookData),
        ]);

        if (naverData) {
          isbnCache.current.set(initialBookData.isbn, naverData);
        }

        setBook({ ...initialBookData, ...naverData });
      } catch (err) {
        console.error("도서 상세 정보 조회 실패:", err);
        setError("도서 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <SkeletonBookDetail />;
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

const BookInfo: FC<{ book: DetailedBook }> = ({ book }) => (
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

const InfoItem: FC<{ label: string; value: string }> = ({ label, value }) => (
  <p className="text-sm">
    <span className="mr-2 font-medium text-gray-600">{label}:</span>
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

const SkeletonBookDetail: FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
    <div className="w-40 h-60 bg-gray-200 animate-pulse rounded-lg" />
    <div className="w-64 h-6 bg-gray-200 animate-pulse rounded" />
    <div className="w-48 h-4 bg-gray-200 animate-pulse rounded" />
    <div className="w-32 h-4 bg-gray-200 animate-pulse rounded" />
  </div>
);

export default BookDetail;
