import lawsData from "../data/laws.json";

interface Law {
  id: string;
  jurisdiction: string;
  title: string;
  content: string;
}

const laws: Law[] = lawsData as Law[];
import { analyzeWithAI, type LegalAnalysis } from "./ai";

export interface LegalUpdate {
  date: string;
  source: string;
  summary: string;
  impact: "high" | "medium" | "low";
}

export interface ComplianceResult {
  basicViolations: any[];
  aiAnalysis: LegalAnalysis;
  overallRisk: "HIGH" | "MEDIUM" | "LOW";
  lastUpdated: string;
  jurisdiction: string;
}

export function searchLawsByKeywords(text: string, jurisdiction: string) {
  const keywords = text.toLowerCase().split(/\W+/);
  return laws.filter(
    (law) =>
      law.jurisdiction === jurisdiction &&
      keywords.some((k) => law.content.toLowerCase().includes(k))
  );
}

export async function checkComplianceWithAI(
  proposal: string,
  jurisdiction: string
): Promise<ComplianceResult> {
  // Analyse traditionnelle par mots-clés
  const basicMatches = searchLawsByKeywords(proposal, jurisdiction);

  // Analyse IA avancée
  const aiAnalysis = await analyzeWithAI(proposal, jurisdiction);

  // Calcul du risque global
  const overallRisk = calculateOverallRisk(basicMatches, aiAnalysis);

  return {
    basicViolations: basicMatches,
    aiAnalysis,
    overallRisk,
    lastUpdated: new Date().toISOString(),
    jurisdiction,
  };
}

function calculateOverallRisk(
  basicMatches: any[],
  aiAnalysis: LegalAnalysis
): "HIGH" | "MEDIUM" | "LOW" {
  const basicRisk = basicMatches.length;
  const aiRisk = aiAnalysis.contradictions.length;
  const confidence = aiAnalysis.confidence;

  // Risque élevé : violations détectées ET confiance IA élevée
  if (basicRisk > 0 || (aiRisk > 2 && confidence > 0.8)) {
    return "HIGH";
  }

  // Risque moyen : quelques violations ou confiance modérée
  if (aiRisk > 0 && confidence > 0.6) {
    return "MEDIUM";
  }

  // Risque faible
  return "LOW";
}

// Simulation de veille légale (pour future implémentation)
export async function fetchLegalUpdates(
  jurisdiction: string
): Promise<LegalUpdate[]> {
  // TODO: Intégration future avec EUR-Lex et Moniteur Belge

  const mockUpdates: LegalUpdate[] = [
    {
      date: new Date().toISOString().split("T")[0],
      source: jurisdiction === "EU" ? "EUR-Lex" : "Moniteur Belge",
      summary:
        "Nouvelles directives sur la protection des données dans le secteur public",
      impact: "high",
    },
    {
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      source:
        jurisdiction === "EU" ? "Journal Officiel UE" : "Code du travail BE",
      summary: "Mise à jour des réglementations sur le télétravail",
      impact: "medium",
    },
  ];

  return mockUpdates;
}

// Fonction utilitaire pour formater les résultats
export function formatAnalysisForDisplay(result: ComplianceResult) {
  return {
    ...result,
    riskColor: getRiskColor(result.overallRisk),
    confidencePercentage: Math.round(result.aiAnalysis.confidence * 100),
    hasViolations:
      result.basicViolations.length > 0 ||
      result.aiAnalysis.contradictions.length > 0,
  };
}

function getRiskColor(risk: "HIGH" | "MEDIUM" | "LOW"): string {
  switch (risk) {
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "LOW":
      return "bg-green-100 text-green-800 border-green-200";
  }
}
