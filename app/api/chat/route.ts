import { BingResults } from '@/app/types';
import { auth } from '@/server/auth';
import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';

export const runtime = 'edge';

const openaiApiKey = process.env.OPENAI_API_KEY;
const mem0ApiKey = process.env.MEM0_API_KEY;


export const POST = async (request: Request): Promise<Response> => {
  const body = (await request.json()) as { data: BingResults; input: string };

  const user = await auth();

  if (!body.data || !body.input || !user?.user) {
    return new Response('Invalid request', { status: 400 });
  }

  if (!openaiApiKey || !mem0ApiKey) {
    console.error('Missing API keys:', {
      openaiApiKey: !!openaiApiKey,
      mem0ApiKey: !!mem0ApiKey,
    });
    return new Response('Missing API keys', { status: 500 });
  }  

  const openai = createOpenAI({
    apiKey: openaiApiKey,
  });


  const mem0Response = await fetch('https://api.mem0.ai/v1/memories/search/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${mem0ApiKey}`,
    },
    body: JSON.stringify({
      query: 'What do you know about ' + body.input,
      user_id: user?.user?.email,
    }),
  });

  if (!mem0Response.ok) {
    console.log(await mem0Response.text());
    return new Response('Error fetching memories', { status: 500 });
  }

  const memories = (await mem0Response.json()) as { memory: string }[];

  console.log(memories);

  const memString = memories.map((memory) => memory.memory).join('\n\n');

  console.log(memString);

  const messages: CoreMessage[] = [
    {
      role: 'system',
      content: `You are a search assistant that answers the user query based on search results. We already know this about the user, try to tell the user about this showing up!: ${memString}. Give answers in markdown format. the search results are ${body.data.web.results
        .map(
          (result) =>
            `${result.title}\n\n${result.description}\n\n${result.url}\n\n`
        )
        .join(' ')}`,
    },
    {
      role: 'user',
      content: body.input ?? 'No question',
    },
  ];

  const stream = await streamText({
    model: openai('gpt-4o-mini'),
    messages: messages,
  });

  return stream.toDataStreamResponse();
};
