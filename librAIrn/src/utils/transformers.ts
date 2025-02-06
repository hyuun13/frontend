// src/utils/transformers.ts
import type { BookCardHorizontal } from "../types/book";
import type { BookCardVertical } from "../types/book";

export const transformBookDtoToBookCardHorizontal = (dto: {
  bookId?: string;
  bookIsbn?: string;
  bookStatus?: string;
  bookSign?: string;
  bookReturn?: string;
}): Partial<BookCardHorizontal> => ({
  id: dto.bookId || "",
  isbn: dto.bookIsbn || "",
  title: "", // Kakao API로 채워질 예정
  writer: "", // Kakao API로 채워질 예정
  status: dto.bookStatus,
  callNumber: dto.bookSign,
  plannedReturnDate: dto.bookReturn,
});

export const transformBookDtoToBookCardVertical = (dto: {
  bookId?: string;
  bookIsbn?: string;
  bookStatus?: string;
}): Partial<BookCardVertical> => ({
  id: dto.bookId || "",
  isbn: dto.bookIsbn || "",
  status: dto.bookStatus,
});
