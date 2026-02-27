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

    const model = body.model || "claude-sonnet-4-6";
    const useWebSearch = body.add_context_from_internet === true;

    const requestBody = {
      model,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    };

    // Enable web search tool for phases that need live internet data (e.g. Phase 3.5)
    if (useWebSearch) {
      requestBody.tools = [{
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 5
      }];
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05"
      },
      body: JSON.stringify(requestBody)
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