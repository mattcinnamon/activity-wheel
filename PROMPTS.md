# Activity Wheel Prompts

This document contains the prompt text used to generate activities in the Activity Wheel app.

---

## Standard Activities

The standard activities are hardcoded in [`src/data/missions.js`](src/data/missions.js). They are manually written, Bristol-themed activities across six categories:

| Category | Emoji | Activities |
|----------|-------|------------|
| Explore | 🔍 | 12 activities |
| Experiment | 🧪 | 12 activities |
| Dance | 💃 | 10 activities |
| Puzzle | 🧩 | 10 activities |
| Build | 🧱 | 10 activities |
| Paint | 🎨 | 12 activities |

Each activity has a **title** (2-4 words) and a **description** (1-2 sentences written to the child, referencing their grown-up as "Big Person").

---

## Custom Activities (AI-Generated)

Custom activities are generated via a Cloudflare Worker that calls the Claude API. The worker is in [`worker/src/index.js`](worker/src/index.js).

### Prompt

```
You are generating fun, age-appropriate activities for a child.

Generate exactly 6 activities for EACH of these categories: explore, experiment, dance, puzzle, build, paint

The activities should be tailored to this child:
- Age: {age}
- Likes & interests: {likes}
- Dislikes/sensitivities: {dislikes}
- Location: {location}
- Nearby places: {nearby}
- Child's name: {littlePerson}
- Grown-up 1: {bigPerson1}
- Grown-up 2: {bigPerson2}

Each activity needs a short title (2-4 words) and a fun description (1-2 sentences, written to the child using "you" and referencing their grown-up as "your Big Person").

Respond with ONLY valid JSON in this exact format, no markdown fences:
{
  "explore": [{"title": "...", "description": "..."}],
  "experiment": [{"title": "...", "description": "..."}],
  "dance": [{"title": "...", "description": "..."}],
  "puzzle": [{"title": "...", "description": "..."}],
  "build": [{"title": "...", "description": "..."}],
  "paint": [{"title": "...", "description": "..."}]
}
```

### Notes

- The criteria fields (age, likes, dislikes, location, nearby, names) are only included in the prompt when the user has provided them.
- The model used is `claude-sonnet-4-20250514`.
- Rate limiting: 10 requests per hour per IP address (configurable via environment variables).
