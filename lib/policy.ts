export type RiskLevel = 'GREEN' | 'YELLOW' | 'RED';

export type PolicyDecision = {
  risk: RiskLevel;
  allowed: boolean;
  requiresApproval: boolean;
  reason: string;
};

export function classifyAction(action: string): RiskLevel {
  const text = action.toLowerCase();

  const red = [
    'move money',
    'send money',
    'purchase',
    'buy ',
    'delete account',
    'change password',
    'grant permission',
    'sign contract',
    'trade ',
  ];
  if (red.some((term) => text.includes(term))) return 'RED';

  const yellow = [
    'send email',
    'publish',
    'post ',
    'schedule post',
    'deploy',
    'edit website',
    'reply to customer',
    'create calendar event',
  ];
  if (yellow.some((term) => text.includes(term))) return 'YELLOW';

  return 'GREEN';
}

export function evaluatePolicy(
  action: string,
  autopilot: boolean,
  yellowAllowed = false,
): PolicyDecision {
  const risk = classifyAction(action);

  if (risk === 'RED') {
    return {
      risk,
      allowed: false,
      requiresApproval: true,
      reason: 'RED actions always require explicit user approval.',
    };
  }

  if (risk === 'YELLOW') {
    const allowed = autopilot && yellowAllowed;
    return {
      risk,
      allowed,
      requiresApproval: !allowed,
      reason: allowed
        ? 'Allowed by the user’s configurable YELLOW policy.'
        : 'YELLOW actions are held for approval unless explicitly allowed.',
    };
  }

  return {
    risk,
    allowed: autopilot,
    requiresApproval: false,
    reason: autopilot
      ? 'GREEN action is allowed under Autopilot.'
      : 'Autopilot is off, so execution is paused.',
  };
}
