/**
 * OpenAI APIを呼び出すクライアント側のユーティリティ
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: ChatMessage;
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * OpenAI APIを呼び出す
 * @param messages - チャットメッセージの配列
 * @param model - 使用するモデル（デフォルト: gpt-4o-mini）
 * @returns チャット完了レスポンス
 */
export async function callOpenAI(
  messages: ChatMessage[],
  model: string = "gpt-4o-mini"
): Promise<ChatCompletionResponse> {
  const response = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, model }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to call OpenAI API");
  }

  return response.json();
}

