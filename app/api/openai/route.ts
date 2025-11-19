import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POSTリクエストでOpenAI APIを呼び出す
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディからメッセージを取得
    const body = await request.json();
    const { messages, model = "gpt-4o-mini" } = body;

    // APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // メッセージの検証
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages must be an array" },
        { status: 400 }
      );
    }

    // OpenAI APIを呼び出し
    const completion = await openai.chat.completions.create({
      model,
      messages,
    });

    // レスポンスを返す
    return NextResponse.json({
      choices: completion.choices,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);

    // エラーレスポンスを返す
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

