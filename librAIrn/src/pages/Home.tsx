// src/pages/Home.tsx
import { FC } from "react";
import Header from "../components/common/Header";
import NavigationBar from "../components/common/NavigationBar";
import BookCardVertical from "../components/common/BookCardVertical";
import SearchBarv2 from "../components/common/SearchBarv2";

const Home: FC = () => {
  // 예시 데이터: 신착 도서 목록
  const newBooks = [
    {
      id: "1",
      isbn: "9781234567890",
      title: "여수의 사랑",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3247665/32476659958.20221019142626.jpg",
      writer: "한강",
      status: "대출 가능",
      returnDate: "2024-04-01",
    },
    {
      id: "2",
      isbn: "9781234567891",
      title: "소년이 온다",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3249140/32491401626.20231004072435.jpg?type=w300",
      writer: "한강",
      status: "대출 중",
      returnDate: "2024-04-05",
    },
    {
      id: "3",
      isbn: "9781234567892",
      title: "작별하지 않는다",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3243636/32436366634.20231124160335.jpg?type=w300",
      writer: "한강",
      status: "연체 중",
      returnDate: "2024-04-10",
    },
    {
      id: "4",
      isbn: "9781234567892",
      title: "채식주의자",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3248204/32482041666.20230725121007.jpg?type=w300",
      writer: "한강",
      status: "연체 중",
      returnDate: "2024-04-10",
    },
    {
      id: "5",
      isbn: "9781234567892",
      title: "흰",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3247462/32474620790.20230411162531.jpg?type=w300",
      writer: "한강",
      status: "연체 중",
      returnDate: "2024-04-10",
    },
    {
      id: "6",
      isbn: "9781234567892",
      title: "서랍에 저녁을...",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3246312/32463129802.20230906071157.jpg?type=w300",
      writer: "한강",
      status: "연체 중",
      returnDate: "2024-04-10",
    },
  ];

  // 예시 데이터: 베스트 대출 도서 목록
  const bestBooks = [
    {
      id: "3",
      isbn: "9781234567892",
      title: "작별하지 않는다",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3243636/32436366634.20231124160335.jpg?type=w300",
      writer: "한강",
      status: "대출 중",
      returnDate: "2024-04-10",
    },
    {
      id: "4",
      isbn: "9781234567892",
      title: "채식주의자",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3248204/32482041666.20230725121007.jpg?type=w300",
      writer: "한강",
      status: "대출 중",
      returnDate: "2024-04-10",
    },
    {
      id: "5",
      isbn: "9781234567892",
      title: "흰",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3247462/32474620790.20230411162531.jpg?type=w300",
      writer: "한강",
      status: "연체 중",
      returnDate: "2024-04-10",
    },
    {
      id: "6",
      isbn: "9781234567892",
      title: "서랍에 저녁을...",
      coverImageUrl:
        "https://shopping-phinf.pstatic.net/main_3246312/32463129802.20230906071157.jpg?type=w300",
      writer: "한강",
      status: "대출 중",
      returnDate: "2024-04-10",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SearchBarv2 />
      <main className="container px-4 py-4 mx-auto">
        {/* 신착 도서 목록 섹션 (좌우 스크롤) */}
        <section className="mb-10">
          <h2 className="pb-1 mb-4 text-2xl font-semibold text-primary">
            신착 도서
          </h2>
          <div className="flex pb-4 space-x-4 overflow-x-auto">
            {newBooks.map((book) => (
              <div key={book.id} className="flex-shrink-0">
                <BookCardVertical {...book} />
              </div>
            ))}
          </div>
        </section>
        {/* 베스트 대출 도서 목록 섹션 (좌우 스크롤) */}
        <section>
          <h2 className="pb-1 mb-4 text-2xl font-semibold text-primary">
            베스트 대출 도서
          </h2>
          <div className="flex pb-4 space-x-4 overflow-x-auto">
            {bestBooks.map((book) => (
              <div key={book.id} className="flex-shrink-0">
                <BookCardVertical {...book} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
