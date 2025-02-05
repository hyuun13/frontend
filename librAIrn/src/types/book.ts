// src/types/book.ts

// 기본 도서 정보 인터페이스
export interface BookBase {
  id: string; // 책 고유 식별자 (book id)
  isbn: string; // ISBN 번호
  title: string; // 책 제목
  coverImageUrl: string; // 책 표지 URL (필수 또는 옵션)
}

/**
 * 세로형 카드 (BookCardVertical)
 * - 사용 용도: 신착 도서, 베스트 대출 도서 등
 * - 표시 항목: 도서 표지, 제목, 상태(status)
 */
export interface BookCardVertical extends BookBase {
  status?: string;
}

/**
 * 가로형 카드 (BookCardHorizontal)
 * - 사용 용도: 검색 결과 페이지, 내 책장, 대출 현황 페이지 등
 *
 * [검색 결과 페이지]
 *  - 표시 항목: 도서 표지, 제목, 작가, 대출 상태(status), 청구기호(callNumber)
 *
 * [내 책장 페이지]
 *  - 표시 항목: 도서 표지, 제목, 작가, 대출일(borrowAt), 반납일(returnAt)
 *
 * [대출 현황 페이지]
 *  - 표시 항목: 도서 표지, 제목, 작가, 대출 상태(status), 반납 예정일(plannedReturnDate)
 */
export interface BookCardHorizontal extends BookBase {
  writer?: string;
  status?: string;
  callNumber?: string; // 검색 결과 페이지에서 사용
  borrowAt?: string; // 내 책장 페이지: 대출일 (ISO 날짜 문자열)
  returnAt?: string; // 내 책장 페이지: 반납일 (ISO 날짜 문자열)
  plannedReturnDate?: string; // 대출 현황 페이지: 반납 예정일 (ISO 날짜 문자열)
}

/**
 * 상세 페이지 도서 정보 (DetailedBook)
 * - 표시 항목: 도서 표지, 제목, 작가, 출판사, 출판일, 청구기호,
 *           대출 상태(status), 반납 예정일(plannedReturnDate), 책 소개(description)
 */
export interface DetailedBook extends BookBase {
  writer: string;
  publisher?: string;
  publishDate?: string; // ISO 날짜 문자열 (출판일)
  callNumber?: string;
  plannedReturnDate?: string; // 반납 예정일 (ISO 날짜 문자열)
  description?: string;
  status: string;
}
