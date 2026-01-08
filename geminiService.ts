
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  // process.env.API_KEY가 정의되어 있지 않을 경우를 대비한 안전한 접근
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
  
  if (!apiKey) {
    console.warn("API_KEY가 설정되지 않았습니다. .env.local 파일에 API_KEY=... 형식으로 입력되어 있는지 확인해주세요.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export const enrichTaskDescription = async (title: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `할 일 제목 "${title}"을 바탕으로, 해야 할 일에 대한 간결하고 실행 가능한 2문장 정도의 설명을 한국어로 작성해 주세요. 전문적이고 명확하게 작성해 주세요.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    return response.text?.trim() || "추천 내용을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 추천 생성 중 오류가 발생했습니다.";
  }
};

export const getEmojiForTask = async (title: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `할 일 제목 "${title}"에 가장 잘 어울리는 이모지 딱 하나만 출력해 주세요. 다른 텍스트는 절대 포함하지 마세요.`,
      config: {
        temperature: 0.5,
        maxOutputTokens: 10,
      },
    });
    return response.text?.trim() || "📝";
  } catch (error) {
    console.error("Emoji Gemini Error:", error);
    return "📝";
  }
};
