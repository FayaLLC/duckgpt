// ---------------------------- //
// - github.com/Vauth/duckgpt - //
// ---------------------------- //
const MODELS = [
  // --- Flagship & Latest Frontier Additions ---
  '@cf/qwen/qwen3-30b-a3b-fp8',                     // Qwen Mixture of Experts (MoE) model
  '@cf/zai-org/glm-4.7-flash',                      // Zhipu AI Flash 131k context window model
  '@cf/mistralai/mistral-small-3.1-24b-instruct',   // State-of-the-art vision & text understanding
  '@cf/moonshotai/kimi-k2.7',                       // Frontier-scale open-source 1T parameter model

  // --- Meta Llama 3 & 3.1 Architectures ---
  '@cf/meta/llama-3.1-70b-instruct',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.2-11b-vision-instruct',         // Vision-capable conversational model
  '@cf/meta/llama-3-8b-instruct',
  '@cf/meta/llama-guard-3-8b',                      // Content safety classification variant

  // --- Mistral AI Architectures ---
  '@cf/mistral/mistral-7b-instruct-v0.2',

  // --- Open Weights / OpenAI Managed Ecosystem ---
  '@cf/openai/gpt-oss-120b',                        // Open-weight model optimized for agentic reasoning

  // --- Lightweight & Low Latency Edge Models ---
  '@cf/microsoft/phi-2',
  '@cf/google/gemma-7b-it'
];

const MAIN_MODEL = '@cf/meta/llama-3.1-8b-instruct';
const DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant named 'DuckGPT'.";
const ERROR_404 = {"action":"error", "status": 404, "usage": "GET /chat/?prompt=<text>&model=<model>&history=<List[Dict{str, str}]>&system=<text>", "models": MODELS};
const HEAD_JSON = { 'content-type': 'application/json', 'Access-Control-Allow-Origin': "*"};
const HEAD_HTML = { 'content-type': 'text/html', 'Access-Control-Allow-Origin': "*"};


// ---------- Event Listener ---------- //

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const prompt = url.searchParams.get('prompt');
    const history = url.searchParams.get('history') || '[]';
    const model = url.searchParams.get('model') || MAIN_MODEL;
    const system = url.searchParams.get('system') || DEFAULT_SYSTEM_PROMPT;

    if (url.pathname === "/") {return new Response(HTML, { headers: HEAD_HTML });}

    if (prompt && url.pathname === "/chat/") {
      const response = await Chat(prompt, history, model, system, env);
      return new Response(JSON.stringify(response), { headers: HEAD_JSON });
    }

    return new Response(JSON.stringify(ERROR_404), {status: 404, headers: HEAD_JSON});
  }
};

// ---------- Duckgpt Function ---------- //

async function Chat(prompt, history, model, system, env) {
  try {
    const messages = JSON.parse(history);
    messages.push({ role: "user", content: prompt });

    const response = await env.AI.run(model, {
      messages: [
        { role: "system", content: system },
        ...messages
      ]
    });

    return {"action":"success", "status": 200, "response": response.response, "model": model};
  } catch (error) {
    return { "action":"error", "status": 403, "response": error.message };
  }
}

// ----------------------------- //
// - github.com/zar0x/duck-gui - //
// ----------------------------- //

// ---------- HTML Website ---------- //

let HTML = `Nothing here folk !`
