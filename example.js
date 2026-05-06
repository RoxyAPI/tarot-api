import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY);

/**
 * Three-card past, present, future tarot reading.
 * Pass a stable seed for reproducible per-user readings, omit for random draws.
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
  console.log('');

  for (const pos of data.positions) {
    const reversal = pos.card.reversed ? ' (reversed)' : '';
    console.log(`${pos.position}. ${pos.name}: ${pos.card.name}${reversal}`);
    console.log('   Keywords:', pos.card.keywords.join(', '));
    console.log('');
  }

  if (data.summary) console.log('Summary:', data.summary);
}

main().catch(console.error);
