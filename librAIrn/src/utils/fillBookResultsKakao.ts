// src/utils/fillBookDetailsKakao.ts - 검색 결과용
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getKakaoBookInfo } from "./getKakaoBookInfo";
import { BookBase } from "../types/book";

export const fillBookDetailsKakao = async <T extends BookBase>(
  bookData: Partial<T>
): Promise<T> => {
  const data = { ...bookData } as Record<string, any>;

  if (!data.coverImageUrl && data.isbn) {
    const kakaoData = await getKakaoBookInfo(data.isbn);
    if (kakaoData) {
      data.coverImageUrl = kakaoData.thumbnail;
      if (!data.title) data.title = kakaoData.title;
      if ("writer" in data) {
        data.writer = kakaoData.authors?.join(", ");
      }
    }
  }
  return { ...data } as T;
};
