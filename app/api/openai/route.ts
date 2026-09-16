import { NextResponse } from 'next/server';
import { askOpenAI, hasOpenAIConnection } from '@/lib/ai/openai-bridge';

export async function GET() {
  return NextResponse.json({
    connected: hasOpenAIConnection(),
    provider: 'OpenAI',
    mode: hasOpenAIConnection() ? 'LIVE' : 'NOT_CONFIGURED',
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { input?: string } | null;
  const input = body?.input?.trim();

  if (!input) {
    return NextResponse.json({ error: 'input is required' }, { status: 400 });
  }

  if (!hasOpenAIConnection()) {
    return NextResponse.json(
      {
        connected: false,
        error: 'OpenAI is not connected yet. Add OPENAI_API_KEY on the server to activate the live bridge.',
      },
      { status: 503 },
    );
  }

  try {
    const result = await askOpenAI(input);
    return NextResponse.json({ connected: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OpenAI request failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
