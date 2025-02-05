// src/components/common/NavigationBar.tsx
import { FC } from "react";
import { Link } from "react-router-dom";

interface NavigationBarProps {
  isAdmin: boolean; // 관리자인지 여부를 나타내는 prop
}

const NavigationBar: FC<NavigationBarProps> = ({ isAdmin }) => {
  return (
    <nav className="p-4 bg-gray-200 shadow">
      <ul className="flex justify-center space-x-6">
        {isAdmin ? (
          <>
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                홈
              </Link>
            </li>
            <li>
              <Link
                to="/admin/books"
                className="text-gray-700 hover:text-blue-600"
              >
                도서 관리
              </Link>
            </li>
            <li>
              <Link
                to="/admin/robots"
                className="text-gray-700 hover:text-blue-600"
              >
                로봇 관리
              </Link>
            </li>
            <li>
              <Link
                to="/admin/collection"
                className="text-gray-700 hover:text-blue-600"
              >
                회수 현황
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                홈
              </Link>
            </li>
            <li>
              <Link
                to="/mybookshelf"
                className="text-gray-700 hover:text-blue-600"
              >
                내 책장
              </Link>
            </li>
            <li>
              <Link to="/barcode" className="text-gray-700 hover:text-blue-600">
                바코드
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">
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
