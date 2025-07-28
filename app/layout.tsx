import React from "react";
import "./globals.css";

export const metadata = {
  title: "Legal Checker",
  description: "Vérificateur de propositions politiques",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
