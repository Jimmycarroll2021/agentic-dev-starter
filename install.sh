#!/usr/bin/env bash
# Agentic Dev Starter - One-Click Setup Script
# Transforms setup from 30+ minutes to under 5 minutes

set -euo pipefail

# Colors for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Progress tracking
TOTAL_STEPS=8
CURRENT_STEP=0

print_step() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    echo -e "${BLUE}[${CURRENT_STEP}/${TOTAL_STEPS}]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

check_requirements() {
    print_step "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed. Please install Node.js 18+ first."
        echo "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is required but not installed."
        exit 1
    fi
    
    print_success "System requirements met"
}

setup_project_structure() {
    print_step "Setting up project structure..."
    
    # Initialize git submodule
    if [ ! -d "upstream/claude-sub-agent/.git" ]; then
        git submodule update --init --recursive
        print_success "Claude sub-agent initialized"
    else
        print_success "Claude sub-agent already present"
    fi
    
    # Install dependencies
    npm install --silent
    print_success "Dependencies installed"
}

configure_claude() {
    print_step "Configuring Claude integration..."
    
    # Create .claude directory if it doesn't exist
    mkdir -p .claude
    
    # Check if Claude API key is already set
    if [ -f ".claude/config.json" ] && grep -q "api_key" .claude/config.json 2>/dev/null; then
        print_success "Claude configuration found"
        return
    fi
    
    echo -e "${YELLOW}Claude API Key Setup:${NC}"
    echo "1. Visit: https://console.anthropic.com/"
    echo "2. Create an API key"
    echo "3. Paste it below (input will be hidden)"
    echo
    
    read -s -p "Enter your Claude API key: " CLAUDE_API_KEY
    echo
    
    if [ -n "$CLAUDE_API_KEY" ]; then
        cat > .claude/config.json << EOF
{
  "api_key": "$CLAUDE_API_KEY",
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096
}
EOF
        print_success "Claude API key configured"
    else
        print_warning "Claude API key not provided. You can configure it later in .claude/config.json"
    fi
}

setup_github_integration() {
    print_step "Setting up GitHub integration..."
    
    # Check if we're in a GitHub repository
    if ! git remote get-url origin &> /dev/null; then
        print_warning "Not in a GitHub repository. Skipping GitHub-specific setup."
        return
    fi
    
    REPO_URL=$(git remote get-url origin)
    print_success "GitHub repository detected: $REPO_URL"
    
    # Check GitHub CLI
    if command -v gh &> /dev/null; then
        if gh auth status &> /dev/null; then
            print_success "GitHub CLI authenticated"
            
            # Optionally set up repository secrets
            echo -e "${YELLOW}Would you like to set up GitHub Actions secrets? (y/N):${NC}"
            read -r SETUP_SECRETS
            if [[ "$SETUP_SECRETS" =~ ^[Yy]$ ]]; then
                setup_github_secrets
            fi
        else
            print_warning "GitHub CLI not authenticated. Run: gh auth login"
        fi
    else
        print_warning "GitHub CLI not installed. Install for enhanced features: https://cli.github.com/"
    fi
}

setup_github_secrets() {
    print_step "Setting up GitHub secrets..."
    
    # Set Claude API key as GitHub secret if provided
    if [ -f ".claude/config.json" ]; then
        CLAUDE_KEY=$(grep -o '"api_key": "[^"]*"' .claude/config.json | cut -d'"' -f4)
        if [ -n "$CLAUDE_KEY" ]; then
            echo "$CLAUDE_KEY" | gh secret set CLAUDE_API_KEY
            print_success "CLAUDE_API_KEY secret created"
        fi
    fi
}

setup_optional_integrations() {
    print_step "Setting up optional integrations..."
    
    echo -e "${YELLOW}Optional integrations (press Enter to skip):${NC}"
    
    # Zenhub setup
    echo -n "Zenhub API Token (optional): "
    read -r ZENHUB_TOKEN
    if [ -n "$ZENHUB_TOKEN" ]; then
        mkdir -p .zenhub
        echo "{ \"token\": \"$ZENHUB_TOKEN\" }" > .zenhub/config.json
        print_success "Zenhub configured"
    fi
    
    # Crystal setup check
    if [ -d "crystal" ]; then
        print_success "Crystal configuration found"
    else
        print_warning "Crystal not configured. See docs for parallel development setup."
    fi
}

create_example_workflow() {
    print_step "Creating example workflow..."
    
    mkdir -p examples/quickstart
    
    cat > examples/quickstart/README.md << 'EOF'
# Quick Start Example

This example demonstrates a basic agentic development workflow.

## Try it out:

1. Run: `npm run agents:sync`
2. Use Claude Code with the configured agents
3. Create an issue using the templates in `.github/ISSUE_TEMPLATE/`
4. Watch the automated workflows in action

## Available Agents:

- spec-orchestrator: Coordinates the development process
- spec-analyst: Analyzes requirements
- spec-architect: Designs system architecture
- spec-planner: Creates implementation plans
- spec-developer: Writes code
- spec-tester: Creates and runs tests
- spec-reviewer: Reviews code quality
- spec-validator: Validates final implementation

## Next Steps:

- Explore the `docs/` directory for detailed guides
- Check out `examples/webapp/` for a full application example
- Join our community discussions for tips and best practices
EOF

    print_success "Example workflow created"
}

run_initial_sync() {
    print_step "Running initial agent synchronization..."
    
    # Sync agents from upstream
    if [ -f "scripts/agents/sync.sh" ]; then
        bash scripts/agents/sync.sh
        print_success "Agents synchronized"
    else
        print_warning "Agent sync script not found. Manual sync may be required."
    fi
}

print_completion_message() {
    echo
    echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
    echo
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Open your project in Claude Code"
    echo "2. Try the example workflow: cd examples/quickstart"
    echo "3. Read the documentation: open README.md"
    echo "4. Join our community for support and tips"
    echo
    echo -e "${BLUE}Quick Commands:${NC}"
    echo "• Sync agents:     npm run agents:sync"
    echo "• Apply Zenhub:    npm run zenhub:apply"
    echo "• View examples:   ls examples/"
    echo
    echo -e "${YELLOW}Need help?${NC} Visit: https://github.com/Jimmycarroll2021/agentic-dev-starter/discussions"
    echo
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Agentic Dev Starter Setup${NC}"
    echo "Transforming your AI development workflow..."
    echo

    check_requirements
    setup_project_structure
    configure_claude
    setup_github_integration
    setup_optional_integrations
    create_example_workflow
    run_initial_sync
    print_completion_message
}

# Handle interruptions gracefully
trap 'echo -e "\n${YELLOW}Setup interrupted. You can resume by running this script again.${NC}"; exit 1' INT

# Run main function
main "$@"