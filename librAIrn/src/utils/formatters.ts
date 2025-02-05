// src/utils/formatters.ts
export const formatDate = (dateString: string): string => {
  try {
    // ISO 날짜 문자열인 경우
    if (dateString.includes("T") || dateString.includes("-")) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    }

    // "YYYYMMDD" 형식인 경우
    if (dateString.length === 8) {
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);
      return `${year}.${month}.${day}`;
    }

    return dateString; // 지원하지 않는 형식인 경우 원본 반환
  } catch (error) {
    console.error("날짜 포맷팅 실패:", error);
    return dateString;
  }
};
export const formatTitle = (title: string): string => {
  // 첫 번째 괄호가 나오는 위치를 찾음
  const bracketIndex = title.indexOf("(");

  // 괄호가 없으면 원본 제목 반환
  if (bracketIndex === -1) return title;

  // 괄호 이전까지의 문자열을 반환하고 앞뒤 공백 제거
  return title.substring(0, bracketIndex).trim();
};
