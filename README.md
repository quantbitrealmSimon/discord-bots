# 🛡️ QuantBit Moderation Bot

A professional Discord moderation bot with comprehensive punishment tools, warning system, logging, and auto-moderation features.

## ✨ Features

### 🔨 Punishment Commands
- **Kick** — Remove members from the server
- **Ban/Unban** — Permanent removal with optional message deletion
- **Mute/Unmute** — Timeout members with customizable duration (supports 1m, 1h, 1d format)

### ⚠️ Warning System
- Issue warnings with reasons
- View all warnings per user
- Remove specific warnings
- **Auto-ban** after configurable number of warnings (default: 3)
- Persistent SQLite database

### 📋 Management Commands
- **Clear** — Bulk delete messages (1-100) with optional user filter
- **Lock/Unlock** — Restrict channel messaging
- **Slowmode** — Set rate limits per channel

### 📊 Logging & History
- All actions logged to designated channel
- Complete moderation history per user
- Database persistence across restarts

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ or Docker
- Discord Bot Token ([Get one here](https://discord.com/developers/applications))

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/quantbitrealmSimon/discord-bots.git
cd discord-bots/moderation-bot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values
```

### 3. Discord Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application → Name your bot
3. Go to "Bot" section → Enable "Server Members Intent" and "Message Content Intent"
4. Copy Token → Paste in `.env` as `DISCORD_TOKEN`
5. Copy Application ID → Paste in `.env` as `CLIENT_ID`
6. Go to "OAuth2" → URL Generator:
   - Scope: `bot`, `applications.commands`
   - Bot Permissions: `Kick Members`, `Ban Members`, `Manage Messages`, `Manage Channels`, `Moderate Members`, `View Audit Log`

### 4. Deploy Commands

```bash
npm run deploy
```

### 5. Start the Bot

```bash
# Development
npm run dev

# Production
npm start
```

## 🐳 Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f bot

# Stop
docker-compose down
```

## ⚙️ Configuration

Edit `.env` file:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_test_guild_id_here  # Optional, for faster command updates

LOG_CHANNEL_ID=your_log_channel_id_here  # Where mod actions are logged
MUTED_ROLE_ID=your_muted_role_id_here    # Optional, for role-based muting

MAX_WARNINGS_BEFORE_BAN=3
AUTO_DELETE_INVITES=true
AUTO_DELETE_SPAM=true
SPAM_THRESHOLD=5
```

## 📋 Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/kick @user [reason]` | Kick a member | Kick Members |
| `/ban @user [reason] [days]` | Ban a member | Ban Members |
| `/unban user_id [reason]` | Unban a user | Ban Members |
| `/mute @user duration [reason]` | Timeout member | Moderate Members |
| `/unmute @user [reason]` | Remove timeout | Moderate Members |
| `/warn @user reason` | Issue warning | Moderate Members |
| `/warnings [@user]` | View warnings | Moderate Members |
| `/clear amount [@user]` | Delete messages | Manage Messages |
| `/lock [channel] [reason]` | Lock channel | Manage Channels |
| `/unlock [channel]` | Unlock channel | Manage Channels |
| `/slowmode seconds [channel]` | Set slowmode | Manage Channels |
| `/modlogs @user` | View mod history | Moderate Members |
| `/help` | Show help | Everyone |

## 🔗 Invite Link Template

Replace `YOUR_CLIENT_ID` with your bot's Application ID:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=1099511629111&scope=bot%20applications.commands
```

**Required Permissions:**
- Kick Members
- Ban Members
- Manage Messages
- Manage Channels
- Moderate Members
- View Audit Log
- Send Messages
- Embed Links
- Read Message History

## 📁 Project Structure

```
moderation-bot/
├── src/
│   ├── commands/          # Slash command handlers
│   ├── events/            # Discord event handlers
│   ├── utils/             # Database & logger
│   ├── config.js          # Configuration loader
│   ├── index.js           # Bot entry point
│   └── deploy-commands.js # Command deployment
├── data/                  # SQLite database
├── .env.example           # Environment template
├── docker-compose.yml     # Docker config
├── Dockerfile             # Container build
└── package.json
```

## 💰 Monetization

This bot is designed to be monetizable:

- **Free Tier**: Basic moderation commands
- **Premium Tier ($5/month)**: 
  - Auto-moderation (spam, invites)
  - Advanced logging with exports
  - Custom punishment messages
  - Priority support

## 📝 License

MIT License - Feel free to use and modify.

## 🆘 Support

For support, contact: support@quantbitrealm.dev

---

Made with ❤️ by **QuantBitRealm**