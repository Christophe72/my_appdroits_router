# My Legal Checker App Router 🏛️⚖️

Une application Next.js moderne pour vérifier la conformité légale des propositions politiques avec les lois européennes et belges.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📋 Utilisation

1. **Saisissez votre proposition** dans le champ de texte
2. **Sélectionnez la juridiction** (UE ou Belgique)
3. **Cliquez sur "Vérifier"** pour analyser la conformité
4. **Consultez les résultats** :
   - ✅ **Conforme** : Aucun conflit détecté
   - ❌ **Non conforme** : Conflits identifiés avec références légales

## 🏗️ Structure du projet

```
my-legal-checker-app-router/
├── app/                    # App Router Next.js 14
│   ├── page.tsx           # Page d'accueil
│   ├── layout.tsx         # Layout principal
│   ├── globals.css        # Styles globaux
│   └── api/
│       └── check/
│           └── route.ts   # API de vérification
├── components/            # Composants React
│   ├── FormProposal.tsx   # Formulaire de saisie
│   └── ResultCard.tsx     # Affichage des résultats
├── lib/                   # Services et utilitaires
│   ├── lawService.ts      # Service de recherche légale
│   └── ai.ts             # Service d'analyse
├── data/                  # Base de données fictive
│   └── laws.json         # Lois UE et Belgique
└── prisma/               # Configuration Prisma (future extension)
    └── schema.prisma
```

## 🛠️ Technologies utilisées

- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **React 18** pour l'interface utilisateur
- **Prisma** pour la base de données (prêt pour l'extension)
- **CSS** pour le styling

## 📖 Exemples de test

### Proposition conforme

```
"Nous encourageons la libre circulation des citoyens européens"
→ Juridiction: UE → ✅ Conforme
```

### Proposition non conforme

```
"Nous voulons discriminer basé sur la nationalité"
→ Juridiction: Belgique → ❌ Conflit avec la loi anti-discrimination
```

## 🔧 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification du code
npm run db:push      # Synchronisation Prisma (future)
npm run db:generate  # Génération client Prisma (future)
```

## 🚀 Extensions futures

- [ ] **Base de données réelle** : Intégration avec EUR-Lex et Moniteur belge
- [ ] **Authentification** : Système de comptes utilisateurs avec NextAuth
- [ ] **Historique** : Sauvegarde des vérifications précédentes
- [ ] **IA avancée** : Intégration OpenAI/Claude pour analyse jurisprudentielle
- [ ] **Multi-juridictions** : Support d'autres pays européens
- [ ] **API REST** : Endpoints pour intégrations tierces
- [ ] **Notifications** : Alertes en temps réel
- [ ] **Export PDF** : Rapports détaillés

## 🎯 Cas d'usage

- **Partis politiques** : Vérification de conformité des programmes
- **Consultants** : Audit de propositions législatives
- **Étudiants** : Apprentissage du droit européen
- **Citoyens** : Compréhension des enjeux légaux

## 📄 Licence

Ce projet est à des fins éducatives et de démonstration. Les données légales sont fictives et ne constituent pas un conseil juridique.
