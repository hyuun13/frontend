// src/pages/admin/RobotManagement.tsx
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useRobot } from "../../hooks/useRobot";
import RobotCard from "../../components/common/RobotCard";
import Header from "../../components/common/Header";
const RobotManagement: FC = () => {
  const { robots, loading, error } = useRobot();
  const navigate = useNavigate();

  const handleAddRobot = () => {
    // 로봇 추가 페이지로 이동 (예: /admin/robots/add)
    navigate("/admin/robot/add");
  };

  return (
    <div>
      <Header></Header>
      <div className="min-h-screen py-8 bg-gray-100">
        <div className="container px-4 mx-auto">
          {/* 헤더 영역: 타이틀과 우측 상단에 추가 버튼을 flex로 정렬 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">로봇 관리</h2>
            <button
              onClick={handleAddRobot}
              className="px-4 py-2 text-white rounded bg-primary hover:bg-accent"
            >
              로봇 추가
            </button>
          </div>
          {loading && <p>로딩 중...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && robots.length === 0 && <p>등록된 로봇이 없습니다.</p>}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {robots.map((robot) => (
              <RobotCard key={robot.id} robot={robot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotManagement;
