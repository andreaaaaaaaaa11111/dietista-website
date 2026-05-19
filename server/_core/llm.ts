/**
 * Integrazione LLM con OpenAI (sostituisce Manus Forge LLM)
 * 
 * Usa l'API OpenAI direttamente.
 * Richiede OPENAI_API_KEY nell'environment.
 * 
 * Nota: la funzionalità AI (generazione articoli blog) è opzionale.
 * Se OPENAI_API_KEY non è configurato, le chiamate LLM restituiranno un errore.
 */
import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type MessageContent = string | TextContent | ImageContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: string;
  tool_choice?: string;
  maxTokens?: number;
  max_tokens?: number;
  responseFormat?: { type: string; json_schema?: unknown };
  response_format?: { type: string; json_schema?: unknown };
  model?: string;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | null;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

/**
 * Invoca il modello LLM tramite OpenAI API.
 * Richiede OPENAI_API_KEY nell'environment.
 */
export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const apiKey = ENV.openaiApiKey;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY non configurato. Aggiungere la chiave API OpenAI nelle variabili d'ambiente."
    );
  }

  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    maxTokens,
    max_tokens,
    responseFormat,
    response_format,
    model = "gpt-4o-mini",
  } = params;

  const normalizeMessage = (msg: Message) => {
    const content = Array.isArray(msg.content)
      ? msg.content.map(p => (typeof p === "string" ? { type: "text", text: p } : p))
      : msg.content;

    return {
      role: msg.role,
      content,
      ...(msg.name ? { name: msg.name } : {}),
      ...(msg.tool_call_id ? { tool_call_id: msg.tool_call_id } : {}),
    };
  };

  const payload: Record<string, unknown> = {
    model,
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
    if (toolChoice || tool_choice) {
      payload.tool_choice = toolChoice || tool_choice;
    }
  }

  if (maxTokens || max_tokens) {
    payload.max_tokens = maxTokens || max_tokens;
  }

  const rf = responseFormat || response_format;
  if (rf) {
    payload.response_format = rf;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenAI API error: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  return (await response.json()) as InvokeResult;
}
