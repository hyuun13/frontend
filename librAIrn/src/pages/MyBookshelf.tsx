import { FC, useEffect, useState } from "react";
import { fetchUserRecords } from "../services/userService";
import { fillBookDetailsKakao } from "../utils/fillBookDetailsKakao";
import { transformBookDtoToBookCardHorizontal } from "../utils/transformers";
import BookCardHorizontalComponent from "../components/common/BookCardHorizontal";
import { useAuth } from "../hooks/useAuth";
import dayjs from "dayjs";

const MyBookShelf: FC = () => {
  const [bookRecords, setBookRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchAndTransformRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const records = await fetchUserRecords(user.id);
        // Transform and enrich book data using Kakao API
        const transformedBooks = await Promise.all(
          records.map(async (record) => {
            const transformed = transformBookDtoToBookCardHorizontal(record);
            const filledBook = await fillBookDetailsKakao(transformed);

            return {
              ...filledBook,
              id: record.bookIsbn || "", // ISBN을 대체 식별자로 사용
              status: record.status || "-",
              borrowAt: record.borrowAt || "-",
              returnAt: record.returnAt || "-",
            };
          })
        );

        // 최신 대출일 순으로 정렬
        const sortedBooks = transformedBooks.sort((a, b) => {
          const dateA = dayjs(a.borrowAt === "-" ? 0 : a.borrowAt);
          const dateB = dayjs(b.borrowAt === "-" ? 0 : b.borrowAt);
          return dateB.diff(dateA); // 최신순으로 정렬
        });

        setBookRecords(sortedBooks);
      } catch (err) {
        console.error("도서 기록 조회 실패:", err);
        setError("도서 기록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndTransformRecords();
  }, [user]);

  return (
    <div>
      <div className="container max-w-4xl min-h-screen px-4 mx-auto mt-8">
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="flex p-6 space-x-4 border border-gray-200 rounded-lg animate-pulse"
              >
                <div className="w-24 h-32 bg-gray-300 rounded"></div>
                <div className="flex-1 py-1 space-y-4">
                  <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                  <div className="h-6 bg-gray-300 rounded"></div>
                  <div className="w-5/6 h-6 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : bookRecords.length === 0 ? (
          <p className="text-gray-600">대출한 도서가 없습니다.</p>
        ) : (
          <div className="space-y-6">
            {bookRecords.map((book) => (
              <BookCardHorizontalComponent
                key={book.id}
                {...book}
                disableClick={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookShelf;
