import { NextResponse } from 'next/server';
import { decomposeGoal } from '@/lib/simulator';
import { askOpenAI, hasOpenAIConnection } from '@/lib/ai/openai-bridge';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { goal?: string; autopilot?: boolean } | null;
  const goal = body?.goal?.trim();

  if (!goal) {
    return NextResponse.json({ error: 'A goal is required.' }, { status: 400 });
  }

  const tasks = decomposeGoal(goal);

  if (!hasOpenAIConnection()) {
    return NextResponse.json({
      mode: 'SIMULATION',
      openaiConnected: false,
      autopilot: Boolean(body?.autopilot),
      tasks,
      executiveInsight: 'OpenAI is not connected yet, so CODE JJ used its local simulation planner.',
    });
  }

  try {
    const result = await askOpenAI(
      `CODE JJ received this goal: "${goal}". Review the goal and give the Executive Agent a concise strategy, key risks, and the single best next move. Do not claim any external action was performed.`,
    );

    return NextResponse.json({
      mode: 'OPENAI_ASSISTED',
      openaiConnected: true,
      autopilot: Boolean(body?.autopilot),
      tasks,
      executiveInsight: result.text,
      model: result.model,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OpenAI request failed.';
    return NextResponse.json({
      mode: 'SIMULATION_FALLBACK',
      openaiConnected: true,
      autopilot: Boolean(body?.autopilot),
      tasks,
      executiveInsight: `OpenAI was configured but the request failed, so CODE JJ fell back to local planning. ${message}`,
    });
  }
}
