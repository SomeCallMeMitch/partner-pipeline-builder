import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    // Allow unauthenticated access — no login required
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return Response.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const apiKey = Deno.env.get("CLAUDE_THINGY");
    if (!apiKey) {
      return Response.json({ error: 'Claude API key not configured' }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Claude API error' }, { status: response.status });
    }

    if (!data.content || !data.content[0]) {
      return Response.json({ error: 'No response from Claude' }, { status: 500 });
    }

    return Response.json({ result: data.content[0].text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});