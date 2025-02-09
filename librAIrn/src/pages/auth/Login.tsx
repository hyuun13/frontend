import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginId, password);
    if (!success) {
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-peach)]">
      <div className="w-full max-w-md p-6 bg-[var(--color-white)] rounded-[var(--radius)] shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-foreground)]">
          로그인
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="loginId"
              className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1"
            >
              로그인 아이디
            </label>
            <input
              id="loginId"
              type="text"
              required
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="아이디를 입력하세요"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
