// src/pages/auth/SignUp.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  userDupCheckService,
  userSendCodeService,
  userCheckCodeService,
  userSignUpService,
} from "../../services/userService";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // 이메일 관련 상태
  const [userEmail, setUserEmail] = useState("");
  const [emailDupOk, setEmailDupOk] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);

  // 나머지 회원 정보
  const [userName, setUserName] = useState("");
  const [userBirth, setUserBirth] = useState("");
  const [userLoginId, setUserLoginId] = useState("");
  const [idDupOk, setIdDupOk] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 메시지 및 로딩 상태
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. 이메일 중복 확인 및 인증번호 발송
  const handleEmailCheckAndSend = async () => {
    setLoading(true);
    setErrorMessage(null);
    setResultMessage(null);
    try {
      // 이메일 중복 체크 (action: "email")
      const dupResponse = await userDupCheckService({
        targetString: userEmail,
        action: "email",
      });
      if (dupResponse && dupResponse.isDone) {
        // 중복이 아니라면 dupResponse.isDone === true (또는 false일 수 있는데, API 설계에 따라 판단)
        setEmailDupOk(true);
        // 중복이 아니면 인증번호 발송
        const sendResponse = await userSendCodeService({ userEmail });
        if (sendResponse && sendResponse.isDone) {
          setVerificationSent(true);
          setResultMessage("인증번호가 발송되었습니다. 이메일을 확인하세요.");
        } else {
          setErrorMessage("인증번호 발송에 실패했습니다.");
          setEmailDupOk(false);
        }
      } else {
        setErrorMessage("중복된 이메일입니다. 다른 이메일을 사용해주세요.");
      }
    } catch (error) {
      console.error("이메일 중복/발송 오류:", error);
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 2. 인증번호 확인
  const handleVerifyCode = async () => {
    setLoading(true);
    setErrorMessage(null);
    setResultMessage(null);
    try {
      const checkResponse = await userCheckCodeService({
        userEmail,
        certNumber: Number(verificationCode),
      });
      if (checkResponse && checkResponse.isDone) {
        setCodeVerified(true);
        setResultMessage("인증번호 확인 완료.");
      } else {
        setErrorMessage("잘못된 인증번호입니다.");
      }
    } catch (error) {
      console.error("인증번호 확인 오류:", error);
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 3. 아이디 중복 확인 (action: "id")
  const handleIdDupCheck = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const dupResponse = await userDupCheckService({
        targetString: userLoginId,
        action: "id",
      });
      if (dupResponse && dupResponse.isDone) {
        setIdDupOk(true);
        setResultMessage("사용 가능한 아이디입니다.");
      } else {
        setErrorMessage("중복된 아이디입니다. 다른 아이디를 선택해주세요.");
      }
    } catch (error) {
      console.error("아이디 중복 체크 오류:", error);
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 4. 최종 회원가입 처리
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // 추가 검증: 인증번호 확인, 아이디 중복 체크, 비밀번호 일치 여부
    if (!codeVerified) {
      setErrorMessage("먼저 이메일 인증을 완료해주세요.");
      return;
    }
    if (!idDupOk) {
      setErrorMessage("아이디 중복 확인을 해주세요.");
      return;
    }
    if (userPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setResultMessage(null);
    try {
      const response = await userSignUpService({
        userLoginId,
        userPassword,
        userName,
        userEmail,
        userBirth,
      });
      if (response && response.isDone) {
        setResultMessage(
          "회원가입에 성공했습니다. 로그인 페이지로 이동합니다."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">회원가입</h2>
        {errorMessage && (
          <div className="text-center text-red-500">{errorMessage}</div>
        )}
        {resultMessage && (
          <div className="text-center text-green-500">{resultMessage}</div>
        )}
        {/* 이메일 입력 및 중복 확인 / 인증번호 발송 */}
        {!emailDupOk ? (
          <div className="space-y-2">
            <label htmlFor="userEmail" className="block font-medium">
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
            <button
              type="button"
              onClick={handleEmailCheckAndSend}
              className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              disabled={loading || !userEmail}
            >
              {loading ? "처리 중..." : "이메일 중복 확인 및 인증번호 발송"}
            </button>
          </div>
        ) : (
          // 이메일 중복, 인증번호 발송이 완료되면 이메일 필드는 고정됨.
          <div className="space-y-2">
            <label className="block font-medium">이메일 (수정 불가)</label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
            />
          </div>
        )}

        {/* 인증번호 확인 */}
        {verificationSent && !codeVerified && (
          <div className="space-y-2">
            <label htmlFor="verificationCode" className="block font-medium">
              인증번호
            </label>
            <input
              type="text"
              id="verificationCode"
              className="w-full p-2 border border-gray-300 rounded"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              className="w-full p-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              disabled={loading || !verificationCode}
            >
              {loading ? "확인 중..." : "인증번호 확인"}
            </button>
          </div>
        )}

        {/* 추가 회원 정보 입력 : 이메일 인증 완료되면 표시 */}
        {codeVerified && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="userName" className="block font-medium">
                이름
              </label>
              <input
                type="text"
                id="userName"
                className="w-full p-2 border border-gray-300 rounded"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="userBirth" className="block font-medium">
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
            <div className="space-y-2">
              <label htmlFor="userLoginId" className="block font-medium">
                아이디
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="userLoginId"
                  className="flex-grow p-2 border border-gray-300 rounded-l"
                  value={userLoginId}
                  onChange={(e) => {
                    setUserLoginId(e.target.value);
                    setIdDupOk(false);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={handleIdDupCheck}
                  className="px-4 text-white bg-indigo-500 rounded-r hover:bg-indigo-600"
                  disabled={loading || !userLoginId}
                >
                  중복 확인
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="userPassword" className="block font-medium">
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
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block font-medium">
                비밀번호 재입력
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-2 border border-gray-300 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "회원가입 진행 중..." : "회원가입"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
