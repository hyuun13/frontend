/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  ArriveZoneInfoData,
  ArriveZoneResetRequestDto,
  BookBorrowRequestDto,
  BookDeleteRequestDto,
  BookInfoData,
  BookMostData,
  BookMostListRequestDto,
  BookReturnRequestDto,
  BookUpdateRequestDto,
  BorrowBookData,
  CheckUnreadNoticeData,
  DeleteBookData,
  DeleteNoticeData,
  DeleteRobotData,
  GetBookDetailData,
  InsertRobotData,
  InsertRobotPayload,
  NoticeDeleteRequestDto,
  ResetArriveZoneData,
  ReturnBookData,
  RobotDeleteRequestDto,
  SearchBook1Data,
  SearchBookData,
  SendOtpData,
  SendOtpRequestDto,
  ShowNoticeListData,
  ShowRobotListData,
  ShowRobotLogData,
  UpdateBookData,
  UpdateRobotData,
  UpdateRobotPayload,
  UserChangePwData,
  UserChangeRequestDto,
  UserDupCheckData,
  UserDupCheckRequestDto,
  UserInfoData,
  UserLoginData,
  UserLoginRequestDto,
  UserLogoutData,
  UserLogoutRequestDto,
  UserRecordRequestDto,
  UserSearchIdData,
  UserSearchIdRequestDto,
  UserSearchPwData,
  UserSearchPwRequestDto,
  UserSignUpData,
  UserSignUpRequestDto,
  VerifyOtpData,
  VerifyOtpRequestDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 관리자가 로봇 현황 배너를 클릭하면 요청되는 API 입니다.
   *
   * @tags robot 도메인
   * @name ShowRobotList
   * @summary 로봇 리스트 조회
   * @request GET:/api/robot
   * @response `200` `ShowRobotListData` OK
   */
  showRobotList = (params: RequestParams = {}) =>
    this.request<ShowRobotListData, any>({
      path: `/api/robot`,
      method: "GET",
      ...params,
    });
  /**
   * @description 관리자가 로봇 정보를 수정할 때의 API 입니다.
   *
   * @tags robot 도메인
   * @name UpdateRobot
   * @summary 로봇 정보 수정
   * @request PUT:/api/robot
   * @response `200` `UpdateRobotData` OK
   */
  updateRobot = (data: UpdateRobotPayload, params: RequestParams = {}) =>
    this.request<UpdateRobotData, any>({
      path: `/api/robot`,
      method: "PUT",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 관리자가 로봇을 추가할 때의 API 입니다.
   *
   * @tags robot 도메인
   * @name InsertRobot
   * @summary 로봇 정보 추가
   * @request POST:/api/robot
   * @response `200` `InsertRobotData` OK
   */
  insertRobot = (data: InsertRobotPayload, params: RequestParams = {}) =>
    this.request<InsertRobotData, any>({
      path: `/api/robot`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 관리자가 로봇 정보를 삭제할 때의 API 입니다.
   *
   * @tags robot 도메인
   * @name DeleteRobot
   * @summary 로봇 정보 삭제
   * @request DELETE:/api/robot
   * @response `200` `DeleteRobotData` OK
   */
  deleteRobot = (data: RobotDeleteRequestDto, params: RequestParams = {}) =>
    this.request<DeleteRobotData, any>({
      path: `/api/robot`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 회원 가입 시에 요청되는 API 입니다.
   *
   * @tags user 도메인
   * @name UserSignUp
   * @summary 사용자 회원 가입
   * @request POST:/api/user/signup
   * @response `200` `UserSignUpData` OK
   */
  userSignUp = (data: UserSignUpRequestDto, params: RequestParams = {}) =>
    this.request<UserSignUpData, any>({
      path: `/api/user/signup`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자의 마이 페이지에서 대출 현황을 클릭했을 때 요청되는 API 입니다.
   *
   * @tags user 도메인
   * @name SearchBook
   * @summary 사용자 대출 기록 조회
   * @request POST:/api/user/search
   * @response `200` `SearchBookData` OK
   */
  searchBook = (data: UserRecordRequestDto, params: RequestParams = {}) =>
    this.request<SearchBookData, any>({
      path: `/api/user/search`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 회원가입 시에 아이디 또는 이메일의 중복 확인을 할 때 사용되는 API 입니다.
   *
   * @tags user 도메인
   * @name UserDupCheck
   * @summary 사용자 아이디/이메일 중복 확인
   * @request POST:/api/user/dupcheck
   * @response `200` `UserDupCheckData` OK
   */
  userDupCheck = (data: UserDupCheckRequestDto, params: RequestParams = {}) =>
    this.request<UserDupCheckData, any>({
      path: `/api/user/dupcheck`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 비밀번호를 찾을 때 사용되는 API 입니다.
   *
   * @tags user/auth 도메인
   * @name UserSearchPw
   * @summary 사용자 비밀번호 찾기 - 아이디, 생년월일과 연결된 이메일로 임시 비밀번호 발송
   * @request POST:/api/user/auth/searchpw
   * @response `200` `UserSearchPwData` OK
   */
  userSearchPw = (data: UserSearchPwRequestDto, params: RequestParams = {}) =>
    this.request<UserSearchPwData, any>({
      path: `/api/user/auth/searchpw`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 아이디를 찾을 때 사용되는 API 입니다.
   *
   * @tags user/auth 도메인
   * @name UserSearchId
   * @summary 사용자 아이디 찾기 - 이메일로 아이디 발송
   * @request POST:/api/user/auth/searchid
   * @response `200` `UserSearchIdData` OK
   */
  userSearchId = (data: UserSearchIdRequestDto, params: RequestParams = {}) =>
    this.request<UserSearchIdData, any>({
      path: `/api/user/auth/searchid`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 로그아웃 할 때 사용되는 API 입니다.
   *
   * @tags user/auth 도메인
   * @name UserLogout
   * @summary 사용자 로그아웃
   * @request POST:/api/user/auth/logout
   * @response `200` `UserLogoutData` OK
   */
  userLogout = (data: UserLogoutRequestDto, params: RequestParams = {}) =>
    this.request<UserLogoutData, any>({
      path: `/api/user/auth/logout`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 로그인 할 때 사용되는 API 입니다.
   *
   * @tags user/auth 도메인
   * @name UserLogin
   * @summary 사용자 로그인
   * @request POST:/api/user/auth/login
   * @response `200` `UserLoginData` OK
   */
  userLogin = (data: UserLoginRequestDto, params: RequestParams = {}) =>
    this.request<UserLoginData, any>({
      path: `/api/user/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 비밀번호를 변경할 때 사용되는 API 입니다.
   *
   * @tags user/auth 도메인
   * @name UserChangePw
   * @summary 사용자 비밀번호 변경 과정에서 비밀번호 재입력/수정
   * @request POST:/api/user/auth/change
   * @response `200` `UserChangePwData` OK
   */
  userChangePw = (data: UserChangeRequestDto, params: RequestParams = {}) =>
    this.request<UserChangePwData, any>({
      path: `/api/user/auth/change`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 회원 가입할 때, 이메일 인증 시 사용되는 API 입니다.
   *
   * @tags otp 도메인 (인증 번호 관련)
   * @name VerifyOtp
   * @summary 사용자 회원가입 시 이메일로 보낸 인증 번호 확인
   * @request POST:/api/otp/verify
   * @response `200` `VerifyOtpData` OK
   */
  verifyOtp = (data: VerifyOtpRequestDto, params: RequestParams = {}) =>
    this.request<VerifyOtpData, any>({
      path: `/api/otp/verify`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자가 회원 가입할 때, 이메일 인증 시 사용되는 API 입니다.
   *
   * @tags otp 도메인 (인증 번호 관련)
   * @name SendOtp
   * @summary 사용자 회원가입 시 이메일로 인증 번호 발송
   * @request POST:/api/otp/send
   * @response `200` `SendOtpData` OK
   */
  sendOtp = (data: SendOtpRequestDto, params: RequestParams = {}) =>
    this.request<SendOtpData, any>({
      path: `/api/otp/send`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 알림 버튼(종 모양 버튼??)을 눌렀을 때, 알림 목록을 불러오는 API 입니다.
   *
   * @tags notice 도메인
   * @name ShowNoticeList
   * @summary 알림 리스트 조회
   * @request GET:/api/notice
   * @response `200` `ShowNoticeListData` OK
   */
  showNoticeList = (params: RequestParams = {}) =>
    this.request<ShowNoticeListData, any>({
      path: `/api/notice`,
      method: "GET",
      ...params,
    });
  /**
   * @description 특정 알림의 삭제 버튼을 누르면 알림이 삭제되는 API 입니다.
   *
   * @tags notice 도메인
   * @name DeleteNotice
   * @summary 알림 삭제
   * @request POST:/api/notice
   * @response `200` `DeleteNoticeData` OK
   */
  deleteNotice = (data: NoticeDeleteRequestDto, params: RequestParams = {}) =>
    this.request<DeleteNoticeData, any>({
      path: `/api/notice`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로봇에서 책을 인식하고 정보를 보내는 API 입니다.
   *
   * @tags book 도메인
   * @name BookInfo
   * @summary 도서 정보 조회
   * @request GET:/api/book
   * @response `200` `BookInfoData` OK
   */
  bookInfo = (
    query: {
      bookId: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<BookInfoData, any>({
      path: `/api/book`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 관리자가 도서관에 책 정보를 등록/수정할 때 사용되는 API 입니다.
   *
   * @tags book 도메인
   * @name UpdateBook
   * @summary 도서 등록/도서 정보 수정
   * @request POST:/api/book
   * @response `200` `UpdateBookData` OK
   */
  updateBook = (data: BookUpdateRequestDto, params: RequestParams = {}) =>
    this.request<UpdateBookData, any>({
      path: `/api/book`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 관리자가 도서관의 책 정보를 삭제할 때 이용하는 API 입니다.
   *
   * @tags book 도메인
   * @name DeleteBook
   * @summary 도서 삭제
   * @request DELETE:/api/book
   * @response `200` `DeleteBookData` OK
   */
  deleteBook = (data: BookDeleteRequestDto, params: RequestParams = {}) =>
    this.request<DeleteBookData, any>({
      path: `/api/book`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로봇에서 책을 반납 또는 반환할 때의 API 입니다.
   *
   * @tags book 도메인
   * @name ReturnBook
   * @summary 도서 반납/반환
   * @request POST:/api/book/return
   * @response `200` `ReturnBookData` OK
   */
  returnBook = (data: BookReturnRequestDto, params: RequestParams = {}) =>
    this.request<ReturnBookData, any>({
      path: `/api/book/return`,
      method: "POST",
      body: data,
      type: ContentType.Json,
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
  /**
   * @description 관리자가 회수 현황 배너를 클릭하면 요청되는 API 입니다.
   *
   * @tags arrivezone 도메인
   * @name ArriveZoneInfo
   * @summary 회수 구역 상태 조회
   * @request GET:/api/arrivezone
   * @response `200` `ArriveZoneInfoData` OK
   */
  arriveZoneInfo = (params: RequestParams = {}) =>
    this.request<ArriveZoneInfoData, any>({
      path: `/api/arrivezone`,
      method: "GET",
      ...params,
    });
  /**
   * @description 관리자가 회수 구역에서 책을 정리한 이후에 누르는 버튼입니다.
   *
   * @tags arrivezone 도메인
   * @name ResetArriveZone
   * @summary 회수 구역 상태 리셋
   * @request POST:/api/arrivezone
   * @response `200` `ResetArriveZoneData` OK
   */
  resetArriveZone = (data: ArriveZoneResetRequestDto, params: RequestParams = {}) =>
    this.request<ResetArriveZoneData, any>({
      path: `/api/arrivezone`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로봇에서 사용자 바코드를 찍고 정보를 조회할 때 사용되는 API 입니다.
   *
   * @tags user 도메인
   * @name UserInfo
   * @summary 사용자 정보 조회
   * @request GET:/api/user
   * @response `200` `UserInfoData` OK
   */
  userInfo = (
    query: {
      userCode: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<UserInfoData, any>({
      path: `/api/user`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 로봇에서 책을 반납 또는 반환할 때의 API 입니다.
   *
   * @tags robot 도메인
   * @name ShowRobotLog
   * @summary 로봇 활동 로그 조회
   * @request GET:/api/robot/log
   * @response `200` `ShowRobotLogData` OK
   */
  showRobotLog = (
    query: {
      /** @format int32 */
      robotId: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<ShowRobotLogData, any>({
      path: `/api/robot/log`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 읽지 않은 알림이 있는지 관리자 쪽애서 주기적으로 요청하는 API 입니다.
   *
   * @tags notice 도메인
   * @name CheckUnreadNotice
   * @summary 읽지 않은 알림 개수 조회
   * @request GET:/api/notice/new
   * @response `200` `CheckUnreadNoticeData` OK
   */
  checkUnreadNotice = (params: RequestParams = {}) =>
    this.request<CheckUnreadNoticeData, any>({
      path: `/api/notice/new`,
      method: "GET",
      ...params,
    });
  /**
   * @description 사용자 또는 관리자가 도서 검색을 할 때의 API 입니다.
   *
   * @tags book 도메인
   * @name SearchBook1
   * @summary 도서 검색
   * @request GET:/api/book/search
   * @response `200` `SearchBook1Data` OK
   */
  searchBook1 = (
    query: {
      searchString: string;
      /** @format int32 */
      action: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<SearchBook1Data, any>({
      path: `/api/book/search`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 사용자 화면에서 주간/월간 대출 리스트를 띄워줄 때 사용되는 API 입니다.
   *
   * @tags book 도메인
   * @name BookMost
   * @summary 주간/월간 대출 순위 리스트
   * @request GET:/api/book/most
   * @response `200` `BookMostData` OK
   */
  bookMost = (
    query: {
      bookMostListRequestDto: BookMostListRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<BookMostData, any>({
      path: `/api/book/most`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 사용자가 도서를 클릭하면 상세 정보를 제공해주는 API 입니다.
   *
   * @tags book 도메인
   * @name GetBookDetail
   * @summary 도서 상세 정보
   * @request GET:/api/book/detail
   * @response `200` `GetBookDetailData` OK
   */
  getBookDetail = (
    query: {
      bookId: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetBookDetailData, any>({
      path: `/api/book/detail`,
      method: "GET",
      query: query,
      ...params,
    });
}
