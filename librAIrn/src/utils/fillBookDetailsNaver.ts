// src/utils/fillBookDetailsNaver.ts
import axios from "axios";
import type { DetailedBook } from "../types/book";
import { formatTitle } from "./formatters";

export const fillBookDetailsNaver = async <T extends DetailedBook>(
  bookData: Partial<T>
): Promise<T> => {
  const data = { ...bookData };

  if (!data.coverImageUrl && data.isbn) {
    try {
      const response = await axios.get(`/api/naver?isbn=${data.isbn}`);
      const naverData = response.data;

      if (naverData) {
        data.coverImageUrl = naverData.image || "";
        data.title = formatTitle(naverData.title);
        data.writer = naverData.author;
        data.publisher = naverData.publisher;
        data.description = naverData.description || "도서 소개가 없습니다.";
        data.publishDate = naverData.pubdate || "출판일 정보 없음";
      }
    } catch (error) {
      console.error("네이버 API 호출 실패:", error);
    }
  }

  return data as T;
};
