import React, { useState } from "react";
import { userSearchIdService } from "../../services/userService";

const FindId: React.FC = () => {
  const [userEmail, setUserEmail] = useState("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);
    setErrorMessage(null);

    try {
      const response = await userSearchIdService({ userEmail });
      if (response && response.isDone) {
        setResultMessage("아이디가 성공적으로 발송되었습니다.");
      } else {
        setErrorMessage("아이디 찾기에 실패했습니다.");
      }
    } catch (err) {
      console.error("아이디 찾기 실패:", err);
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">아이디 찾기</h2>
        {resultMessage && (
          <div className="mb-4 text-center text-green-500">{resultMessage}</div>
        )}
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userEmail" className="block mb-1">
              이메일
            </label>
            <input
              type="email"
              id="userEmail"
              className="w-full p-2 border border-gray-300 rounded"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-indigo-500 rounded hover:bg-indigo-600"
            disabled={loading}
          >
            {loading ? "확인 중..." : "아이디 찾기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindId;
