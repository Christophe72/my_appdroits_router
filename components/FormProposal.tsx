"use client";
import { useState } from "react";

interface Props {
  onResult: (res: any) => void;
}

export default function FormProposal({ onResult }: Props) {
  const [proposal, setProposal] = useState("");
  const [jurisdiction, setJurisdiction] = useState("EU");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (proposal.trim().length < 10) {
      setError("Veuillez saisir une proposition d'au moins 10 caractères.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const resp = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal: proposal.trim(), jurisdiction }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Erreur lors de l'analyse");
      }

      onResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
      onResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey && !isLoading) {
      check();
    }
  };

  const exampleProposals = {
    EU: [
      "Nous voulons encourager la libre circulation des citoyens européens",
      "Interdire l'accès aux services publics basé sur la nationalité",
      "Créer une base de données centralisée de tous les citoyens européens",
    ],
    BE: [
      "Promouvoir l'égalité des chances en emploi pour tous",
      "Discriminer les candidats selon leur origine ethnique",
      "Surveiller toutes les communications privées des citoyens",
    ],
  };

  const loadExample = (example: string) => {
    setProposal(example);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Formulaire principal */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="proposal"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              📝 Votre proposition politique
            </label>
            <textarea
              id="proposal"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              rows={6}
              placeholder="Décrivez votre proposition politique ici... (minimum 10 caractères)"
              value={proposal}
              onChange={(e) => {
                setProposal(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <span
                className={`text-xs ${
                  proposal.length >= 10 ? "text-green-600" : "text-gray-400"
                }`}
              >
                {proposal.length} caractères (minimum 10)
              </span>
              <span className="text-xs text-gray-400">
                Ctrl + Entrée pour analyser rapidement
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label
                htmlFor="jurisdiction"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                🌍 Juridiction
              </label>
              <select
                id="jurisdiction"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="EU">🇪🇺 Union Européenne</option>
                <option value="BE">🇧🇪 Belgique</option>
              </select>
            </div>

            <div className="flex-1 flex justify-end">
              <button
                onClick={check}
                disabled={isLoading || proposal.trim().length < 10}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Analyse en cours...
                  </>
                ) : (
                  <>🔍 Vérifier la conformité</>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ❌ {error}
            </div>
          )}
        </div>
      </div>

      {/* Exemples de propositions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          💡 Exemples de propositions (
          {jurisdiction === "EU" ? "Union Européenne" : "Belgique"})
        </h3>
        <div className="grid gap-2">
          {exampleProposals[jurisdiction as keyof typeof exampleProposals].map(
            (example, i) => (
              <button
                key={i}
                onClick={() => loadExample(example)}
                className="text-left p-2 bg-white rounded border hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                disabled={isLoading}
              >
                <span className="text-gray-500 mr-2">#{i + 1}</span>
                {example}
              </button>
            )
          )}
        </div>
      </div>

      {/* Informations sur l'IA */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
          🤖 Analyse IA avancée
        </h3>
        <p className="text-xs text-blue-700">
          Notre système utilise l'intelligence artificielle pour détecter les
          contradictions légales complexes, analyser les risques juridiques et
          proposer des améliorations. L'analyse combine la recherche textuelle
          traditionnelle avec une compréhension contextuelle avancée des lois{" "}
          {jurisdiction === "EU" ? "européennes" : "belges"}.
        </p>
      </div>
    </div>
  );
}
