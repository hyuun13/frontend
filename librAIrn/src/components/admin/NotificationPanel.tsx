// src/components/common/NotificationPanel.tsx
import { FC } from "react";
import type { Notice } from "../../types/notice";

export interface NotificationPanelProps {
  notices: Notice[];
  onDelete: (noticeId: number) => void;
}

const NotificationPanel: FC<NotificationPanelProps> = ({
  notices,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {notices.map((notice) => (
        <div key={notice.id} className="relative p-4 bg-white rounded shadow">
          <div>
            <p className="text-sm">{notice.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(notice.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => onDelete(notice.id)}
            className="absolute text-xl leading-none text-red-500 top-2 right-2 hover:text-red-700"
            aria-label="삭제"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
