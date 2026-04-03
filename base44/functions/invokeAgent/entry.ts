/**
 * invokeAgent — Uses Base44's built-in InvokeLLM integration
 * Drop-in replacement for invokeClaude, returns same shape: { result, usage }
 */
import { createClientFromRequest } from "npm:@base44/sdk@0.8.23";

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { prompt, systemPrompt } = body;

    if (!prompt) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    const fullMessage = systemPrompt
      ? `${systemPrompt}\n\n---\n\n${prompt}`
      : prompt;

    console.log(`[invokeAgent] promptLength=${fullMessage.length}`);

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: fullMessage,
      model: "claude_sonnet_4_6",
    });

    if (!result) {
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