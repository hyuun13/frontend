import { FC, useEffect, useState } from "react";
import Header from "../components/common/Header";
import BookCardVertical from "../components/common/BookCardVertical";
import SearchBarv2 from "../components/common/SearchBarv2";
import { bookMostService } from "../services/bookService";
import { fillBookDetailsKakao } from "../utils/fillBookResultsKakao";

const Home: FC = () => {
  const [weeklyBooks, setWeeklyBooks] = useState<any[]>([]);
  const [monthlyBooks, setMonthlyBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // 주간 최다 대출 도서 가져오기
        const weeklyResponse = await bookMostService(0); // action: 0은 주간
        const monthlyResponse = await bookMostService(1); // action: 1은 월간

        const enrichBookData = async (book: any) => {
          const kakaoBookDetails = await fillBookDetailsKakao({
            isbn: book.bookIsbn,
          });

          return {
            id: book.bookId,
            isbn: book.bookIsbn,
            status: book.bookStatus,
            title: kakaoBookDetails.title || "제목 없음",
            coverImageUrl: kakaoBookDetails.coverImageUrl || "/placeholder.svg",
          };
        };

        const filledWeeklyBooks = weeklyResponse?.bookRankList
          ? await Promise.all(weeklyResponse.bookRankList.map(enrichBookData))
          : [];

        const filledMonthlyBooks = monthlyResponse?.bookRankList
          ? await Promise.all(monthlyResponse.bookRankList.map(enrichBookData))
          : [];

        setWeeklyBooks(filledWeeklyBooks);
        setMonthlyBooks(filledMonthlyBooks);
      } catch (err) {
        console.error("대출 순위 데이터를 가져오는 중 오류 발생:", err);
        setError("대출 순위를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SearchBarv2 />
      <main className="container px-4 py-4 mx-auto">
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p className="text-gray-600">로딩 중...</p>
        ) : (
          <>
            {/* 주간 최다 대출 도서 섹션 */}
            <section className="mb-10">
              <h2 className="pb-1 mb-4 text-2xl font-semibold text-primary">
                주간 최다 대출 도서
              </h2>
              <div className="flex pb-4 space-x-4 overflow-x-auto">
                {weeklyBooks.map((book) => (
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

            {/* 월간 최다 대출 도서 섹션 */}
            <section>
              <h2 className="pb-1 mb-4 text-2xl font-semibold text-primary">
                월간 최다 대출 도서
              </h2>
              <div className="flex pb-4 space-x-4 overflow-x-auto">
                {monthlyBooks.map((book) => (
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
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
