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

    // Build the request body
    const requestBody = {
      model,
      max_tokens: body.max_tokens || 16000,
      messages: [{ role: "user", content: prompt }]
    };

    // Add system prompt if provided — this sets Claude's persona and
    // persistent instructions more effectively than putting them in the user message
    if (body.systemPrompt) {
      requestBody.system = body.systemPrompt;
    }

    if (useWebSearch) {
      requestBody.tools = [{
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 5
      }];
    }

    console.log(`[invokeClaude] model=${model} useWebSearch=${useWebSearch} promptLength=${prompt.length} hasSystem=${!!body.systemPrompt}`);

    // Only include beta header when web search is actually enabled
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    };
    if (useWebSearch) {
      headers["anthropic-beta"] = "web-search-2025-03-05";
    }

    // Retry logic — up to 2 retries for transient failures
    let lastError = null;
    const MAX_RETRIES = 2;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
          const errMsg = data.error?.message || JSON.stringify(data);
          console.error(`[invokeClaude] Claude API ${response.status}: ${errMsg} (attempt ${attempt + 1})`);

          // Retry on 429 (rate limit), 529 (overloaded), or 500 (server error)
          if ([429, 529, 500].includes(response.status) && attempt < MAX_RETRIES) {
            const delay = response.status === 429 ? 15000 : 5000;
            console.log(`[invokeClaude] Retrying in ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
            continue;
          }

          return Response.json({ error: `Claude API ${response.status}: ${errMsg}` }, { status: response.status });
        }

        if (!data.content || !data.content[0]) {
          console.error('[invokeClaude] No content in Claude response:', JSON.stringify(data));
          return Response.json({ error: 'No response from Claude' }, { status: 500 });
        }

        const textBlocks = data.content.filter(b => b.type === "text");
        const resultText = textBlocks.length > 0
          ? textBlocks.map(b => b.text).join("\n\n")
          : data.content[0].text;

        console.log(`[invokeClaude] success stop_reason=${data.stop_reason} resultLength=${resultText?.length} attempt=${attempt + 1}`);

        // Warn if output was truncated
        if (data.stop_reason === "max_tokens") {
          console.warn(`[invokeClaude] WARNING: Response was truncated at max_tokens (${requestBody.max_tokens})`);
        }

        return Response.json({
          result: resultText,
          stop_reason: data.stop_reason,
          usage: data.usage
        });

      } catch (fetchError) {
        lastError = fetchError;
        console.error(`[invokeClaude] Network error attempt ${attempt + 1}:`, fetchError.message);
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 5000));
          continue;
        }
      }
    }

    // All retries exhausted
    return Response.json({ error: lastError?.message || "All retry attempts failed" }, { status: 500 });

  } catch (error) {
    console.error('[invokeClaude] exception:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});