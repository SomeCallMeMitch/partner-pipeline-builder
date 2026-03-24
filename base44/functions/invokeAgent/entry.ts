/**
 * invokeAgent — Calls the Base44 Superagent instead of Claude
 * Drop-in replacement for invokeClaude, returns same shape: { result, usage }
 */
import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { prompt, systemPrompt } = body;

    if (!prompt) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    const client = createClientFromRequest(req);

    // Combine system prompt + user prompt into a single message
    // (Base44 agent API takes a single message string)
    const fullMessage = systemPrompt
      ? `${systemPrompt}\n\n---\n\n${prompt}`
      : prompt;

    console.log(`[invokeAgent] promptLength=${fullMessage.length}`);

    // Call the Base44 AI completion endpoint
    const response = await client.ai.complete({
      messages: [{ role: "user", content: fullMessage }],
      model: "gpt-4o", // Base44's default capable model
      max_tokens: 16000,
    });

    const result = response?.content || response?.text || response?.message || "";

    if (!result) {
      console.error("[invokeAgent] Empty response:", JSON.stringify(response));
      return Response.json({ error: "Empty response from agent" }, { status: 500 });
    }

    const wordCount = result.split(/\s+/).filter(Boolean).length;
    console.log(`[invokeAgent] success resultLength=${result.length} wordCount=${wordCount}`);

    return Response.json({
      result,
      usage: { wordCount },
    });
  } catch (error) {
    console.error("[invokeAgent] exception:", error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});