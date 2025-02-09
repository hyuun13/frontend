import React, { useState } from "react";
import { searchPasswordService } from "../../services/userService";

const FindPassword: React.FC = () => {
  const [userLoginId, setUserLoginId] = useState("");
  const [userBirth, setUserBirth] = useState("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);
    setErrorMessage(null);

    try {
      const response = await searchPasswordService({ userLoginId, userBirth });
      if (response && response.isDone) {
        setResultMessage("임시 비밀번호가 이메일로 발송되었습니다.");
      } else {
        setErrorMessage("비밀번호 찾기에 실패했습니다.");
      }
    } catch (err) {
      console.error("비밀번호 찾기 실패:", err);
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">비밀번호 찾기</h2>
        {resultMessage && (
          <div className="mb-4 text-center text-green-500">{resultMessage}</div>
        )}
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userLoginId" className="block mb-1">
              아이디
            </label>
            <input
              type="text"
              id="userLoginId"
              className="w-full p-2 border border-gray-300 rounded"
              value={userLoginId}
              onChange={(e) => setUserLoginId(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="userBirth" className="block mb-1">
              생년월일
            </label>
            <input
              type="date"
              id="userBirth"
              className="w-full p-2 border border-gray-300 rounded"
              value={userBirth}
              onChange={(e) => setUserBirth(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-orange-500 rounded hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? "요청 중..." : "비밀번호 찾기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPassword;
