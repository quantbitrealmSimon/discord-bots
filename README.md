# 🎉 Welcome Bot for Discord

A professional Discord welcome bot that greets new members with customizable messages, auto-role assignment, and server statistics.

[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue.svg)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/node.js-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## ✨ Features

### Free Tier
- 👋 **Automatic Welcome Messages** - Greet every new member with a beautiful embed
- 🎭 **Auto-Role Assignment** - Automatically assign roles to new members
- 📊 **Member Statistics** - Track welcomes sent and roles assigned
- 🔧 **Easy Configuration** - Set welcome channel and auto-role via slash commands
- ⏱️ **Uptime Tracking** - Monitor bot health and performance

### Premium Features (Contact for upgrade)
- 📩 **DM Welcome Messages** - Send personalized welcome DMs
- 🎨 **Custom Templates** - Fully customizable message templates with variables
- 🖼️ **Welcome Cards** - Beautiful image-based welcome cards
- 📈 **Analytics Dashboard** - Detailed insights and metrics
- 🔄 **Multiple Messages** - Rotate between different welcome messages

---

## 🚀 Quick Start

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" tab and click "Add Bot"
4. Copy your **Token** (keep it secret!)
5. Enable these **Privileged Gateway Intents**:
   - ✓ SERVER MEMBERS INTENT
   - ✓ MESSAGE CONTENT INTENT (optional)

### 2. Invite the Bot to Your Server

1. Go to "OAuth2" → "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Select permissions:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Read Message History
   - ✅ Manage Roles (for auto-role)
   - ✅ View Channels
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

**Quick Invite Link Template:**
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot%20applications.commands
```
Replace `YOUR_CLIENT_ID` with your bot's Application ID.

### 3. Install and Run

```bash
# Clone or download the bot
cd welcome-bot

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor

# Deploy slash commands (first time only)
npm run deploy-commands

# Start the bot
npm start
```

### 4. Configure the Bot

Use these slash commands in your Discord server:

| Command | Description | Permission |
|---------|-------------|------------|
| `/setchannel #channel` | Set where welcome messages appear | Admin only |
| `/setrole @role` | Set auto-role for new members | Admin only |
| `/welcome` | Test the welcome message | Admin only |
| `/stats` | View bot statistics | Everyone |
| `/help` | Show help and commands | Everyone |

---

## 🔧 Environment Variables

Create a `.env` file with these variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ | Your bot token from Discord Developer Portal |
| `CLIENT_ID` | ✅ | Application ID from Discord Developer Portal |
| `GUILD_ID` | ❌ | Server ID for testing (speeds up command deployment) |
| `WELCOME_CHANNEL_ID` | ❌ | Default welcome channel (can be set via /setchannel) |
| `AUTO_ROLE_ID` | ❌ | Default auto-role (can be set via /setrole) |
| `WELCOME_MESSAGE` | ❌ | Custom welcome text. Use `{user}` to mention the new member |
| `ENABLE_DM_WELCOME` | ❌ | Set to `true` to enable DM welcomes (Premium) |
| `DM_WELCOME_MESSAGE` | ❌ | Message sent via DM to new members |

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Using Docker directly

```bash
# Build image
docker build -t welcome-bot .

# Run container
docker run -d \
  --name welcome-bot \
  --env-file .env \
  --restart unless-stopped \
  welcome-bot
```

---

## 🚀 Production Deployment

### Railway (Easiest)

1. Fork this repository to your GitHub account
2. Create a new project on [Railway](https://railway.app)
3. Deploy from GitHub repo
4. Add environment variables in Railway dashboard
5. Deploy!

### Fly.io

```bash
# Install flyctl (if not already installed)
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch
flyctl launch

# Set secrets
flyctl secrets set DISCORD_TOKEN=your_token CLIENT_ID=your_id

# Deploy
flyctl deploy
```

### VPS / Self-hosted

```bash
# Use PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name welcome-bot

# Save PM2 config
pm2 save
pm2 startup
```

---

## 📝 Customization

### Welcome Message Variables

In your `WELCOME_MESSAGE` or `DM_WELCOME_MESSAGE`, you can use:

| Variable | Description | Example |
|----------|-------------|---------|
| `{user}` | Mentions the new member | `@username` |
| `{username}` | Username without mention | `username` |
| `{guild}` | Server name | `My Awesome Server` |
| `{count}` | Current member count | `42` |

### Example Custom Messages

```env
# Simple
WELCOME_MESSAGE=Hey {user}! Welcome to {guild}! You're member #{count}.

# With formatting
WELCOME_MESSAGE=🎉 Welcome {user} to **{guild}**! We're now {count} members strong!

# Multi-line (use \n for newlines)
WELCOME_MESSAGE=Welcome {user}!\n\n📜 Please read the rules\n💬 Introduce yourself\n🎉 Have fun!
```

---

## 🛠️ Troubleshooting

### Bot not responding to commands?
- Make sure you ran `npm run deploy-commands`
- Check that `CLIENT_ID` is correct in `.env`
- The bot needs `applications.commands` scope when invited

### Welcome messages not sending?
- Verify `WELCOME_CHANNEL_ID` points to a valid text channel
- Check that bot has "Send Messages" and "Embed Links" permissions
- Check console for error messages

### Auto-role not working?
- Ensure bot has "Manage Roles" permission
- The auto-role must be **below** the bot's highest role in the role hierarchy
- Check that `AUTO_ROLE_ID` is correct

### Commands not showing up?
- Slash commands can take up to 1 hour to propagate globally
- For instant updates, use `GUILD_ID` in `.env` for guild-specific commands
- Run `npm run deploy-commands` after any command changes

---

## 📁 Project Structure

```
welcome-bot/
├── src/
│   ├── commands/          # Slash command definitions
│   ├── events/            # Event handlers (ready, member join, etc.)
│   ├── utils/             # Utility functions
│   ├── index.js           # Bot entry point
│   └── deploy-commands.js # Command deployment script
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── docker-compose.yml    # Docker Compose config
├── Dockerfile            # Docker image definition
├── package.json          # Node.js dependencies
└── README.md             # This file
```

---

## 🔄 Upgrading from Free to Premium

Contact `QuantBitRealm` to upgrade:

- **DM Welcome Messages**: `$20`
- **Custom Templates**: `$30`
- **Welcome Cards**: `$50`
- **Analytics Dashboard**: `$40`
- **Full Premium Bundle**: `$100` (save $40)

---

## 📜 License

MIT License - feel free to use this bot for personal or commercial projects.

---

## 🤝 Support

Need help? Have questions?

- 📧 Email: support@quantbitrealm.com
- 💬 Discord: QuantBitRealm#0000
- 🐛 Issues: [GitHub Issues](https://github.com/quantbitrealmSimon/discord-bots/issues)

---

**Built with ❤️ by QuantBitRealm**

**GitHub Repository:** https://github.com/quantbitrealmSimon/discord-bots/tree/welcome-bot