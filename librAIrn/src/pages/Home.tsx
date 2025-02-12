import { FC, useEffect, useState, useRef } from "react";
import BookCardVertical from "../components/common/BookCardVertical";
import SearchBarv2 from "../components/common/SearchBarv2";
import { bookMostService } from "../services/bookService";
import { fillBookDetailsKakao } from "../utils/fillBookDetailsKakao";
import { useToast } from "../hooks/useToast";
import { useLocation } from "react-router-dom";

const Home: FC = () => {
  const [weeklyBooks, setWeeklyBooks] = useState<any[]>([]);
  const [monthlyBooks, setMonthlyBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const location = useLocation();
  const toastShownRef = useRef(false);

  // ISBN 캐시를 활용해 중복 요청 방지
  const isbnCache = useRef(new Map());

  useEffect(() => {
    if (location.state && !toastShownRef.current) {
      const { message, type } = location.state as {
        message: string;
        type: "success" | "error";
      };
      showToast(message, type);
      toastShownRef.current = true;
    }
  }, [location.state, showToast]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        // 📌 주간 & 월간 데이터 병렬로 가져오기
        const [weeklyResponse, monthlyResponse] = await Promise.all([
          bookMostService(0),
          bookMostService(1),
        ]);

        // 📌 ISBN 캐시를 활용한 데이터 변환 함수
        const enrichBookData = async (book: any) => {
          if (isbnCache.current.has(book.bookIsbn)) {
            return {
              ...isbnCache.current.get(book.bookIsbn),
              id: book.bookId,
              status: book.bookStatus,
            };
          }

          const kakaoBookDetails = await fillBookDetailsKakao({
            isbn: book.bookIsbn,
          });

          const bookData = {
            id: book.bookId,
            isbn: book.bookIsbn,
            status: book.bookStatus,
            title: kakaoBookDetails.title || "제목 없음",
            coverImageUrl: kakaoBookDetails.coverImageUrl || "/placeholder.svg",
          };

          isbnCache.current.set(book.bookIsbn, bookData); // 캐시에 저장
          return bookData;
        };

        // 📌 Kakao API 병렬 실행
        const [filledWeeklyBooks, filledMonthlyBooks] = await Promise.all([
          weeklyResponse?.bookRankList
            ? Promise.all(weeklyResponse.bookRankList.map(enrichBookData))
            : [],
          monthlyResponse?.bookRankList
            ? Promise.all(monthlyResponse.bookRankList.map(enrichBookData))
            : [],
        ]);

        setWeeklyBooks(filledWeeklyBooks);
        setMonthlyBooks(filledMonthlyBooks);
      } catch (err) {
        console.error("대출 순위 데이터를 가져오는 중 오류 발생:", err);
        setError("대출 순위를 불러오는 중 오류가 발생했습니다.");
        showToast("도서 데이터를 가져오는 중 오류가 발생했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [showToast]);

  return (
    <div className="min-h-screen bg-snow mt-10">
      <SearchBarv2 />
      <main className="container px-4 py-4 mx-auto bg-snow">
        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <>
            <SkeletonSection title="주간 최다 대출 도서" />
            <SkeletonSection title="월간 최다 대출 도서" />
          </>
        ) : (
          <>
            {/* 주간 최다 대출 도서 섹션 */}
            <BookSection title="주간 최다 대출 도서" books={weeklyBooks} />
            {/* 월간 최다 대출 도서 섹션 */}
            <BookSection title="월간 최다 대출 도서" books={monthlyBooks} />
          </>
        )}
      </main>
    </div>
  );
};

// 📌 스켈레톤 UI 컴포넌트
const SkeletonSection: FC<{ title: string }> = ({ title }) => (
  <section className="mb-10">
    <h2 className="pb-1 mb-4 text-2xl font-semibold text-primary">{title}</h2>
    <div className="flex pb-4 space-x-4 overflow-x-auto">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-40 h-56 bg-gray-200 animate-pulse rounded-lg"
        />
      ))}
    </div>
  </section>
);

// 📌 도서 섹션 컴포넌트
const BookSection: FC<{ title: string; books: any[] }> = ({ title, books }) => (
  <section className="mb-10">
    <h2 className="pb-1 mb-4 text-2xl font-semibold text-primary">{title}</h2>
    <div className="flex pb-4 space-x-4 overflow-x-auto">
      {books.map((book) => (
        <div key={book.id} className="flex-shrink-0">
          <BookCardVertical
            id={book.id}
            isbn={book.isbn}
            title={book.title}
            coverImageUrl={book.coverImageUrl}
            status={book.status}
          />
        </div>
      ))}
    </div>
  </section>
);

export default Home;
