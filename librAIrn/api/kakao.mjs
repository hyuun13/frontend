import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { isbn } = req.query;
  if (!isbn) {
    return res.status(400).json({ error: "ISBN is required" });
  }

  try {
    const response = await axios.get("https://dapi.kakao.com/v3/search/book", {
      params: { target: "isbn", query: isbn },
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` },
    });

    return res.status(200).json(response.data.documents[0] || null);
  } catch (error) {
    console.error("Kakao API 호출 실패:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
