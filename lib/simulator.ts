import { classifyAction } from './policy';

export type SimTask = {
  id: string;
  title: string;
  agent: string;
  risk: 'GREEN' | 'YELLOW' | 'RED';
  status: 'QUEUED' | 'RUNNING' | 'WAITING_APPROVAL' | 'COMPLETED';
};

const agentFor = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes('seo') || t.includes('traffic') || t.includes('search')) return 'SEO Agent';
  if (t.includes('post') || t.includes('content') || t.includes('social')) return 'Media Publisher';
  if (t.includes('code') || t.includes('website') || t.includes('deploy')) return 'Web/Code Agent';
  if (t.includes('email') || t.includes('outreach')) return 'Outreach Agent';
  return 'Research Agent';
};

export function decomposeGoal(goal: string): SimTask[] {
  const base = [
    `Research the current state of: ${goal}`,
    `Identify the highest-impact opportunities for: ${goal}`,
    `Prepare an execution plan for: ${goal}`,
    `Draft content/assets needed for: ${goal}`,
    `Publish approved work for: ${goal}`,
  ];

  return base.map((title, index) => {
    const risk = classifyAction(title);
    return {
      id: `task-${Date.now()}-${index}`,
      title,
      agent: agentFor(title),
      risk,
      status: risk === 'GREEN' ? (index < 2 ? 'COMPLETED' : 'QUEUED') : 'WAITING_APPROVAL',
    };
  });
}
