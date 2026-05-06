"""
Three-card tarot spread: Past, Present, Future.
Seeded RNG over the curated 78-card Rider-Waite-Smith deck for deterministic per-user reads.
Part of the RoxyAPI tarot domain.
"""

import os
from roxy_sdk import create_roxy

roxy = create_roxy(os.environ["ROXY_API_KEY"])


def main():
    # Three-card spread: same seed plus same question always returns the same reading
    reading = roxy.tarot.cast_three_card(
        question="What do I need to know about my career?",
        seed="sample-user-2026",
    )

    print("Spread:", reading["spread"])
    print("Question:", reading.get("question"))
    print("Seed:", reading.get("seed"))
    print()

    for pos in reading["positions"]:
        card = pos["card"]
        reversal = " (reversed)" if card["reversed"] else ""
        print(f"{pos['position']}. {pos['name']}: {card['name']}{reversal}")
        print("   Arcana:", card["arcana"])
        print("   Keywords:", ", ".join(card["keywords"]))
        print("   Position meaning:", pos["interpretation"][:120] + "...")
        print("   Image:", card["imageUrl"])
        print()

    if reading.get("summary"):
        print("Summary:", reading["summary"])


if __name__ == "__main__":
    main()
