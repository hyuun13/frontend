import { useNotificationContext } from "../context/NotificationContext";

/**
 * useNotification 커스텀 훅은 NotificationContext로부터 알림 상태와 관리 함수를 반환합니다.
 */
export const useNotification = () => {
  return useNotificationContext();
};
