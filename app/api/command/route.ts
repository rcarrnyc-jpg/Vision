import { NextResponse } from 'next/server';
import { decomposeGoal } from '@/lib/simulator';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { goal?: string; autopilot?: boolean } | null;
  const goal = body?.goal?.trim();

  if (!goal) {
    return NextResponse.json({ error: 'A goal is required.' }, { status: 400 });
  }

  return NextResponse.json({
    mode: 'SIMULATION',
    autopilot: Boolean(body?.autopilot),
    tasks: decomposeGoal(goal),
  });
}
