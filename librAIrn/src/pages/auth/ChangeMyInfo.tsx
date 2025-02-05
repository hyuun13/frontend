import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { userChangePwService } from "../../services/userService";

const ChangeMyInfo: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [userPassword, setUserPassword] = useState("");
  const [action, setAction] = useState("change"); // "repeat" 또는 "change"
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div className="mt-10 text-center">먼저 로그인 해주세요.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);
    setErrorMessage(null);

    try {
      const response = await userChangePwService({
        userId: String(user.id),
        userPassword,
        action,
      });
      if (response && response.isDone) {
        setResultMessage("정보가 성공적으로 변경되었습니다.");
        // 업데이트된 사용자 정보가 있다면 updateUser() 호출 가능
      } else {
        setErrorMessage("정보 변경에 실패했습니다.");
      }
    } catch (err) {
      console.error("정보 변경 실패:", err);
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">내 정보 변경</h2>
        {resultMessage && (
          <div className="mb-4 text-center text-green-500">{resultMessage}</div>
        )}
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userPassword" className="block mb-1">
              새 비밀번호
            </label>
            <input
              type="password"
              id="userPassword"
              className="w-full p-2 border border-gray-300 rounded"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="action" className="block mb-1">
              변경 유형
            </label>
            <select
              id="action"
              className="w-full p-2 border border-gray-300 rounded"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <option value="repeat">비밀번호 재입력</option>
              <option value="change">비밀번호 변경</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-purple-500 rounded hover:bg-purple-600"
            disabled={loading}
          >
            {loading ? "변경 중..." : "정보 변경"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeMyInfo;
