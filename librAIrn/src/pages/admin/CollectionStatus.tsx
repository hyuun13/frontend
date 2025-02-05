// src/pages/admin/CollectionStatus.tsx
import { FC, useState, useEffect } from "react";
import {
  fetchArriveZoneInfo,
  resetArriveZoneService,
} from "../../services/arriveZoneService";
import CollectionAreaCard from "../../components/admin/CollectionAreaCard";

export interface CollectionArea {
  arriveZoneId: number;
  arriveZoneName: string;
  arriveZoneBook: number;
  arriveZoneTime?: string;
}

const CollectionStatus: FC = () => {
  const [areas, setAreas] = useState<CollectionArea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchArriveZoneInfo();
      if (res && res.arriveZoneList) {
        const transformed: CollectionArea[] = res.arriveZoneList.map(
          (zone) => ({
            arriveZoneId: zone.arriveZoneId ?? 0,
            arriveZoneName: zone.arriveZoneName || "미지정 구역",
            arriveZoneBook: zone.arriveZoneBook ?? 0,
            arriveZoneTime: zone.arriveZoneTime,
          })
        );
        setAreas(transformed);
      } else {
        setError("회수 구역 정보를 불러오지 못했습니다.");
      }
    } catch (e) {
      console.error("회수 구역 조회 실패:", e);
      setError("회수 구역 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleReset = async (zoneId: number) => {
    if (!window.confirm("해당 회수 구역의 상태를 리셋하시겠습니까?")) return;
    try {
      const res = await resetArriveZoneService({ arriveZoneId: zoneId });
      if (res && res.isDone) {
        alert("회수 구역 상태가 리셋되었습니다.");
        loadAreas();
      } else {
        alert("회수 구역 상태 리셋에 실패했습니다.");
      }
    } catch (e) {
      console.error("회수 구역 리셋 실패:", e);
      alert("회수 구역 상태를 리셋하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="container px-4 mx-auto">
        {/* 페이지 제목만 표시 */}
        <h2 className="mb-6 text-3xl font-bold">회수현황</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : areas.length === 0 ? (
          <p>회수 구역 정보가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {areas.map((area) => (
              <div key={area.arriveZoneId} className="relative">
                <CollectionAreaCard
                  areaName={area.arriveZoneName}
                  bookCount={area.arriveZoneBook}
                  updateTime={area.arriveZoneTime}
                />
                <button
                  onClick={() => handleReset(area.arriveZoneId)}
                  className="absolute px-2 py-1 text-xs text-white rounded bg-primary top-2 right-2 hover:bg-accent"
                >
                  리셋
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionStatus;
