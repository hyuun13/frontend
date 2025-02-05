// src/components/common/CollectionAreaCard.tsx
import { FC } from "react";

export interface CollectionAreaCardProps {
  areaName: string;
  bookCount: number;
  updateTime?: string; // arriveZoneTime 값을 전달 받음 (ISO 포맷)
}

const CollectionAreaCard: FC<CollectionAreaCardProps> = ({
  areaName,
  bookCount,
  updateTime,
}) => (
  <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow">
    <h3 className="mb-2 text-xl font-semibold">{areaName}</h3>
    <p className="text-sm text-gray-600">도서 수: {bookCount}</p>
    {updateTime ? (
      <p className="text-sm text-gray-600">
        최근 업데이트: {new Date(updateTime).toLocaleString()}
      </p>
    ) : (
      <p className="text-sm text-gray-600">최근 업데이트 정보 없음</p>
    )}
  </div>
);

export default CollectionAreaCard;
