// Cloudflare Worker — proxies requests to Claude API for generating custom activities
// Protections: origin checking, IP-based rate limiting via KV

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return handleCORS(env);
    }

    // Only allow POST
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, env);
    }

    // Origin check
    const origin = request.headers.get("Origin") || "";
    if (!origin.startsWith(env.ALLOWED_ORIGIN)) {
      return jsonResponse({ error: "Forbidden" }, 403, env);
    }

    // Rate limiting by IP
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const rateLimitResult = await checkRateLimit(env, ip);
    if (!rateLimitResult.allowed) {
      return jsonResponse(
        {
          error: "Rate limit exceeded",
          retryAfterMinutes: rateLimitResult.retryAfterMinutes,
        },
        429,
        env
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, env);
    }

    const { criteria, names, categories } = body;
    if (!criteria) {
      return jsonResponse({ error: "Missing criteria" }, 400, env);
    }

    // Build prompt for Claude
    const prompt = buildPrompt(criteria, names, categories);

    try {
      const claudeResponse = await fetch(CLAUDE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 2048,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!claudeResponse.ok) {
        const err = await claudeResponse.text();
        console.error("Claude API error:", err);
        return jsonResponse({ error: "AI service error" }, 502, env);
      }

      const claudeData = await claudeResponse.json();
      const text = claudeData.content?.[0]?.text || "";

      // Parse the JSON from Claude's response
      const activities = parseActivities(text);
      if (!activities) {
        return jsonResponse({ error: "Failed to parse AI response" }, 500, env);
      }

      return jsonResponse({ activities }, 200, env);
    } catch (err) {
      console.error("Worker error:", err);
      return jsonResponse({ error: "Internal error" }, 500, env);
    }
  },
};

function buildPrompt(criteria, names, categories) {
  const catList = (categories || [
    "explore", "experiment", "dance", "puzzle", "build", "paint"
  ]).join(", ");

  let prompt = `You are generating fun, age-appropriate activities for a child.

Generate exactly 3 activities for EACH of these categories: ${catList}

The activities should be tailored to this child:`;

  if (criteria.age) prompt += `\n- Age: ${criteria.age}`;
  if (criteria.likes) prompt += `\n- Likes & interests: ${criteria.likes}`;
  if (criteria.dislikes) prompt += `\n- Dislikes/sensitivities: ${criteria.dislikes}`;
  if (criteria.location) prompt += `\n- Location: ${criteria.location}`;
  if (criteria.nearby) prompt += `\n- Nearby places: ${criteria.nearby}`;

  if (names) {
    if (names.littlePerson) prompt += `\n- Child's name: ${names.littlePerson}`;
    if (names.bigPerson1) prompt += `\n- Grown-up 1: ${names.bigPerson1}`;
    if (names.bigPerson2) prompt += `\n- Grown-up 2: ${names.bigPerson2}`;
  }

  prompt += `

Each activity needs a short title (2-4 words) and a fun description (1-2 sentences, written to the child using "you" and referencing their grown-up as "your Big Person").

Respond with ONLY valid JSON in this exact format, no markdown fences:
{
  "explore": [{"title": "...", "description": "..."}],
  "experiment": [{"title": "...", "description": "..."}],
  "dance": [{"title": "...", "description": "..."}],
  "puzzle": [{"title": "...", "description": "..."}],
  "build": [{"title": "...", "description": "..."}],
  "paint": [{"title": "...", "description": "..."}]
}`;

  return prompt;
}

function parseActivities(text) {
  try {
    // Strip markdown fences if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Validate structure
    const validCategories = ["explore", "experiment", "dance", "puzzle", "build", "paint"];
    for (const cat of validCategories) {
      if (!Array.isArray(parsed[cat])) return null;
      for (const activity of parsed[cat]) {
        if (!activity.title || !activity.description) return null;
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

async function checkRateLimit(env, ip) {
  const windowHours = parseInt(env.RATE_LIMIT_WINDOW_HOURS) || 1;
  const maxRequests = parseInt(env.RATE_LIMIT_MAX) || 10;
  const key = `rate:${ip}`;

  const existing = await env.RATE_LIMITER.get(key, "json");
  const now = Date.now();
  const windowMs = windowHours * 60 * 60 * 1000;

  if (!existing) {
    await env.RATE_LIMITER.put(key, JSON.stringify({ count: 1, windowStart: now }), {
      expirationTtl: windowHours * 3600,
    });
    return { allowed: true };
  }

  // Window expired — reset
  if (now - existing.windowStart > windowMs) {
    await env.RATE_LIMITER.put(key, JSON.stringify({ count: 1, windowStart: now }), {
      expirationTtl: windowHours * 3600,
    });
    return { allowed: true };
  }

  // Within window
  if (existing.count >= maxRequests) {
    const retryAfterMs = windowMs - (now - existing.windowStart);
    return { allowed: false, retryAfterMinutes: Math.ceil(retryAfterMs / 60000) };
  }

  existing.count += 1;
  const remainingTtl = Math.ceil((windowMs - (now - existing.windowStart)) / 1000);
  await env.RATE_LIMITER.put(key, JSON.stringify(existing), {
    expirationTtl: Math.max(remainingTtl, 60),
  });
  return { allowed: true };
}

function handleCORS(env) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function jsonResponse(data, status, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    },
  });
}
