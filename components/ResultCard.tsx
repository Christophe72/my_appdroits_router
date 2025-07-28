interface AnalysisResult {
  basicViolations: any[];
  aiAnalysis: {
    contradictions: string[];
    risks: string[];
    confidence: number;
    recommendations: string[];
    legalSources: string[];
    summary: string;
  };
  overallRisk: "HIGH" | "MEDIUM" | "LOW";
  lastUpdated: string;
  jurisdiction: string;
  riskColor: string;
  confidencePercentage: number;
  hasViolations: boolean;
}

export default function ResultCard({ result }: { result: AnalysisResult }) {
  const {
    basicViolations,
    aiAnalysis,
    overallRisk,
    jurisdiction,
    riskColor,
    confidencePercentage,
    hasViolations,
  } = result;

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "HIGH":
        return "🚨";
      case "MEDIUM":
        return "⚠️";
      case "LOW":
        return "✅";
      default:
        return "❓";
    }
  };

  const getJurisdictionFlag = (jurisdiction: string) => {
    return jurisdiction === "EU" ? "🇪🇺" : "🇧🇪";
  };

  if (!hasViolations) {
    return (
      <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">✅</span>
          <h3 className="text-lg font-bold text-green-800">
            Proposition conforme !
          </h3>
          <span className="text-sm">{getJurisdictionFlag(jurisdiction)}</span>
        </div>
        <p className="text-green-700 mb-3">{aiAnalysis.summary}</p>
        <div className="text-sm text-green-600">
          <p>
            Confiance IA: <strong>{confidencePercentage}%</strong>
          </p>
          <p>
            Aucune contradiction majeure détectée avec les lois{" "}
            {jurisdiction === "EU" ? "européennes" : "belges"}.
          </p>
        </div>

        {aiAnalysis.recommendations.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded border">
            <h4 className="font-semibold text-blue-800 text-sm mb-2">
              💡 Suggestions d'amélioration:
            </h4>
            <ul className="space-y-1">
              {aiAnalysis.recommendations.map((rec, i) => (
                <li key={i} className="text-xs text-blue-700">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {/* En-tête du résultat */}
      <div className={`p-4 border-2 rounded-lg ${riskColor}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xl">{getRiskIcon(overallRisk)}</span>
            <h3 className="font-bold text-lg">
              Niveau de risque: {overallRisk}
            </h3>
            <span className="text-sm">{getJurisdictionFlag(jurisdiction)}</span>
          </div>
          <div className="text-sm opacity-75">
            Confiance IA: <strong>{confidencePercentage}%</strong>
          </div>
        </div>
        <p className="text-sm font-medium">{aiAnalysis.summary}</p>
      </div>

      {/* Contradictions détectées par IA */}
      {aiAnalysis.contradictions.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            🤖 Contradictions détectées par IA
            <span className="text-xs bg-red-100 px-2 py-1 rounded">
              {aiAnalysis.contradictions.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {aiAnalysis.contradictions.map((contradiction, i) => (
              <li
                key={i}
                className="text-sm text-red-700 bg-white p-2 rounded border-l-4 border-red-400"
              >
                • {contradiction}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risques identifiés */}
      {aiAnalysis.risks.length > 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
            ⚠️ Risques juridiques
            <span className="text-xs bg-orange-100 px-2 py-1 rounded">
              {aiAnalysis.risks.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {aiAnalysis.risks.map((risk, i) => (
              <li
                key={i}
                className="text-sm text-orange-700 bg-white p-2 rounded border-l-4 border-orange-400"
              >
                • {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Violations basiques détectées */}
      {basicViolations.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            📋 Conflits détectés (analyse textuelle)
            <span className="text-xs bg-red-100 px-2 py-1 rounded">
              {basicViolations.length}
            </span>
          </h4>
          {basicViolations.map((violation, i) => (
            <div
              key={i}
              className="mb-3 p-3 bg-white rounded border-l-4 border-red-400"
            >
              <p className="font-medium text-red-800">❌ {violation.title}</p>
              <blockquote className="italic text-sm text-red-600 mt-1 pl-3 border-l-2 border-red-300">
                {violation.content}
              </blockquote>
            </div>
          ))}
        </div>
      )}

      {/* Recommandations IA */}
      {aiAnalysis.recommendations.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            💡 Recommandations d'amélioration
            <span className="text-xs bg-blue-100 px-2 py-1 rounded">
              {aiAnalysis.recommendations.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {aiAnalysis.recommendations.map((rec, i) => (
              <li
                key={i}
                className="text-sm text-blue-700 bg-white p-2 rounded border-l-4 border-blue-400"
              >
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources légales */}
      {aiAnalysis.legalSources.length > 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            📚 Sources légales pertinentes
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {aiAnalysis.legalSources.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {aiAnalysis.legalSources.map((source, i) => (
              <li
                key={i}
                className="text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-gray-400"
              >
                📖 {source}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer avec informations techniques */}
      <div className="text-xs text-gray-500 border-t pt-3 mt-4">
        <div className="flex justify-between items-center">
          <span>
            Dernière analyse:{" "}
            {new Date(result.lastUpdated).toLocaleString("fr-FR")}
          </span>
          <span>
            Juridiction:{" "}
            {jurisdiction === "EU" ? "Union Européenne" : "Belgique"}
          </span>
        </div>
      </div>
    </div>
  );
}
