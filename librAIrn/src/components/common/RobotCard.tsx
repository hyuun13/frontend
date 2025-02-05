// src/components/common/RobotCard.tsx
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { Robot } from "../../types/robot";

interface RobotCardProps {
  robot: Robot;
}

const RobotCard: FC<RobotCardProps> = ({ robot }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // 로봇 상세페이지 경로로 이동 (예: /admin/robot/번호)
    navigate(`/admin/robot/${robot.id}`);
  };

  return (
    <div
      className="flex w-full max-w-2xl p-6 transition-shadow duration-300 ease-in-out bg-white shadow-md rounded-xl hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="flex-shrink-0 w-24 mr-6 h-30">
        {robot.imageUrl ? (
          <img
            src={robot.imageUrl}
            alt={robot.name}
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-grow">
        <h3 className="text-lg font-bold">{robot.name}</h3>
        <p className="text-sm text-gray-600">ID: {robot.id}</p>
        <p
          className={`text-sm ${
            robot.status === "대기 중"
              ? "text-blue"
              : robot.status === "작동 중"
                ? "text-blue-500"
                : robot.status === "점검 중"
                  ? "text-red-500"
                  : "text-gray-600"
          }`}
        >
          상태: {robot.status}
        </p>{" "}
      </div>
    </div>
  );
};

export default RobotCard;
