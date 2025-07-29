// app/api/search-eurlex/route.ts
import { NextRequest, NextResponse } from "next/server";

const endpoint = "https://eur-lex.europa.eu/sparql";

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();
  if (!keyword) {
    return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
  }

  const sparqlQuery = `
    PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>

    SELECT ?title ?date ?celex WHERE {
      ?doc a cdm:legal_resource ;
           cdm:work_title ?title ;
           cdm:work_date_document ?date ;
           cdm:work_celex_number ?celex .
      FILTER(CONTAINS(LCASE(STR(?title)), "${keyword.toLowerCase()}"))
    }
    LIMIT 10
  `;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/sparql-query",
        Accept: "application/sparql-results+json",
      },
      body: sparqlQuery,
    });

    const data = await res.json();
    const results = data?.results?.bindings.map((item: any) => ({
      title: item.title.value,
      date: item.date?.value || null,
      celex: item.celex.value,
      url: `https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:${item.celex.value}`,
    }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch from EUR-Lex" },
      { status: 500 }
    );
  }
}
