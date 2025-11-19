"use client";

import { useState } from "react";
import { callOpenAI, type ChatMessage } from "./openaiClient";

/**
 * OpenAI APIの使用例コンポーネント
 * このコンポーネントは使用例として作成されています
 */
export function OpenAIExample() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "user", content: "こんにちは！" },
  ]);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSendMessage = async () => {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await callOpenAI(messages);
      const assistantMessage = result.choices[0]?.message?.content || "";

      setResponse(assistantMessage);
      setMessages([
        ...messages,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", marginTop: "16px" }}>
      <h3>OpenAI API 使用例</h3>
      <div style={{ marginBottom: "16px" }}>
        <textarea
          value={messages[messages.length - 1]?.content || ""}
          onChange={(e) =>
            setMessages([
              { role: "user", content: e.target.value },
            ])
          }
          placeholder="メッセージを入力..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "8px",
            marginBottom: "8px",
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "white",
          }}
        >
          {loading ? "送信中..." : "送信"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "8px" }}>エラー: {error}</div>
      )}

      {response && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>レスポンス:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

