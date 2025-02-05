import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { userLoginService } from "../../services/userService";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userLoginId, setUserLoginId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await userLoginService({ userLoginId, userPassword });
      if (response && response.userId) {
        // 로그인 성공 시 AuthContext를 업데이트
        login(
          { id: Number(response.userId), name: response.userName || "Unknown" },
          "실제_토큰_값"
        );
        navigate("/");
      } else {
        setErrorMessage(
          "로그인에 실패했습니다. 입력 정보를 다시 확인해 주세요."
        );
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">로그인</h2>
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userLoginId" className="block mb-1">
              아이디 또는 이메일
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
            <label htmlFor="userPassword" className="block mb-1">
              비밀번호
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
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
