import {
  BookInfoFrontData,
  UserInfoFrontData,
  BookBorrowRequestDto,
  BorrowBookData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown
> extends HttpClient<SecurityDataType> {
  /**
   * @description 프론트에서 저장된 책 정보를 요청하는 API 입니다.
   *
   * @tags book 도메인
   * @name BookInfoFront
   * @summary 저장된 도서 정보 요청
   * @request GET:/api/book
   * @response `200` `BookInfoFrontData` OK
   */
  bookInfoFront = (params: RequestParams = {}) =>
    this.request<BookInfoFrontData, any>({
      path: `/api/book`,
      method: "GET",
      ...params,
    });
  /**
   * @description 프론트에서 저장된 사용자 코드를 이용해 사용자 정보를 조회할 때 사용되는 API 입니다.
   *
   * @tags user 도메인
   * @name UserInfoFront
   * @summary 대출 사용자 정보 조회
   * @request GET:/api/user
   * @response `200` `UserInfoFrontData` OK
   */
  userInfoFront = (params: RequestParams = {}) =>
    this.request<UserInfoFrontData, any>({
      path: `/api/user`,
      method: "GET",
      ...params,
    });

  /**
   * @description 로봇에서 책을 대출할 때의 API 입니다.
   *
   * @tags book 도메인
   * @name BorrowBook
   * @summary 도서 대출
   * @request POST:/api/book/borrow
   * @response `200` `BorrowBookData` OK
   */
  borrowBook = (data: BookBorrowRequestDto, params: RequestParams = {}) =>
    this.request<BorrowBookData, any>({
      path: `/api/book/borrow`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
