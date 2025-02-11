// src/pages/admin/BookRegistration.tsx
import { FC, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { updateBookService } from "../../services/bookService";
import type { BookUpdateRequestDto } from "../../backapi/data-contracts";

const BookRegistration: FC = () => {
  const navigate = useNavigate();

  // 각 입력값 상태
  const [bookId, setBookId] = useState<string>(""); // 책 바코드 입력 필드 추가
  const [bookIsbn, setBookIsbn] = useState<string>("");
  const [bookTitle, setBookTitle] = useState<string>("");
  const [bookWriter, setBookWriter] = useState<string>("");
  const [bookPublisher, setBookPublisher] = useState<string>("");
  const [bookStatus, setBookStatus] = useState<number>(1); // 기본값 1 (대출 가능)
  const [bookSign, setBookSign] = useState<string>("");
  const [arriveZoneName, setArriveZoneName] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 각 입력값 변경 핸들러
  const handleBookIdChange = (e: ChangeEvent<HTMLInputElement>) =>
    setBookId(e.target.value);
  const handleIsbnChange = (e: ChangeEvent<HTMLInputElement>) =>
    setBookIsbn(e.target.value);
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setBookTitle(e.target.value);
  const handleWriterChange = (e: ChangeEvent<HTMLInputElement>) =>
    setBookWriter(e.target.value);
  const handlePublisherChange = (e: ChangeEvent<HTMLInputElement>) =>
    setBookPublisher(e.target.value);
  // 콤보박스 변경 핸들러: value는 숫자형 문자열로 오므로 Number() 변환
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setBookStatus(Number(e.target.value));
  const handleSignChange = (e: ChangeEvent<HTMLInputElement>) =>
    setBookSign(e.target.value);
  const handleArriveZoneChange = (e: ChangeEvent<HTMLInputElement>) =>
    setArriveZoneName(e.target.value);

  // 폼 제출 핸들러: 도서 등록 시 bookId(바코드)도 입력받음
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 필수 항목 체크: 책 바코드(bookId), ISBN, 제목은 필수
    if (
      !bookId.trim() ||
      !bookIsbn.trim() ||
      !bookTitle.trim() ||
      !bookWriter.trim() ||
      !bookPublisher.trim()
    ) {
      setError("책 바코드, ISBN과 제목, 저자, 출판사는 필수 항목입니다.");
      return;
    }
    setError(null);
    setLoading(true);

    const payload: BookUpdateRequestDto = {
      bookId, // 책 바코드를 payload에 포함합니다.
      bookIsbn,
      bookTitle,
      bookWriter,
      bookPublisher,
      bookStatus,
      bookSign,
      arriveZoneName,
      action: 0, // 0은 신규 등록
    };

    try {
      const res = await updateBookService(payload);
      if (res && res.isDone) {
        alert("도서 등록이 완료되었습니다.");
        navigate("/"); // 등록 후 목록 페이지 등 원하는 경로로 이동
      } else {
        setError("도서 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("도서 등록 중 오류:", error);
      setError("도서 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-snow">
      <div className="container max-w-lg px-4 mx-auto">
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="p-6 rounded shadow bg-snow">
          {/* 책 바코드 입력 필드 */}
          <div className="mb-4">
            <label className="block mb-1 text-lg font-bold" htmlFor="bookId">
              책 바코드
            </label>
            <input
              type="text"
              id="bookId"
              value={bookId}
              onChange={handleBookIdChange}
              placeholder="책 바코드를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-lg font-bold" htmlFor="bookIsbn">
              ISBN
            </label>
            <input
              type="text"
              id="bookIsbn"
              value={bookIsbn}
              onChange={handleIsbnChange}
              placeholder="책 ISBN"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-lg font-bold" htmlFor="bookTitle">
              제목
            </label>
            <input
              type="text"
              id="bookTitle"
              value={bookTitle}
              onChange={handleTitleChange}
              placeholder="책 제목"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-1 text-lg font-bold"
              htmlFor="bookWriter"
            >
              작가
            </label>
            <input
              type="text"
              id="bookWriter"
              value={bookWriter}
              onChange={handleWriterChange}
              placeholder="책 작가"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-1 text-lg font-bold"
              htmlFor="bookPublisher"
            >
              출판사
            </label>
            <input
              type="text"
              id="bookPublisher"
              value={bookPublisher}
              onChange={handlePublisherChange}
              placeholder="출판사"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {/* 상태 콤보박스 */}
          <div className="mb-4">
            <label
              className="block mb-1 text-lg font-bold"
              htmlFor="bookStatus"
            >
              상태
            </label>
            <select
              id="bookStatus"
              value={bookStatus}
              onChange={handleStatusChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value={0}>대출 중</option>
              <option value={1}>대출 가능</option>
              <option value={2}>미보유</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-lg font-bold" htmlFor="bookSign">
              청구기호
            </label>
            <input
              type="text"
              id="bookSign"
              value={bookSign}
              onChange={handleSignChange}
              placeholder="청구기호"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-6">
            <label
              className="block mb-1 text-lg font-bold"
              htmlFor="arriveZoneName"
            >
              회수 구역 이름
            </label>
            <input
              type="text"
              id="arriveZoneName"
              value={arriveZoneName}
              onChange={handleArriveZoneChange}
              placeholder="회수 구역 이름"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white transition rounded bg-orange hover:bg-orange-hover"
          >
            {loading ? "등록 중..." : "도서 등록"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookRegistration;
