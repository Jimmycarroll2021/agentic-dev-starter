# 🚀 Quick Start Guide

Get your agentic development environment running in under 5 minutes!

## Prerequisites

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/))
- **Claude API Key** ([Get one here](https://console.anthropic.com/))

## Option 1: NPX (Recommended)

The fastest way to get started:

```bash
npx agentic-dev-starter
```

This will:
- ✅ Create a new project directory
- ✅ Install all dependencies
- ✅ Set up your AI agents
- ✅ Configure integrations
- ✅ Provide a working example

## Option 2: Use as Template

1. **Click "Use this template"** on the GitHub repository
2. **Clone your new repository**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   ```
3. **Run setup**:
   ```bash
   npm run setup
   ```

## Option 3: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/Jimmycarroll2021/agentic-dev-starter.git
cd agentic-dev-starter

# Run interactive setup
npm run setup
```

## What Happens During Setup

### Step 1: System Check ✅
- Verifies Node.js 18+ is installed
- Checks Git availability
- Detects GitHub CLI (optional)

### Step 2: Project Structure 📁
- Initializes git submodules
- Installs npm dependencies  
- Sets up directory structure

### Step 3: Claude Integration 🤖
- Prompts for your Claude API key
- Creates secure configuration
- Tests connection

### Step 4: GitHub Integration 🐙
- Detects GitHub repository
- Sets up Actions secrets (optional)
- Configures automation

### Step 5: Optional Features ⚡
- Zenhub project management
- Crystal parallel development
- Additional integrations

### Step 6: Agent Sync 🔄
- Downloads latest AI agents
- Configures agent permissions
- Validates setup

## First Steps After Setup

### 1. Test Your Environment
```bash
# Verify agents are available
npm run agents:sync

# Check project structure
ls -la
```

### 2. Try the Example Workflow
```bash
cd examples/quickstart
cat README.md
```

### 3. Open in Claude Code
- Open your project directory
- Your AI agents are now available!
- Try asking: "What agents do I have available?"

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Interactive setup wizard |
| `npm run agents:sync` | Synchronize AI agents |
| `npm run zenhub:apply` | Apply project management templates |
| `npm run dev` | Start development workflow |

## Common Issues & Solutions

### "Node.js version too old"
**Problem**: Your Node.js version is below 18  
**Solution**: Install Node.js 18+ from [nodejs.org](https://nodejs.org/)

### "Git not found"
**Problem**: Git is not installed or not in PATH  
**Solution**: Install Git from [git-scm.com](https://git-scm.com/)

### "Claude API key invalid"
**Problem**: API key is incorrect or expired  
**Solution**: Generate a new key at [console.anthropic.com](https://console.anthropic.com/)

### "Submodule sync failed"
**Problem**: Network issues or Git configuration  
**Solution**: Run `git submodule update --init --recursive --force`

## Next Steps

Once setup is complete:

1. **📖 Read the Documentation**
   - Check out the main [README](../README.md)
   - Explore [examples](../examples/)

2. **🤖 Learn About Your Agents**
   - Each agent has specific capabilities
   - Use them in Claude Code as sub-agents
   - Check the `.claude/` directory for configurations

3. **🔧 Customize Your Workflow**  
   - Modify agent settings in `.claude/config.json`
   - Add custom issue templates
   - Configure additional integrations

4. **🚀 Start Building**
   - Create your first issue using the templates
   - Watch the agents work together
   - Experience AI-powered development!

## Getting Help

If you encounter issues:

- 💬 **Community**: [GitHub Discussions](https://github.com/Jimmycarroll2021/agentic-dev-starter/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Jimmycarroll2021/agentic-dev-starter/issues)
- 📧 **Direct Support**: Run `npm run help` for assistance

---

**🎉 Congratulations! You now have a professional AI-powered development environment!**