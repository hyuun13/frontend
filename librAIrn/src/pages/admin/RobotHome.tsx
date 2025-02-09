// Usage example in a parent component
import { useState } from "react";
import StepIndicator from "./StepIndicator";
import {
  fetchBookInfoFront,
  borrowBookService,
} from "../../services/bookService";
import { fetchUserInfoService } from "../../services/userService";

const RobotHome = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookInfo, setBookInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  // 도서 정보 조회
  const handleFetchBookInfo = async () => {
    const payload = { robotId: 1 };
    const result = await fetchBookInfoFront(payload);
    if (result) {
      setBookInfo(result);
      nextStep();
    } else {
      alert("도서 정보를 불러오지 못했습니다.");
    }
  };

  // 사용자 정보 조회
  const handleFetchUserInfo = async () => {
    setTimeout(async () => {
      const payload = { userCode: "TEST_USER_CODE" };
      const result = await fetchUserInfoService(payload);
      if (result) {
        setUserInfo(result);
        nextStep();
      } else {
        alert("사용자 정보를 불러오지 못했습니다.");
      }
    }, 2000); // 2초 딜레이
  };

  // 대출하기
  const handleBorrowBook = async () => {
    const payload = { robotId: 1, bookId: bookInfo.id, userId: userInfo.id };
    const result = await borrowBookService(payload);
    if (result) {
      alert(`대출이 완료되었습니다! 반납 기한: ${result.dueDate}`);
      setCurrentStep(0); // 초기화
    } else {
      alert("대출에 실패했습니다.");
    }
  };

  const renderContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold">대기 화면</h2>
            <button
              onClick={handleFetchBookInfo}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              대출하기
            </button>
          </div>
        );
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold">도서 인식</h2>
            <p>도서명: {bookInfo?.title || "정보 없음"}</p>
            <p>대출 상태: {bookInfo?.status || "정보 없음"}</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={() => setCurrentStep(0)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                처음으로
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white p-2 rounded"
              >
                대출하기
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold">회원 QR 코드 인식 중...</h2>
            <p className="mt-2 text-gray-600">
              QR 코드를 카메라에 인식해주세요.
            </p>
            {handleFetchUserInfo()}
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold">회원 정보 확인</h2>
            <p>회원명: {userInfo?.name || "정보 없음"}</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={() => setCurrentStep(0)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                처음으로
              </button>
              <button
                onClick={handleBorrowBook}
                className="bg-blue-500 text-white p-2 rounded"
              >
                대출하기
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold">대출 결과</h2>
            <p>
              대출이 완료되었습니다. 반납 기한:{" "}
              {userInfo?.dueDate || "정보 없음"}
            </p>
          </div>
        );
      default:
        return <div>단계가 올바르지 않습니다.</div>;
    }
  };

  return (
    <StepIndicator
      steps={steps}
      currentStep={currentStep}
      renderContent={renderContent}
    />
  );
};

export default RobotHome;
