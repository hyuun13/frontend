// src/hooks/useBookDetail.ts
import { useState, useEffect } from "react";
import { fetchBookDetails } from "../services/bookService";
import { fillBookDetailsNaver } from "../utils/fillBookDetailsNaver";
import type { DetailedBook } from "../types/book";

export const useBookDetails = (bookId: string) => {
  const [book, setBook] = useState<DetailedBook | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchBookDetails(bookId);
        if (response) {
          // 백엔드 응답으로 기본 데이터만 설정
          const initialBookData: Partial<DetailedBook> = {
            id: bookId,
            isbn: response.bookIsbn || "",
            status: response.bookStatus || "상태 정보 없음",
            callNumber: response.bookSign,
            plannedReturnDate: response.bookReturn,
          };

          // fillBookDetailsNaver를 통해 나머지 정보 보충
          const detailedBook = await fillBookDetailsNaver(initialBookData);
          setBook(detailedBook);
        } else {
          setError("도서 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("도서 상세 정보 조회 실패:", err);
        setError("도서 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [bookId]);

  return { book, loading, error };
};
