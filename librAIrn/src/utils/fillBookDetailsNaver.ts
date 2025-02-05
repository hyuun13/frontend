// src/utils/fillBookDetails.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { BookBase } from "../types/book";
import { getNaverBookInfo } from "./getNaverBookInfo";
import { formatTitle } from "./formatters";
/**
 * 주어진 Partial<T> (T extends BookBase) 객체의 누락된 정보를,
 * ISBN을 기준으로 Kakao Book API를 호출하여 보충한 후,
 * 최종 T 타입의 객체를 반환하는 함수입니다.
 *
 * @param bookData - 백엔드에서 받아온 Partial<T> 타입의 책 정보
 * @returns 누락된 정보가 보충된 T 타입의 책 정보 객체
 */
export const fillBookDetailsNaver = async <T extends BookBase>(
  bookData: Partial<T>
): Promise<T> => {
  const data = { ...bookData } as Record<string, any>;

  if (data.isbn) {
    const naverData = await getNaverBookInfo(data.isbn);
    if (naverData) {
      data.coverImageUrl = naverData.image;
      data.title = formatTitle(naverData.title);
      data.writer = naverData.author;
      data.publisher = naverData.publisher;
      data.description = naverData.description;
      data.publishDate = naverData.pubdate;
    }
  }
  return { ...data } as T;
};
