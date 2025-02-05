// src/pages/admin/NotificationPage.tsx
import { FC, useState, useEffect } from "react";
import NotificationPanel from "../../components/admin/NotificationPanel";
import type { Notice } from "../../types/notice";
import {
  fetchNoticeList,
  deleteNoticeService,
} from "../../services/noticeService";

const NotificationPage: FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 알림 목록을 로드하는 함수
  const loadNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNoticeList();
      if (res?.noticeList) {
        // NoticeDto를 types/notice.ts의 Notice 모델로 변환
        const transformed: Notice[] = res.noticeList.map((n) => ({
          id: n.noticeId ?? 0,
          createdAt: n.noticeCreatedAt || "",
          status: n.noticeStatus ?? false,
          type: n.noticeType || "",
          content: n.noticeContent || "",
          robotId: n.robotId,
        }));
        setNotices(transformed);
      } else {
        setError("알림 정보를 불러오지 못했습니다.");
      }
    } catch (e) {
      console.error("알림 조회 실패:", e);
      setError("알림 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // 개별 알림 삭제 처리
  const handleDelete = async (noticeId: number) => {
    if (!window.confirm("해당 알림을 삭제하시겠습니까?")) return;
    try {
      const res = await deleteNoticeService({ noticeId });
      if (res && res.isDone) {
        alert("알림이 삭제되었습니다.");
        // 삭제된 알림은 상태에서 제거
        setNotices((prev) => prev.filter((notice) => notice.id !== noticeId));
      } else {
        alert("알림 삭제에 실패했습니다.");
      }
    } catch (e) {
      console.error("알림 삭제 실패:", e);
      alert("알림 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="container px-4 mx-auto">
        <h2 className="mb-6 text-3xl font-bold">알림</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : notices.length === 0 ? (
          <p>알림이 없습니다.</p>
        ) : (
          <NotificationPanel notices={notices} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
