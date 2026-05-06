# AGENTS.md for Tarot API

This repo teaches AI coding agents (Cursor, Claude Code, Aider, Codex, Windsurf, RooCode, Gemini CLI) how to use the RoxyAPI three-card tarot spread endpoint.

## Endpoint
- Method: `POST`
- URL: `https://roxyapi.com/api/v2/tarot/spreads/three-card`
- Auth: `X-API-Key` header
- Domain: `tarot` (one of 10 in the RoxyAPI catalog)
- Operation ID: `castThreeCard` matches the SDK method name in camelCase
- MCP tool: `post_tarot_spreads_three_card` on `https://roxyapi.com/mcp/tarot`

## TypeScript SDK
```ts
import { createRoxy } from '@roxyapi/sdk';
const roxy = createRoxy(process.env.ROXY_API_KEY!);
const { data, error } = await roxy.tarot.castThreeCard({
  body: { question: 'What do I need to know about my career?', seed: 'sample-user-2026' },
});
```

## Python SDK
```python
import os
from roxy_sdk import create_roxy
roxy = create_roxy(os.environ["ROXY_API_KEY"])
result = roxy.tarot.cast_three_card(
    question="What do I need to know about my career?",
    seed="sample-user-2026",
)
```

## Setup step (only when the endpoint requires coordinates)
Always call `GET /location/search?q={city}` first. Take `latitude`, `longitude`, `timezone` from `cities[0]` and pipe them in. Never ask the user to type coordinates.

Note: the tarot three-card endpoint does NOT require coordinates. Pass `question` and `seed` only. Both are optional.

## Request fields
- `question` (string, optional): specific question to focus the reading. Examples: relationship guidance, career direction, blocking forces. Leave empty for general guidance.
- `seed` (string, optional): reproducibility key. Same seed always returns the same 3 cards in the same positions. Useful for daily-card features, share links, testing, and per-user determinism. Omit for random draws.

## Response top level keys
- `spread`: the spread name (Three-Card, Celtic Cross, Career, Love)
- `question`: the querent question echoed back, if one was provided
- `seed`: the seed echoed back, if one was provided. Same seed reproduces identical results.
- `positions`: array of 3 spread positions (Past, Present, Future). Each position has `position` (1-based number), `name`, `interpretation` (position-specific copy), and `card` (drawn card).
- `positions[].card`: `id` (kebab-case identifier), `name`, `arcana` (major or minor), `reversed` (boolean), `keywords` (array), `meaning` (full interpretation in current orientation), `imageUrl` (CDN-hosted Rider-Waite artwork).
- `summary`: short narrative connecting all three cards into a cohesive reading.

## Domain rules
- The deck is the 78-card Rider-Waite-Smith standard: 22 Major Arcana plus 56 Minor Arcana (4 suits, 14 cards each).
- Reversed cards carry modified or blocked energy. The `meaning` field reflects the orientation, so do not flip the text yourself.
- Three-card position names are fixed: Past, Present, Future. Different spreads (Celtic Cross, Career, Love) use different position names.
- The seedable RNG is the determinism mechanism. Same seed plus same endpoint always returns the same cards in the same positions and orientations. Use a stable user identifier (user ID, share token, daily date string) for reproducibility.
- Card images are served at `https://roxyapi.com/img/tarot/major/{id}.jpg` and `https://roxyapi.com/img/tarot/minor/{id}.jpg`. Cache them client-side for performance.
- For a 10-card professional reading use `POST /tarot/spreads/celtic-cross`. For a single-card oracle use `POST /tarot/yes-no`. For a daily card use `POST /tarot/daily`.

## Related endpoints
- `POST /tarot/spreads/celtic-cross` (`castCelticCross`): 10-position professional-reader spread with deeper position semantics
- `POST /tarot/spreads/love` (`castLoveSpread`): 5-card relationship spread covering emotional dynamics, compatibility, and partnership potential
- `POST /tarot/yes-no` (`castYesNo`): single-card yes, no, or maybe oracle for impulse decisions

## Verified
2026-Q2 against `https://roxyapi.com/api/v2/openapi.json`. Re-fetch the spec for ground truth before changing this file.

## Discovery
- Full catalog: https://roxyapi.com/AGENTS.md
- LLM index: https://roxyapi.com/llms.txt
- Methodology: https://roxyapi.com/methodology
