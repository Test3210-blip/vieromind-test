// API route for AI-powered journal reflection using OpenAI GPT-4o
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Handle POST requests to /api/ai-reflect
export async function POST(req: NextRequest) {
  try {
    // Parse chat messages from request body
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not set.' }, { status: 500 });
    }

    // Create OpenAI client
    const client = new OpenAI({ apiKey });

    // Forward the full chat history to OpenAI
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 200,
      temperature: 0.7
    });

    // Extract AI's message from response
    const aiMessage = response.choices?.[0]?.message?.content || 'No response from AI.';
    return NextResponse.json({ reflection: aiMessage });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
