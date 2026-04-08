// API helper for calling the Cloudflare Worker

const WORKER_URL = import.meta.env.VITE_WORKER_URL || "https://activity-wheel-api.mcbcinnamon.workers.dev";

export async function generateActivities(criteria, names) {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ criteria, names }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new Error(`Rate limit reached. Try again in ${data.retryAfterMinutes || "a few"} minutes.`);
    }
    throw new Error(data.error || "Failed to generate activities");
  }

  const data = await response.json();
  return data.activities;
}
