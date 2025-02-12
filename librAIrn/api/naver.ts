import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { isbn } = req.query;
  if (!isbn) {
    return res.status(400).json({ error: "ISBN is required" });
  }

  try {
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/book.json",
      {
        params: { query: isbn, display: 1 },
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
        },
      }
    );

    res.status(200).json(response.data.items[0] || null);
  } catch (error) {
    console.error("네이버 책 정보 조회 실패:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
