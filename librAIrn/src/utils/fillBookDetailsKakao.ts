import axios from "axios";
import { BookBase } from "../types/book";

export const fillBookDetailsKakao = async <T extends BookBase>(
  bookData: Partial<T>
): Promise<T> => {
  const data = { ...bookData };

  if (!data.coverImageUrl && data.isbn) {
    try {
      const response = await axios.get(`/api/kakao?isbn=${data.isbn}`);
      const kakaoData = response.data;

      if (kakaoData) {
        data.coverImageUrl = kakaoData.thumbnail;
        if (!data.title) data.title = kakaoData.title;
        if ("writer" in data) {
          data.writer = kakaoData.authors?.join(", ");
        }
      }
    } catch (error) {
      console.error("Failed to fetch book details from Kakao API:", error);
    }
  }

  return data as T;
};
