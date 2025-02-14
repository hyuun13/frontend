import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { motion, AnimatePresence } from "framer-motion";
import { Book, User, CheckCircle, AlertCircle } from "lucide-react";

const calculateReturnDate = () => {
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 14);
  return returnDate.toISOString().split("T")[0];
};

// 🔹 Polling function for book & user fetching
async function pollData<T>(
  fetchFunction: () => Promise<T | null>,
  onSuccess: (data: T) => void,
  onTimeout: () => void,
  timeout: number = 10000,
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
  const rawRobotId = searchParams.get("robotId");
  const robotIdMatch = rawRobotId?.match(/(\d+)$/);
  const robotId = robotIdMatch ? Number(robotIdMatch[1]) : NaN;

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const [bookInfo, setBookInfo] = useState<BookCardVertical | null>(null);
  const [bookLoaded, setBookLoaded] = useState(false);

  const [userInfo, setUserInfo] = useState<any>(null);
  const [borrowResult, setBorrowResult] = useState<{
    message: string;
    status: string;
    returnDate?: string;
  } | null>(null);

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

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage(null);
        resetProcess();
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (userInfo) {
      setCurrentStep(2);
    }
  }, [userInfo]);

  const resetProcess = () => {
    setCurrentStep(0);
    setBookInfo(null);
    setBookLoaded(false); // Reset bookLoaded to false
    setUserInfo(null);
    setBorrowResult(null);
    setErrorMessage(null);
  };

  // 🔹 Fetch Book Info with Polling
  const handleBookRecognition = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    await pollData(
      () => fetchBookInfoFront({ robotId }),
      async (book) => {
        let enrichedBook = mapToBookCardVertical(book);
        enrichedBook = await fillBookDetailsNaver(enrichedBook);

        if (isBookCardVertical(enrichedBook)) {
          // Update both bookInfo and currentStep together
          setBookInfo(enrichedBook);
          setBookLoaded(true);
          setCurrentStep(1);
        } else {
          setErrorMessage("도서 정보가 올바르지 않습니다.");
        }
      },
      () =>
        setErrorMessage(
          "도서 정보를 가져오는 데 실패했습니다. 다시 시도해주세요."
        )
    ).finally(() => setIsLoading(false));
  };

  // 🔹 Fetch User Info with Polling
  const handleMemberRecognition = async () => {
    setIsLoading(true);
    setLoadingMessage("회원 QR코드를 카메라에 인식해주십시오.");
    setErrorMessage(null);

    await pollData(
      () => fetchUserInfoService({ robotId }),
      (user) => {
        setUserInfo(user);
        setCurrentStep(2);
      },
      () => setErrorMessage("회원 정보를 가져오는 데 실패했습니다.")
    ).finally(() => {
      setIsLoading(false);
      setLoadingMessage(null);
    });
  };

  // 🔹 Borrow Book
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

      if (result?.isDone) {
        setBorrowResult({
          message: "대출이 완료되었습니다.",
          status: "success",
          returnDate: calculateReturnDate(),
        });
      } else {
        setBorrowResult({
          message: result?.message || "대출이 불가합니다.",
          status: "error",
        });
      }

      setCurrentStep(3);
    } catch {
      setErrorMessage("대출 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl aspect-[6/3.4] flex flex-col items-center justify-between p-8 bg-snow rounded-2xl"
      >
        <div className="w-full">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center flex-grow text-center"
          >
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
                {loadingMessage && (
                  <h1 className="text-2xl font-bold text-gray-800">
                    {loadingMessage}
                  </h1>
                )}
              </div>
            ) : errorMessage ? (
              <div className="flex items-center space-x-2 text-orange">
                <AlertCircle size={24} />
                <h1 className="text-2xl font-bold">{errorMessage}</h1>
              </div>
            ) : currentStep === 1 && bookInfo ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-lg">
                <div className="w-32 sm:w-48 md:w-56 lg:w-64 aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={bookInfo.coverImageUrl || "/placeholder.svg"}
                    alt={bookInfo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  {bookInfo.status === "대출 가능" ? (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                      『{bookInfo.title}』을 <br />
                      대출하시겠습니까?
                    </h2>
                  ) : (
                    <div className="flex items-center gap-2 text-orange">
                      <AlertCircle size={24} />
                      <p className="text-xl font-semibold">
                        {bookInfo.status}인 도서입니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : currentStep === 2 && userInfo ? (
              <div className="flex flex-col items-center space-y-4">
                <User size={48} className="text-orange" />
                {userInfo.userStatus === "대출 가능" ? (
                  <p className="text-3xl font-bold text-gray-800">
                    {userInfo.userName}님, <br />
                    대출하시겠습니까?
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-gray-800">
                    {userInfo.userName}님, <br />
                    {userInfo.userStatus}
                  </p>
                )}
              </div>
            ) : currentStep === 3 && borrowResult ? (
              <div className="flex flex-col items-center space-y-4">
                {borrowResult.status === "success" ? (
                  <CheckCircle size={48} className="text-blue" />
                ) : (
                  <AlertCircle size={48} className="text-orange" />
                )}
                <p
                  className={`text-3xl font-bold ${
                    borrowResult.status === "success"
                      ? "text-blue"
                      : "text-orange"
                  }`}
                >
                  {borrowResult.message}
                </p>
                {borrowResult.status === "success" && (
                  <p className="text-xl text-gray-600">
                    반납 예정일 {borrowResult.returnDate}
                  </p>
                )}
              </div>
            ) : currentStep === 0 && !bookLoaded ? (
              <div className="flex flex-col items-center space-y-4">
                <Book size={48} className="text-orange" />
                <h1 className="text-3xl font-bold text-gray-800">
                  대출하실 도서를 <br />한 권씩 올려 주세요.
                </h1>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div
          className={`w-full flex ${
            currentStep === 0 ? "justify-center" : "justify-between"
          }`}
        >
          {currentStep > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetProcess}
              className="px-6 py-3 text-lg font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
            >
              처음으로
            </motion.button>
          )}

          {!isLoading && currentStep < 3 && (
            <>
              {currentStep === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookRecognition}
                  className="px-6 py-3 text-lg font-semibold text-white bg-orange rounded-lg hover:bg-orange-hover transition-colors"
                >
                  대출하기
                </motion.button>
              )}

              {currentStep === 1 && bookInfo?.status === "대출 가능" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMemberRecognition}
                  className="px-6 py-3 text-lg font-semibold text-white bg-orange rounded-lg hover:bg-orange-hover transition-colors"
                >
                  대출하기
                </motion.button>
              )}

              {currentStep === 2 && userInfo?.userStatus === "대출 가능" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBorrow}
                  className="px-6 py-3 text-lg font-semibold text-white bg-orange rounded-lg hover:bg-orange-hover transition-colors"
                >
                  대출하기
                </motion.button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
