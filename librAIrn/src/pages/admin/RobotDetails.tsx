// src/pages/admin/RobotDetail.tsx
import { FC, useState, useEffect, useRef, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchRobotList,
  fetchRobotLog,
  deleteRobotService,
  updateRobotService,
} from "../../services/robotService";
import type { Robot, RobotLog } from "../../types/robot";

const LOG_BATCH_SIZE = 20;

const RobotDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const robotId = Number(id);
  const navigate = useNavigate();

  // 로봇 기본 정보 관련 상태
  const [robot, setRobot] = useState<Robot | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");

  // 로딩/에러 상태 (로봇 정보)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 활동 로그 전체 및 표시용 상태
  const [fullLogs, setFullLogs] = useState<RobotLog[]>([]);
  const [displayedLogs, setDisplayedLogs] = useState<RobotLog[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  // 무한 스크롤을 위한 ref
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 로봇 기본 정보 로드 (전체 목록에서 robotId에 해당하는 항목 찾기)
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchRobotList();
        if (res && res.robotList && res.robotList.length > 0) {
          const found = res.robotList.find((r) => r.robotId === robotId);
          if (found) {
            const transformed = {
              id: found.robotId ?? 0,
              name: found.robotName || "Unknown Robot",
              imageUrl: found.robotImageUrl,
              status: found.robotStatus || "Unknown",
            };
            setRobot(transformed);
            setEditedName(transformed.name);
          } else {
            setError("로봇 정보를 찾지 못했습니다.");
          }
        } else {
          setError("로봇 정보를 불러오지 못했습니다.");
        }
      } catch (e) {
        console.error("로봇 상세 조회 실패:", e);
        setError("로봇 정보를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, robotId]);

  // 활동 로그 전체 로드 (fetchRobotLog 사용)
  useEffect(() => {
    if (!id) return;
    const fetchLogs = async () => {
      setLogsLoading(true);
      setLogsError(null);
      try {
        const res = await fetchRobotLog(robotId);
        if (res && res.robotLogList) {
          // 백엔드의 로그 DTO를 RobotLog 모델로 변환하고 최신순으로 정렬
          const logsData: RobotLog[] = res.robotLogList.map((log) => ({
            type: log.robotLogType || "Unknown",
            content: log.robotLogContent || "",
            createdAt: log.robotLogCreatedAt || "",
            completedAt: log.robotLogCompletedAt || undefined,
          }));
          // 내림차순 정렬 (최신 로그가 앞쪽으로 오도록)
          const sortedLogs = logsData.sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
          );
          setFullLogs(sortedLogs);
          // 초기 20개 로그만 표시
          setDisplayedLogs(sortedLogs.slice(0, LOG_BATCH_SIZE));
        } else {
          setLogsError("활동 로그를 불러오지 못했습니다.");
        }
      } catch (e) {
        console.error(`로봇 로그 조회 실패 (ID: ${robotId}):`, e);
        setLogsError("로봇 로그 조회 중 오류가 발생했습니다.");
      } finally {
        setLogsLoading(false);
      }
    };
    fetchLogs();
  }, [id, robotId]);

  // 인터섹션 옵저버 설정: observerRef 요소가 보이면 화면에 더 로드 (다음 배치 추가)
  useEffect(() => {
    if (logsLoading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // 이미 표시된 로그 갯수
        const currentLength = displayedLogs.length;
        // fullLogs에서 더 추가할 내용이 있다면
        if (currentLength < fullLogs.length) {
          const nextBatch = fullLogs.slice(
            currentLength,
            currentLength + LOG_BATCH_SIZE
          );
          setDisplayedLogs((prev) => [...prev, ...nextBatch]);
        }
      }
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [logsLoading, displayedLogs, fullLogs]);

  // 편집 모드 관련 핸들러
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (robot) {
      setEditedName(robot.name);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!robot) return;
    if (!editedName.trim()) {
      alert("로봇 이름은 빈 값이 될 수 없습니다.");
      return;
    }
    try {
      const payload = {
        robotUpdateRequestDto: {
          robotId: robot.id,
          robotName: editedName,
        },
        // 이미지 업데이트 별도 로직 미구현 → 더미 File 전달
        robotImage: new File([], "dummy.png", { type: "image/png" }),
      };
      const res = await updateRobotService(payload);
      if (res && res.isDone) {
        alert("로봇 정보가 업데이트되었습니다.");
        setRobot({ ...robot, name: editedName });
        setIsEditing(false);
      } else {
        alert("로봇 정보 업데이트에 실패했습니다.");
      }
    } catch (e) {
      console.error("로봇 업데이트 실패:", e);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 이 로봇을 삭제하시겠습니까?")) {
      try {
        const res = await deleteRobotService({ robotId });
        if (res && res.isDone) {
          alert("로봇 삭제가 완료되었습니다.");
          navigate("/admin/robots");
        } else {
          alert("로봇 삭제에 실패했습니다.");
        }
      } catch (e) {
        console.error("로봇 삭제 실패:", e);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!robot) return <p>로봇 정보가 없습니다.</p>;

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="container px-4 mx-auto">
        <h2 className="mb-6 text-3xl font-bold">로봇 상세 정보</h2>
        <div className="flex flex-col p-4 bg-white border rounded-lg shadow md:flex-row">
          {robot.imageUrl ? (
            <img
              src={robot.imageUrl}
              alt={robot.name}
              className="object-cover w-48 h-48 mb-4 mr-4 rounded md:mb-0"
            />
          ) : (
            <div className="flex items-center justify-center w-48 h-48 mb-4 mr-4 bg-gray-300 rounded md:mb-0">
              <span className="text-gray-600">No Image</span>
            </div>
          )}
          <div className="flex-1">
            {isEditing ? (
              <>
                <label className="block mb-2 text-lg font-bold">
                  로봇 이름:
                  <input
                    type="text"
                    value={editedName}
                    onChange={handleNameChange}
                    className="block w-full p-2 mt-1 border border-gray-300 rounded"
                  />
                </label>
                <div className="mt-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold">{robot.name}</h3>
                <p className="text-lg text-gray-600">ID: {robot.id}</p>
                <p className="text-lg text-gray-600">상태: {robot.status}</p>
                <div className="mt-4">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-2xl font-bold">활동 로그</h3>
          {logsLoading && displayedLogs.length === 0 ? (
            <p>활동 로그 로딩 중...</p>
          ) : logsError ? (
            <p className="text-red-500">{logsError}</p>
          ) : displayedLogs.length > 0 ? (
            <ul className="space-y-3">
              {displayedLogs.map((log, idx) => (
                <li key={idx} className="p-3 bg-white border rounded shadow">
                  <p className="text-sm font-bold">유형: {log.type}</p>
                  <p className="text-sm">내용: {log.content}</p>
                  <p className="text-xs text-gray-600">생성: {log.createdAt}</p>
                  {log.completedAt && (
                    <p className="text-xs text-gray-600">
                      완료: {log.completedAt}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>활동 로그가 없습니다.</p>
          )}
          {/* 무한 스크롤을 위한 관찰 대상 요소 */}
          <div ref={observerRef} className="h-8"></div>
          {/* 추가 배치 로딩 중 표시 (옵션) */}
          {logsLoading && displayedLogs.length > 0 && <p>추가 로딩 중...</p>}
        </div>
      </div>
    </div>
  );
};

export default RobotDetail;
