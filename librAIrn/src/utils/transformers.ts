// src/utils/transformers.ts
import type { BookCardHorizontal } from "../types/book";
import type { BookCardVertical } from "../types/book";
import { User } from "../types/user";
import {
  UserLoginResponseDto,
  BookFrontResponseDto,
} from "../backapi/data-contracts";

/**
 * UserLoginResponseDto를 User로 변환합니다.
 * @param response UserLoginResponseDto - 백엔드에서 반환된 사용자 응답
 * @param loginId string - 로그인 시 사용된 로그인 아이디
 * @returns User 타입의 객체
 */
export const mapUserLoginResponseToUser = (
  response: UserLoginResponseDto,
  loginId: string
): User => {
  return {
    id: response.userId,
    name: response.userName,
    loginId: loginId,
    email: undefined, // 필요 시 설정
    status: undefined, // 필요 시 설정
  };
};

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
  title: "",
  status: dto.bookStatus,
});

// 백엔드 응답을 BookCardVertical 타입으로 변환하는 함수
export const mapToBookCardVertical = (
  book: BookFrontResponseDto
): Partial<BookCardVertical> => ({
  id: book.bookId || "",
  isbn: book.bookIsbn || "",
  title: "정보 없음", // 없으면 나중에 네이버로 채움
  coverImageUrl: "",
  status: book.bookStatus || "정보 없음",
});
