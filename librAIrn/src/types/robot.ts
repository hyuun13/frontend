/**
 * Robot 도메인 모델입니다.
 * API의 Robot 관련 DTO를 UI에서 쉽게 다루기 위한 모델로 변환합니다.
 */
export interface Robot {
  /**
   * 로봇 고유 식별자
   */
  id: number;
  /**
   * 로봇 이름
   */
  name: string;
  /**
   * 로봇 이미지 URL (옵션)
   */
  imageUrl?: string;
  /**
   * 로봇의 현재 상태 (예: "정상", "오류", "대기" 등)
   */
  status: string;
}

/**
 * 로봇의 작업 내역(활동 로그) 모델입니다.
 */
export interface RobotLog {
  /**
   * 로그 유형 (예: "작업 시작", "오류 발생" 등)
   */
  type: string;
  /**
   * 로그 세부 내용
   */
  content: string;
  /**
   * 로그 발생 시각 (ISO 타임스탬프)
   */
  createdAt: string;
  /**
   * 로그 완료 시각 (옵션, ISO 타임스탬프)
   */
  completedAt?: string;
}
