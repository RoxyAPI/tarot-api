import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY!);

/**
 * Three-card tarot spread: Past, Present, Future. The most-drawn spread on every tarot platform.
 * Seeded RNG over the curated 78-card Rider-Waite-Smith deck for deterministic per-user readings.
 * Part of the RoxyAPI tarot domain.
 */
async function main() {
  const { data, error } = await roxy.tarot.castThreeCard({
    body: {
      question: 'What do I need to know about my career?',
      seed: 'sample-user-2026',
    },
  });

  if (error) throw new Error(error.error);

  console.log('Spread:', data.spread);
  console.log('Question:', data.question);
  console.log('Seed:', data.seed);
  console.log('');

  for (const pos of data.positions) {
    const reversal = pos.card.reversed ? ' (reversed)' : '';
    console.log(`${pos.position}. ${pos.name}: ${pos.card.name}${reversal}`);
    console.log('   Arcana:', pos.card.arcana);
    console.log('   Keywords:', pos.card.keywords.join(', '));
    console.log('   Position meaning:', pos.interpretation.slice(0, 120) + '...');
    console.log('   Image:', pos.card.imageUrl);
    console.log('');
  }

  if (data.summary) {
    console.log('Summary:', data.summary);
  }
}

main().catch(console.error);
