import { FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Home,
  QrCode,
  BookMarked,
  User,
  Bot,
  MapPinned,
  BookPlus,
} from "lucide-react";

const NavigationBar: FC = () => {
  const { user } = useAuth();

  // 관리자 여부 확인
  const isAdmin = user && user.id >= 1 && user.id <= 5;

  return (
    <nav className="bg-blue-500 p-4 text-white shadow-md">
      <ul className="flex space-x-6 items-center">
        <li className="flex items-center space-x-2">
          <Home size={18} />
          <Link to="/" className="hover:underline">
            홈
          </Link>
        </li>

        {isAdmin ? (
          // 관리자 전용 네비게이션
          <>
            <li className="flex items-center space-x-2">
              <BookPlus size={18} />
              <Link to="/book-management" className="hover:underline">
                도서 관리
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Bot size={18} />
              <Link to="/robot-management" className="hover:underline">
                로봇 관리
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <MapPinned size={18} />
              <Link to="/collection-status" className="hover:underline">
                회수 현황
              </Link>
            </li>
          </>
        ) : (
          // 일반 사용자 네비게이션
          <>
            <li className="flex items-center space-x-2">
              <BookMarked size={18} />
              <Link to="/bookshelf" className="hover:underline">
                내 책장
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <QrCode size={18} />
              <Link to="/qrcode" className="hover:underline">
                바코드
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <User size={18} />
              <Link to="/my" className="hover:underline">
                마이
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavigationBar;
