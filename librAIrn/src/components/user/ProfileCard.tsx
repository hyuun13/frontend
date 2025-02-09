// src/components/common/ProfileCard.tsx (사용자 전용)
import { FC } from "react";

interface ProfileCardProps {
  userName: string;
  borrowingCount: number;
  overdueCount: number;
}

const ProfileCard: FC<ProfileCardProps> = ({
  userName,
  borrowingCount,
  overdueCount,
}) => (
  <div className="w-full max-w-sm p-4 bg-white border rounded-lg shadow">
    <h3 className="mb-2 text-xl font-semibold">{userName}님, 환영합니다!</h3>
    <div className="mt-2 space-y-1">
      <p className="text-gray-700">
        대출중: <span className="font-bold text-blue">{borrowingCount}권</span>
      </p>
      <p className="text-gray-700">
        연체중: <span className="font-bold text-primary">{overdueCount}권</span>
      </p>
    </div>
  </div>
);

export default ProfileCard;
