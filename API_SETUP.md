# Configuration des clés API pour l'IA

## 🔑 Comment obtenir vos clés API

### OpenAI (GPT-4)

1. Allez sur [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Créez un compte ou connectez-vous
3. Cliquez sur "Create new secret key"
4. Copiez la clé et remplacez `your-openai-api-key-here` dans `.env.local`

### Anthropic Claude (Optionnel)

1. Allez sur [https://console.anthropic.com/](https://console.anthropic.com/)
2. Créez un compte ou connectez-vous
3. Générez une clé API
4. Remplacez `your-anthropic-api-key-here` dans `.env.local`

## ⚙️ Configuration

1. Ouvrez le fichier `.env.local`
2. Remplacez les valeurs par vos vraies clés :

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🧪 Mode Test

Si vous n'avez pas de clés API, l'application fonctionne en mode simulation avec une IA basique qui :

- Détecte les mots-clés problématiques
- Génère des recommandations contextuelles
- Simule une analyse de confiance

## 💰 Coûts estimés

### OpenAI GPT-4

- ~$0.03 par 1K tokens d'entrée
- ~$0.06 par 1K tokens de sortie
- Une analyse = ~500 tokens = ~$0.025

### Anthropic Claude

- ~$0.015 par 1K tokens d'entrée
- ~$0.075 par 1K tokens de sortie
- Une analyse = ~500 tokens = ~$0.045

## 🔒 Sécurité

- Ne commitez JAMAIS vos clés API dans Git
- Le fichier `.env.local` est ignoré par défaut
- Utilisez des variables d'environnement en production
