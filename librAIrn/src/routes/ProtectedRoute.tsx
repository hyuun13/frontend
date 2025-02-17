import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin }) => {
  const { user } = useAuth();

  if (!user) {
    // ✅ 로그인되지 않은 경우 → 로그인 페이지로 리디렉트
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    // ✅ 일반 사용자가 관리자 페이지에 접근 시 → 홈으로 리디렉트
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // ✅ 정상 접근 시, 해당 컴포넌트 렌더링
};

export default ProtectedRoute;
