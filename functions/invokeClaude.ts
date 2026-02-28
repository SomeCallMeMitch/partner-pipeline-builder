import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
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
      max_tokens: 10000,
      messages: [{ role: "user", content: prompt }]
    };

    if (useWebSearch) {
      requestBody.tools = [{
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 5
      }];
    }

    console.log(`[invokeClaude] model=${model} useWebSearch=${useWebSearch} promptLength=${prompt.length}`);

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
      const errMsg = data.error?.message || JSON.stringify(data);
      console.error(`[invokeClaude] Claude API ${response.status}: ${errMsg}`);
      return Response.json({ error: `Claude API ${response.status}: ${errMsg}` }, { status: response.status });
    }

    if (!data.content || !data.content[0]) {
      console.error('[invokeClaude] No content in Claude response:', JSON.stringify(data));
      return Response.json({ error: 'No response from Claude' }, { status: 500 });
    }

    const textBlocks = data.content.filter(b => b.type === "text");
    const resultText = textBlocks.length > 0
      ? textBlocks[textBlocks.length - 1].text
      : data.content[0].text;

    console.log(`[invokeClaude] success stop_reason=${data.stop_reason} resultLength=${resultText?.length}`);

    return Response.json({ result: resultText });
  } catch (error) {
    console.error('[invokeClaude] exception:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});