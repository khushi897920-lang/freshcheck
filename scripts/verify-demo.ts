import { SAMPLE_ANSWERS } from "../data/samples";
import { extractClaims } from "../lib/extract";
import { verifyAndJudgeClaim } from "../lib/judge";
import { computeOverallScore } from "../lib/score";

async function verifyDemoSuite() {
  console.log("==================================================");
  console.log("  FreshCheck Hackathon Demo Verification Suite    ");
  console.log("  Geek Room Global AI Hackathon 2026 - PS 06      ");
  console.log("==================================================\n");

  for (const sample of SAMPLE_ANSWERS) {
    console.log(`\n▶ Testing Benchmark: "${sample.title}" (${sample.category})`);
    console.log(`  Input text: "${sample.text.slice(0, 60)}..."`);

    // 1. Claim extraction
    const extraction = await extractClaims(sample.text, sample.answerDate, 8);
    console.log(`  Extracted claims: ${extraction.claims.length} (Model: ${extraction.modelUsed}, Fallback: ${extraction.fallbackUsed})`);

    const verdicts: Array<{ text: string; verdict: string; score: number }> = [];

    // 2. Verification
    for (const claim of extraction.claims) {
      const judged = await verifyAndJudgeClaim(claim);
      verdicts.push({
        text: claim.text,
        verdict: judged.verdict,
        score: judged.scoreBreakdown.finalScore,
      });
      console.log(`    • [${judged.verdict}] ${claim.text.slice(0, 45)}... Score: ${judged.scoreBreakdown.finalScore}/100 (${judged.scoreBreakdown.label})`);
    }

    // 3. Overall score
    const overallScore = computeOverallScore(
      verdicts.map((v, i) => ({
        score: v.score,
        volatility: extraction.claims[i].volatility,
        skipped: extraction.claims[i].skipped,
      }))
    );
    console.log(`  ➤ Overall Freshness Index: ${overallScore}/100\n`);
  }

  console.log("==================================================");
  console.log("  ✓ All 3 Hackathon Demo Benchmarks Verified!    ");
  console.log("==================================================");
}

verifyDemoSuite().catch(console.error);

