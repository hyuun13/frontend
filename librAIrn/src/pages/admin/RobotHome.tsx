import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchRobotStatus } from "../../services/robotService";
import StepIndicator from "../../components/ui/step-indicator";
import {
  fetchBookInfoFront,
  borrowBookService,
} from "../../services/bookService";
import { fetchUserInfoService } from "../../services/userService";
import BookCardVertical from "../../components/common/BookCardVertical";
import { fillBookDetailsNaver } from "../../utils/fillBookDetailsNaver";
import { mapToBookCardVertical } from "../../utils/transformers";
import { BookBorrowRequestDto } from "../../backapi/data-contracts";
import { isBookCardVertical } from "../../utils/validators";
// 폴링 함수 개선: 타임아웃, 오류 처리, 로직 간소화
async function pollData<T>(
  fetchFunction: () => Promise<T | null>,
  onSuccess: (data: T) => void,
  onTimeout: () => void,
  timeout: number = 5000,
  interval: number = 500
): Promise<void> {
  let elapsedTime = 0;
  return new Promise<void>((resolve) => {
    const intervalId = setInterval(async () => {
      elapsedTime += interval;
      try {
        const data = await fetchFunction();
        if (data) {
          clearInterval(intervalId);
          onSuccess(data);
          resolve();
        }
      } catch (error) {
        console.error("데이터 요청 중 오류 발생:", error);
      }
      if (elapsedTime >= timeout) {
        clearInterval(intervalId);
        onTimeout();
        resolve();
      }
    }, interval);
  });
}

export default function RobotHome() {
  const [searchParams] = useSearchParams();
  // 기존: const robotId = Number(searchParams.get("robotId"));
  // 개선: 문자열 끝의 숫자를 추출하여 robotId로 사용
  const rawRobotId = searchParams.get("robotId");
  const robotIdMatch = rawRobotId?.match(/(\d+)$/);
  const robotId = robotIdMatch ? Number(robotIdMatch[1]) : NaN;

  const [robotStatus, setRobotStatus] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookInfo, setBookInfo] = useState<BookCardVertical | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [borrowResult, setBorrowResult] = useState<{
    message: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    if (isNaN(robotId)) {
      setErrorMessage("유효하지 않은 로봇 ID입니다.");
      return;
    }
    const fetchRobotData = async () => {
      try {
        const response = await fetchRobotStatus(robotId);
        setRobotStatus(response.status);
      } catch {
        setErrorMessage("로봇 상태를 불러오는 중 오류가 발생했습니다.");
      }
    };
    fetchRobotData();
  }, [robotId]);

  const steps = [
    {
      label: "대기",
      isCompleted: currentStep > 0,
      isActive: currentStep === 0,
    },
    {
      label: "도서 인식",
      isCompleted: currentStep > 1,
      isActive: currentStep === 1,
    },
    {
      label: "회원 확인",
      isCompleted: currentStep > 2,
      isActive: currentStep === 2,
    },
    {
      label: "대출 결과",
      isCompleted: currentStep === 3,
      isActive: currentStep === 3,
    },
  ];

  const handleBookRecognition = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    await pollData(
      () => fetchBookInfoFront({ robotId }),
      async (book) => {
        let enrichedBook = mapToBookCardVertical(book);
        enrichedBook = await fillBookDetailsNaver(enrichedBook);

        // 모든 필수 속성 검사 및 안전한 타입 할당
        if (isBookCardVertical(enrichedBook)) {
          setBookInfo(enrichedBook);
        } else {
          setErrorMessage("도서 정보가 올바르지 않습니다.");
        }
        setCurrentStep(1);
      },
      () => setErrorMessage("도서 정보를 가져오는 데 실패했습니다.")
    ).finally(() => setIsLoading(false));
  };

  const handleMemberRecognition = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    await pollData(
      () => fetchUserInfoService({ robotId }),
      (user) => {
        setUserInfo(user);
        setCurrentStep(2);
      },
      () => setErrorMessage("회원 정보를 가져오는 데 실패했습니다.")
    ).finally(() => setIsLoading(false));
  };

  const handleBorrow = async () => {
    if (!bookInfo || !userInfo) {
      setErrorMessage("대출에 필요한 정보가 부족합니다.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const borrowRequest: BookBorrowRequestDto = {
        bookId: bookInfo.id,
        robotId,
        userId: userInfo.userId,
      };
      const result = await borrowBookService(borrowRequest);
      setBorrowResult({
        message: result?.isDone
          ? "대출 성공!"
          : "대출 실패. 다시 시도해주세요.",
        status: result?.isDone ? "success" : "error",
      });
      setCurrentStep(3);
    } catch {
      setErrorMessage("대출 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetProcess = () => {
    setCurrentStep(0);
    setBookInfo(null);
    setUserInfo(null);
    setBorrowResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-snow">
      <div className="w-full max-w-4xl">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="p-6 rounded-lg bg-snow">
          {robotStatus && (
            <p className="mb-4 text-xl font-bold">로봇 상태: {robotStatus}</p>
          )}
          {errorMessage && (
            <div className="p-4 mb-4 text-red-600 bg-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}

          {currentStep === 0 && (
            <div className="text-center">
              <h1 className="mb-6 text-2xl font-bold">
                대출하실 도서 한 권을 리더기에 올려 주세요.
              </h1>
              {isLoading && (
                <div className="w-12 h-12 border-4 border-orange-400 rounded-full animate-spin"></div>
              )}
              <button
                onClick={handleBookRecognition}
                className="px-6 py-2 text-white bg-orange rounded-lg hover:bg-orange-hover"
                disabled={isLoading}
              >
                도서 인식 시작
              </button>
            </div>
          )}

          {currentStep === 1 && bookInfo && (
            <div className="flex">
              <img
                src={bookInfo.coverImageUrl || "/placeholder.svg"}
                alt={bookInfo.title}
                className="w-64 rounded"
              />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{bookInfo.title}</h2>
                <p>
                  {bookInfo.status === "대출 가능" ? "대출 가능" : "대출 불가"}
                </p>
                <button
                  onClick={handleMemberRecognition}
                  className="mt-4 px-4 py-2 text-white bg-orange rounded-lg"
                >
                  회원 확인
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && userInfo && (
            <div className="text-center">
              <p className="mb-4 text-xl">
                {userInfo.name}님, 대출을 진행하시겠습니까?
              </p>
              <button
                onClick={handleBorrow}
                className="px-6 py-2 text-white bg-orange rounded-lg"
              >
                대출하기
              </button>
            </div>
          )}

          {currentStep === 3 && borrowResult && (
            <div
              className={`text-center ${borrowResult.status === "success" ? "text-green-600" : "text-red-600"}`}
            >
              <p className="mb-6 text-xl">{borrowResult.message}</p>
              <button
                onClick={resetProcess}
                className="px-6 py-2 text-white bg-orange rounded-lg"
              >
                처음으로
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
