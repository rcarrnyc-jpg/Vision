import OpenAI from 'openai';

export type JJOpenAIResult = {
  provider: 'openai';
  model: string;
  text: string;
};

export function hasOpenAIConnection() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function askOpenAI(input: string): Promise<JJOpenAIResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || 'gpt-5.6';

  const response = await client.responses.create({
    model,
    input: [
      {
        role: 'developer',
        content: [
          {
            type: 'input_text',
            text: [
              'You are the OpenAI reasoning partner inside CODE JJ.',
              'CODE JJ is a consent-based autonomous operating system.',
              'Help analyze goals, produce plans, verify agent work, and generate useful drafts.',
              'Never claim an external action was completed unless CODE JJ explicitly provides a verified tool result.',
              'When an action could affect an external account, distinguish planning from execution.',
            ].join(' '),
          },
        ],
      },
      {
        role: 'user',
        content: [{ type: 'input_text', text: input }],
      },
    ],
  });

  return {
    provider: 'openai',
    model,
    text: response.output_text,
  };
}
