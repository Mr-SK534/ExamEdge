
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { question, context = '', reasoning = false } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

  
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'Server: OPENROUTER_API_KEY not configured' }, { status: 500 });
    }


    const messages = [
      {
        role: 'system',
        content:
          "You are a helpful exam-prep assistant. Provide clear step-by-step solutions for problems, explain mistakes, and give short final answer. If the user asks for hints only, provide hints, not full answers."
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nContext: ${context}`
      }
    ];


    const payload: any = {
      model: "x-ai/grok-4.1-fast:free",      
      messages,
      max_tokens: 1200,
      temperature: 0.2,
      
      reasoning: { enabled: Boolean(reasoning) },
    };

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
       
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json({ error: 'OpenRouter error', detail: errText }, { status: 502 });
    }

    const data = await resp.json();

 
    const assistantText =
      data?.choices?.[0]?.message?.content ??
      (typeof data?.choices?.[0]?.delta?.content === 'string' ? data.choices[0].delta.content : null) ??
      null;

    return NextResponse.json({ success: true, raw: data, answer: assistantText });
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error', detail: err.message || String(err) }, { status: 500 });
  }
}
