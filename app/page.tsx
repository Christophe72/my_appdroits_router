'use client';

import { useState } from 'react';
import FormProposal from '../components/FormProposal';
import ResultCard from '../components/ResultCard';

export default function HomePage() {
  const [result, setResult] = useState<any>(null);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vérificateur de propositions politiques</h1>
      <FormProposal onResult={setResult} />
      {result && <ResultCard result={result} />}
    </main>
  );
}
