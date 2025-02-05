// src/services/userService.ts
import { Api } from "../backapi/Api";
import type {
  UserSignUpRequestDto,
  UserSignUpResponseDto,
  UserDupCheckRequestDto,
  UserDupCheckResponseDto,
  UserCodeRequestDto,
  UserCodeResponseDto,
  UserSearchPwRequestDto,
  UserSearchPwResponseDto,
  UserSearchIdRequestDto,
  UserSearchIdResponseDto,
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserLogoutRequestDto,
  UserLogoutResponseDto,
  UserCheckCodeRequestDto,
  UserCheckCodeResponseDto,
  UserChangeRequestDto,
  UserChangeResponseDto,
} from "../backapi/data-contracts";

const api = new Api();

/** 사용자 회원가입 */
export const userSignUpService = async (
  data: UserSignUpRequestDto
): Promise<UserSignUpResponseDto | null> => {
  try {
    const response = await api.userSignUp(data);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    return null;
  }
};

/** 사용자 아이디/이메일 중복 확인 */
export const userDupCheckService = async (
  data: UserDupCheckRequestDto
): Promise<UserDupCheckResponseDto | null> => {
  try {
    const response = await api.userDupCheck(data);
    return response.data;
  } catch (error) {
    console.error("중복 확인 실패:", error);
    return null;
  }
};

/** 사용자 이메일 인증 번호 발송 */
export const userSendCodeService = async (
  data: UserCodeRequestDto
): Promise<UserCodeResponseDto | null> => {
  try {
    const response = await api.userSendCode(data);
    return response.data;
  } catch (error) {
    console.error("인증번호 발송 실패:", error);
    return null;
  }
};

/** 사용자 비밀번호 찾기 */
export const userSearchPwService = async (
  data: UserSearchPwRequestDto
): Promise<UserSearchPwResponseDto | null> => {
  try {
    const response = await api.userSearchPw(data);
    return response.data;
  } catch (error) {
    console.error("비밀번호 찾기 실패:", error);
    return null;
  }
};

/** 사용자 아이디 찾기 */
export const userSearchIdService = async (
  data: UserSearchIdRequestDto
): Promise<UserSearchIdResponseDto | null> => {
  try {
    const response = await api.userSearchId(data);
    return response.data;
  } catch (error) {
    console.error("아이디 찾기 실패:", error);
    return null;
  }
};

/** 사용자 로그인 */
export const userLoginService = async (
  data: UserLoginRequestDto
): Promise<UserLoginResponseDto | null> => {
  try {
    const response = await api.userLogin(data);
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    return null;
  }
};

/** 사용자 로그아웃 */
export const userLogoutService = async (
  data: UserLogoutRequestDto
): Promise<UserLogoutResponseDto | null> => {
  try {
    const response = await api.userLogout(data);
    return response.data;
  } catch (error) {
    console.error("로그아웃 실패:", error);
    return null;
  }
};

/** 사용자 인증 코드 확인 */
export const userCheckCodeService = async (
  data: UserCheckCodeRequestDto
): Promise<UserCheckCodeResponseDto | null> => {
  try {
    const response = await api.userCheckCode(data);
    return response.data;
  } catch (error) {
    console.error("인증 코드 확인 실패:", error);
    return null;
  }
};

/** 사용자 비밀번호 변경 */
export const userChangePwService = async (
  data: UserChangeRequestDto
): Promise<UserChangeResponseDto | null> => {
  try {
    const response = await api.userChangePw(data);
    return response.data;
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    return null;
  }
};
