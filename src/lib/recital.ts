import Anthropic from "@anthropic-ai/sdk";

export interface RecitalInput {
  docType:        string;       // "nda" | "pkwt" | "service-agreement"
  jurisdiction:   string;       // "ID" | "SG"
  context:        string;       // agreement_context (free text)
  partyAName?:    string;
  partyAType?:    string;
  partyBName?:    string;
  partyBType?:    string;
}

const DOC_LABEL: Record<string, string> = {
  nda:                 "a mutual non-disclosure agreement",
  pkwt:                "a fixed-term employment agreement",
  "service-agreement": "a service agreement",
};

/**
 * Builds the LLM client + model from env. Supports the real Anthropic API as
 * well as any Anthropic-compatible endpoint (e.g. MiniMax, which uses a custom
 * base URL, a Bearer auth token, and its own model name).
 *
 * Env contract:
 *   ANTHROPIC_BASE_URL   optional — custom endpoint (MiniMax: https://api.minimax.io/anthropic)
 *   ANTHROPIC_AUTH_TOKEN optional — Bearer credential (MiniMax key goes here)
 *   ANTHROPIC_API_KEY    optional — x-api-key credential (real Anthropic)
 *   LEXSEA_AI_MODEL      optional — model name (MiniMax: MiniMax-M3; default: claude-opus-4-8)
 *
 * Returns null when no credential is configured (AI disabled — recital skipped).
 */
function buildClient(): { client: Anthropic; model: string } | null {
  const baseURL   = process.env.ANTHROPIC_BASE_URL?.trim();
  const authToken = process.env.ANTHROPIC_AUTH_TOKEN?.trim();
  const apiKey    = process.env.ANTHROPIC_API_KEY?.trim();
  const model     = process.env.LEXSEA_AI_MODEL?.trim() || "claude-opus-4-8";

  if (!authToken && !apiKey) return null;

  // A custom base URL (third-party compatible endpoint) authenticates via
  // Authorization: Bearer. Send the credential as authToken and disable the
  // x-api-key header so a stray ANTHROPIC_API_KEY isn't also sent.
  // Short timeout + single retry: the recital is optional, so a slow/hung AI
  // call must never block document generation.
  const opts: {
    baseURL?: string; apiKey?: string | null; authToken?: string;
    timeout?: number; maxRetries?: number;
  } = { timeout: 15000, maxRetries: 1 };
  if (baseURL) opts.baseURL = baseURL;

  if (authToken) {
    opts.authToken = authToken;
    opts.apiKey = null;
  } else if (baseURL) {
    opts.authToken = apiKey;   // treat the api key as a Bearer token for compat endpoints
    opts.apiKey = null;
  } else {
    opts.apiKey = apiKey;      // real Anthropic — x-api-key
  }

  return { client: new Anthropic(opts), model };
}

/**
 * Generates a short, NON-BINDING background recital for a legal document.
 *
 * Design constraints (deliberate — this is a legal-document platform):
 *  - The model is told to use ONLY the facts provided and to invent nothing
 *    (no obligations, dates, amounts, or legal terms).
 *  - It produces descriptive background prose only — never operative clauses.
 *  - All binding content still comes from the validated clause library.
 *
 * Returns the recital text, or null if AI is unavailable / output is unusable.
 * Callers must treat null as "skip the recital" — never as an error.
 */
export async function generateRecital(input: RecitalInput): Promise<string | null> {
  const context = input.context?.trim();
  if (!context) return null;

  const built = buildClient();
  if (!built) return null;
  const { client, model } = built;

  const isID = input.jurisdiction === "ID";
  const docLabel = DOC_LABEL[input.docType] ?? "a legal agreement";

  const facts = [
    `Document type: ${docLabel}`,
    `Jurisdiction: ${isID ? "Indonesia" : "Singapore"}`,
    input.partyAName && `First party name: ${input.partyAName}`,
    input.partyAType && `First party nature/business: ${input.partyAType}`,
    input.partyBName && `Second party name: ${input.partyBName}`,
    input.partyBType && `Second party nature/business: ${input.partyBType}`,
    `Context provided by the user: ${context}`,
  ].filter(Boolean).join("\n");

  const system = [
    "You draft a single, short BACKGROUND recital for a legal contract.",
    "STRICT RULES:",
    "- Use ONLY the facts provided. Do NOT invent names, dates, amounts, durations, locations, obligations, or legal terms.",
    "- Write descriptive background only (why the parties are entering this agreement). Do NOT write operative or binding clauses, rights, or obligations.",
    "- Do NOT cite statutes or case law.",
    "- 2 to 4 sentences. Neutral, formal, factual tone suitable for an executed contract.",
    `- Write in ${isID ? "formal Bahasa Indonesia" : "formal English"}.`,
    "- Output ONLY the recital prose. No heading, no labels, no markdown, no preamble, no quotation marks.",
    "- Almost always produce a recital from the facts given. Output exactly NONE only when the context is empty, unintelligible, or contains no usable information at all.",
  ].join("\n");

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: `Facts:\n${facts}` }],
    });

    if (response.stop_reason === "refusal") return null;

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!text || text.toUpperCase() === "NONE") return null;
    return text;
  } catch {
    // Graceful degradation — never block document assembly on AI failure
    return null;
  }
}
