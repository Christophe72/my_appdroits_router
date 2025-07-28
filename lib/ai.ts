import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Configuration Anthropic Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface LegalAnalysis {
  contradictions: string[];
  risks: string[];
  confidence: number;
  recommendations: string[];
  legalSources: string[];
  summary: string;
}

export async function analyzeWithAI(
  proposal: string,
  jurisdiction: string
): Promise<LegalAnalysis> {
  const jurisdictionText =
    jurisdiction === "EU"
      ? "européen et directives UE"
      : "belge et réglementations nationales";

  const prompt = `Tu es un expert juridique spécialisé en droit ${jurisdictionText}.
Analyse cette proposition politique et détecte les contradictions légales potentielles :

PROPOSITION: "${proposal}"

CONTEXTE: Vérifie la conformité avec :
- RGPD et protection des données (2018)
- Droit du travail et conventions collectives
- Lois anti-discrimination 
- Libertés fondamentales européennes
- Réglementations récentes ${new Date().getFullYear()}

Réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "contradictions": ["liste précise des contradictions détectées"],
  "risks": ["risques juridiques identifiés avec gravité"],
  "confidence": 0.85,
  "recommendations": ["suggestions concrètes d'amélioration"],
  "legalSources": ["références légales pertinentes avec articles"],
  "summary": "Résumé en 2-3 phrases de l'analyse globale"
}`;

  try {
    // Utilisation d'OpenAI par défaut
    if (
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "your-openai-api-key-here"
    ) {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content;
      if (content) {
        return JSON.parse(content);
      }
    }

    // Fallback vers simulation si pas de clé API
    return simulateAIAnalysis(proposal, jurisdiction);
  } catch (error) {
    console.error("Erreur IA:", error);
    return simulateAIAnalysis(proposal, jurisdiction);
  }
}

export async function analyzeWithClaude(
  proposal: string,
  jurisdiction: string
): Promise<LegalAnalysis> {
  if (
    !process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_API_KEY === "your-anthropic-api-key-here"
  ) {
    return simulateAIAnalysis(proposal, jurisdiction);
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Analyse cette proposition politique pour détecter les contradictions légales en droit ${
            jurisdiction === "EU" ? "européen" : "belge"
          }: "${proposal}". Réponds en JSON avec les champs: contradictions, risks, confidence, recommendations, legalSources, summary.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type === "text") {
      return JSON.parse(content.text);
    }

    return simulateAIAnalysis(proposal, jurisdiction);
  } catch (error) {
    console.error("Erreur Claude:", error);
    return simulateAIAnalysis(proposal, jurisdiction);
  }
}

// Simulation IA pour les tests (quand pas de clé API)
function simulateAIAnalysis(
  proposal: string,
  jurisdiction: string
): LegalAnalysis {
  const lowerProposal = proposal.toLowerCase();
  const contradictions: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];
  const legalSources: string[] = [];

  // Détection basique de mots-clés problématiques
  if (lowerProposal.includes("discrimin")) {
    contradictions.push(
      "Risque de discrimination contraire aux lois anti-discrimination"
    );
    risks.push("Violation potentielle de l'égalité de traitement");
    recommendations.push(
      "Reformuler pour respecter le principe de non-discrimination"
    );
    legalSources.push(
      "Directive 2000/43/CE - Égalité de traitement entre les personnes"
    );
  }

  if (lowerProposal.includes("données") || lowerProposal.includes("privé")) {
    contradictions.push("Traitement de données personnelles sans mention RGPD");
    risks.push(
      "Non-conformité au Règlement Général sur la Protection des Données"
    );
    recommendations.push(
      "Ajouter des clauses de protection des données conformes au RGPD"
    );
    legalSources.push("RGPD (UE) 2016/679 - Articles 5 et 6");
  }

  if (lowerProposal.includes("travail") || lowerProposal.includes("emploi")) {
    if (!lowerProposal.includes("contrat")) {
      contradictions.push("Mention du travail sans cadre contractuel clair");
      risks.push("Ambiguïté sur les conditions d'emploi");
      recommendations.push(
        "Préciser le cadre contractuel et les droits des travailleurs"
      );
      legalSources.push("Code du travail - Titre I : Contrat de travail");
    }
  }

  if (lowerProposal.includes("surveil") || lowerProposal.includes("contrôl")) {
    contradictions.push(
      "Mesures de surveillance potentiellement disproportionnées"
    );
    risks.push("Atteinte aux libertés individuelles et vie privée");
    recommendations.push(
      "Encadrer la surveillance par des garanties juridiques strictes"
    );
    legalSources.push("Article 8 CEDH - Droit au respect de la vie privée");
  }

  const confidence = Math.min(0.95, 0.6 + contradictions.length * 0.1);

  let summary = "Analyse complétée. ";
  if (contradictions.length === 0) {
    summary += "Aucune contradiction majeure détectée dans cette proposition.";
  } else {
    summary += `${contradictions.length} contradiction(s) potentielle(s) identifiée(s) nécessitant une attention particulière.`;
  }

  return {
    contradictions,
    risks,
    confidence,
    recommendations:
      contradictions.length === 0
        ? ["Proposition globalement conforme, veiller à la mise en application"]
        : recommendations,
    legalSources,
    summary,
  };
}
