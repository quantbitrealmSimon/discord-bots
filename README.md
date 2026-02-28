# 🤖 Welcome Bot for Discord

A production-ready Discord bot that automatically welcomes new members with customizable messages, rich embeds, and goodbye notifications.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue.svg)

## ✨ Features

- **Automatic Welcome Messages** — Greets new members instantly when they join
- **Rich Embeds** — Beautiful formatted messages with user info and avatar
- **Goodbye Messages** — Optional farewell when members leave
- **Member Count** — Shows server's current member count
- **Account Age** — Displays when user account was created
- **Slash Commands** — Modern `/command` interface
- **DM Welcome** — Optionally send direct messages to new members
- **Auto-Roles** — Automatically assign roles to new members

## 🚀 Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/ping` | Check bot latency | Everyone |
| `/help` | Show help information | Everyone |
| `/welcome test` | Test welcome message | Manage Server |
| `/welcome config` | View configuration | Manage Server |
| `/welcome setchannel` | Set welcome channel | Manage Server |

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- A Discord bot token ([Get one here](https://discord.com/developers/applications))

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/quantbitrealmSimon/discord-bots.git
cd discord-bots/welcome-bot

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your bot token

# 4. Build and deploy commands
npm run build
npx ts-node deploy-commands.ts

# 5. Start the bot
npm start
```

### Docker Setup

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or build manually
docker build -t welcome-bot .
docker run -d --env-file .env welcome-bot
```

## ⚙️ Configuration

Edit your `.env` file:

```env
# Required
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here

# Optional
WELCOME_CHANNEL_ID=1234567890123456789    # Specific channel for welcomes
ENABLE_DM_WELCOME=true                    # Send DM to new members
AUTO_ROLES=role_id_1,role_id_2           # Auto-assign roles
WELCOME_MESSAGE=Welcome {user}!           # Custom welcome text
```

## 🔗 Invite Link Template

Replace `YOUR_CLIENT_ID` with your bot's Application ID:

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435520&scope=bot%20applications.commands
```

**Required Permissions:**
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- View Channels
- Manage Roles (for auto-roles)
- Send DM (for DM welcome)

## 🏗️ Project Structure

```
welcome-bot/
├── src/
│   ├── commands/          # Slash commands
│   ├── events/            # Discord event handlers
│   ├── services/          # Business logic
│   ├── utils/             # Utilities
│   └── index.ts           # Entry point
├── deploy-commands.ts     # Register slash commands
├── Dockerfile             # Container image
├── docker-compose.yml     # Docker orchestration
└── package.json
```

## 💰 Premium Features

Upgrade to Premium for:
- Custom welcome message templates
- Multiple welcome channels per server
- Welcome message scheduling
- Analytics dashboard
- Priority support

Contact: quantbitrealm@example.com

## 📝 License

MIT License — See [LICENSE](LICENSE) for details.

---

Built with ❤️ by [QuantBitRealm](https://github.com/quantbitrealmSimon)
