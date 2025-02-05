import { useAuthContext } from "../context/AuthContext";

/**
 * useAuth 커스텀 훅은 AuthContext로부터 인증 상태와 기능들을 반환합니다.
 */
export const useAuth = () => {
  return useAuthContext();
};
