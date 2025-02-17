/**
 * User 도메인 모델입니다.
 * API의 User 관련 DTO를 기반으로 UI 및 인증, 사용자 관리에 활용할 타입입니다.
 */
export interface User {
  userId: number;
  userName: string;
  isAdmin: boolean;
}

/**
 * 사용자 대출/반납 기록 등 마이 페이지에서 활용할 모델입니다.
 */
export interface UserRecord {
  /**
   * 도서 ISBN (또는 bookId)
   */
  bookIsbn: string;
  /**
   * 대출 일시 (ISO 문자열)
   */
  borrowAt: string;
  /**
   * 반납 일시 (옵션, ISO 문자열)
   */
  returnAt?: string;
  /**
   * 대출 상태 (예: "대출 중", "반납 완료", "연체" 등)
   */
  status: string;
}
