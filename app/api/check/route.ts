import { NextRequest, NextResponse } from "next/server";
import {
  checkComplianceWithAI,
  formatAnalysisForDisplay,
} from "../../../lib/lawService";

export async function POST(req: NextRequest) {
  try {
    const { proposal, jurisdiction } = await req.json();

    if (!proposal || !jurisdiction) {
      return NextResponse.json(
        {
          error: "Proposition et juridiction requises.",
          details:
            "Veuillez fournir une proposition et sélectionner une juridiction (EU ou BE).",
        },
        { status: 400 }
      );
    }

    if (proposal.length < 10) {
      return NextResponse.json(
        {
          error: "Proposition trop courte.",
          details: "Veuillez saisir une proposition d'au moins 10 caractères.",
        },
        { status: 400 }
      );
    }

    if (!["EU", "BE"].includes(jurisdiction)) {
      return NextResponse.json(
        {
          error: "Juridiction invalide.",
          details: "Juridiction doit être EU ou BE.",
        },
        { status: 400 }
      );
    }

    console.log(
      `Analyse en cours: ${proposal.substring(0, 50)}... (${jurisdiction})`
    );

    // Analyse complète avec IA
    const analysis = await checkComplianceWithAI(proposal, jurisdiction);

    // Formatage pour l'affichage
    const formattedResult = formatAnalysisForDisplay(analysis);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      proposalLength: proposal.length,
      ...formattedResult,
    });
  } catch (error) {
    console.error("Erreur analyse:", error);

    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "Une erreur est survenue lors de l'analyse.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Endpoint GET pour vérifier le statut de l'API
export async function GET() {
  return NextResponse.json({
    status: "active",
    version: "2.0",
    features: ["basic_analysis", "ai_analysis", "risk_assessment"],
    timestamp: new Date().toISOString(),
  });
}
