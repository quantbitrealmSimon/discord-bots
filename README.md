# 🤖 QuantZen AI Chatbot for Discord

A powerful, monetizable AI chatbot for Discord with conversation memory, customizable personalities, and premium features. Built with discord.js v14 and TypeScript.

## ✨ Features

- **💬 AI-Powered Conversations** - Natural chat with GPT-4o-mini (OpenAI) or Kimi K2.5
- **🧠 Conversation Memory** - Remembers context across messages per user/server
- **🎭 6 Personality Modes** - Default, Professional, Creative, Friendly, Sarcastic, Expert
- **🔒 Private Mode** - Confidential responses via ephemeral messages
- **📊 Usage Statistics** - Track messages and conversations
- **💎 Premium-Ready** - Built-in structure for upselling unlimited messages
- **🐳 Docker Support** - One-command deployment

## 📋 Commands

| Command | Description |
|---------|-------------|
| `/chat <message>` | Chat with the AI |
| `/personality <style>` | Set your AI personality |
| `/clear` | Clear conversation history |
| `/stats` | View usage statistics |
| `/help` | Show help and information |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Discord Bot Token ([Get one here](https://discord.com/developers/applications))
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone and install:**
```bash
git clone https://github.com/quantbitrealmSimon/discord-bots.git
cd discord-bots/quantzen-ai-chatbot
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your tokens
```

3. **Build and run:**
```bash
npm run build
npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🔧 Configuration

### Required Environment Variables

```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_application_id
OPENAI_API_KEY=your_openai_key
```

### Optional Configuration

```env
AI_PROVIDER=openai          # or 'kimi' for Moonshot AI
AI_MODEL=gpt-4o-mini        # or 'kimi-k2.5'
MAX_CONTEXT_MESSAGES=10     # Messages to remember
RATE_LIMIT_PER_MINUTE=20    # Free tier limit
BOT_NAME=QuantZen AI
```

## 💎 Monetization Strategy

This bot is designed for recurring revenue:

### Free Tier
- 50 messages per day
- Basic personalities
- 7-day conversation history

### Premium Tier ($5-10/month)
- Unlimited messages
- Image generation
- Custom knowledge base
- Priority support
- Longer memory (30 days)

## 🏗️ Project Structure

```
quantzen-ai-chatbot/
├── src/
│   ├── commands/          # Slash commands
│   ├── database/          # SQLite database
│   ├── events/            # Discord event handlers
│   ├── services/          # AI integration
│   ├── utils/             # Logger and helpers
│   ├── config.ts          # Configuration
│   ├── types/             # TypeScript types
│   └── index.ts           # Entry point
├── data/                  # SQLite database storage
├── logs/                  # Application logs
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🤝 Invite the Bot

Generate your invite link:
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147485696&scope=bot%20applications.commands
```

Required permissions:
- Send Messages
- Read Message History
- Use Slash Commands
- Embed Links

## 📄 License

MIT License - See LICENSE for details

## 🔗 Links

- [GitHub Repository](https://github.com/quantbitrealmSimon/discord-bots)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [OpenAI Platform](https://platform.openai.com)

---

Built with ❤️ by [QuantBitRealm](https://github.com/quantbitrealmSimon)
