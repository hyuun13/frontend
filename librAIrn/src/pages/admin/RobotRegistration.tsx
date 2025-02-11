// src/pages/admin/RobotRegistration.tsx
import { FC, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { insertRobotService } from "../../services/robotService";
const RobotRegistration: FC = () => {
  const navigate = useNavigate();

  // 로봇 이름과 이미지 파일을 상태로 관리
  const [robotName, setRobotName] = useState<string>("");
  const [robotImage, setRobotImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 로봇 이름 변경 핸들러
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRobotName(e.target.value);
  };

  // 로봇 이미지 선택 핸들러
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setRobotImage(e.target.files[0]);
    }
  };

  // 등록 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!robotName.trim()) {
      setError("로봇 이름을 입력해주세요.");
      return;
    }
    if (!robotImage) {
      setError("로봇 이미지를 선택해주세요.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // API 호출을 위한 payload 구성
      const payload = {
        robotInsertRequestDto: {
          robotName: robotName,
        },
        robotImage: robotImage,
      };
      const res = await insertRobotService(payload);
      if (res && res.isDone) {
        alert("로봇 등록이 완료되었습니다.");
        navigate("/admin/robots");
      } else {
        setError("로봇 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("로봇 등록 실패:", err);
      setError("로봇 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen py-8 bg-snow">
        <div className="container max-w-lg px-4 mx-auto">
          <h2 className="mb-6 text-3xl font-bold text-center">로봇 추가</h2>
          <form onSubmit={handleSubmit} className="p-6 rounded shadow bg-snow">
            {error && <p className="mb-4 text-red-500">{error}</p>}
            <div className="mb-4">
              <label
                className="block mb-2 text-lg font-bold"
                htmlFor="robotName"
              >
                로봇 이름
              </label>
              <input
                id="robotName"
                type="text"
                value={robotName}
                onChange={handleNameChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="로봇 이름을 입력하세요"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-lg font-bold"
                htmlFor="robotImage"
              >
                로봇 이미지
              </label>
              <input
                id="robotImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 transition text-snow bg-primary hover:bg-accent"
            >
              {loading ? "등록 중..." : "로봇 등록"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RobotRegistration;
