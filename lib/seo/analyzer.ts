import type { AnalysisInput, AnalysisOutput, CategoryScore, CheckResult } from "./types";
import { basicChecks } from "./checks/basic";
import { metaChecks } from "./checks/meta";
import { contentChecks } from "./checks/content";
import { linksImagesChecks } from "./checks/links-images";
import { readabilityChecks } from "./checks/readability";
import { schemaChecks } from "./checks/schema";
import { titleIntelChecks } from "./checks/title-intel";
import { anchorChecks } from "./checks/anchor";
import { contentQualityChecks } from "./checks/content-quality";
import { computeInsights, type ContentInsights } from "./insights";

function aggregate(results: CheckResult[]): number {
  const weighted = results.filter((r) => r.severity !== "neutral");
  if (weighted.length === 0) return 0;
  let total = 0, count = 0;
  for (const r of weighted) {
    total += r.score;
    count += 1;
  }
  return Math.round(total / Math.max(1, count));
}

export type AnalysisResult = AnalysisOutput & { insights: ContentInsights };

export function analyze(input: AnalysisInput): AnalysisResult {
  const insights = computeInsights(input);

  const seoResults: CheckResult[] = [
    ...basicChecks(input),
    ...metaChecks(input),
    ...titleIntelChecks(input),
    ...contentChecks(input),
    ...linksImagesChecks(input),
    ...anchorChecks(input),
  ];
  const readabilityResults = [
    ...readabilityChecks(input),
    ...contentQualityChecks(input, insights),
  ];
  const schemaResults = schemaChecks(input);

  const seo: CategoryScore = { category: "seo", score: aggregate(seoResults), results: seoResults };
  const readability: CategoryScore = { category: "readability", score: aggregate(readabilityResults), results: readabilityResults };
  const schema: CategoryScore = { category: "schema", score: aggregate(schemaResults), results: schemaResults };

  const overall = Math.round((seo.score * 0.55) + (readability.score * 0.3) + (schema.score * 0.15));

  return { seo, readability, schema, overall, insights };
}
