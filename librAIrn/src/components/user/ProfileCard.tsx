// src/components/common/ProfileCard.tsx (사용자 전용)
import { FC } from "react";

export interface ProfileCardProps {
  userName: string;
  userEmail: string;
}

const ProfileCard: FC<ProfileCardProps> = ({ userName, userEmail }) => (
  <div className="w-full max-w-sm p-4 bg-white border rounded-lg shadow">
    <h3 className="mb-2 text-xl font-semibold">{userName}</h3>
    <p className="text-sm text-gray-700">이메일: {userEmail}</p>
  </div>
);

export default ProfileCard;
