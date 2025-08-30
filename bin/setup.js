#!/usr/bin/env node
/**
 * Agentic Dev Starter - Interactive Setup CLI
 * Cross-platform setup with beautiful UX
 */

import { execSync, spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Colors and styling
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bright: '\x1b[1m'
};

const symbols = {
    tick: '✓',
    cross: '✗',
    warning: '⚠',
    arrow: '→',
    star: '⭐',
    rocket: '🚀'
};

class SetupWizard {
    constructor() {
        this.rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.totalSteps = 7;
        this.currentStep = 0;
        this.config = {};
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    logStep(message) {
        this.currentStep++;
        const progress = `[${this.currentStep}/${this.totalSteps}]`;
        this.log(`${colors.blue}${progress}${colors.reset} ${message}`);
    }

    logSuccess(message) {
        this.log(`${symbols.tick} ${message}`, 'green');
    }

    logError(message) {
        this.log(`${symbols.cross} ${message}`, 'red');
    }

    logWarning(message) {
        this.log(`${symbols.warning} ${message}`, 'yellow');
    }

    async question(prompt, defaultValue = '') {
        return new Promise(resolve => {
            const fullPrompt = defaultValue 
                ? `${prompt} (default: ${defaultValue}): `
                : `${prompt}: `;
            
            this.rl.question(`${colors.cyan}${fullPrompt}${colors.reset}`, answer => {
                resolve(answer.trim() || defaultValue);
            });
        });
    }

    async confirm(message, defaultValue = false) {
        const defaultText = defaultValue ? 'Y/n' : 'y/N';
        const answer = await this.question(`${message} (${defaultText})`);
        
        if (!answer) return defaultValue;
        return answer.toLowerCase().startsWith('y');
    }

    checkRequirements() {
        this.logStep('Checking system requirements...');

        // Check Node.js version
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
        
        if (majorVersion < 18) {
            this.logError(`Node.js 18+ required. Current: ${nodeVersion}`);
            process.exit(1);
        }

        // Check Git
        try {
            execSync('git --version', { stdio: 'ignore' });
        } catch (error) {
            this.logError('Git is required but not installed');
            process.exit(1);
        }

        // Check GitHub CLI (optional)
        try {
            execSync('gh --version', { stdio: 'ignore' });
            this.config.hasGitHub = true;
        } catch (error) {
            this.config.hasGitHub = false;
        }

        this.logSuccess('System requirements met');
    }

    setupProject() {
        this.logStep('Setting up project structure...');

        try {
            // Initialize submodules
            execSync('git submodule update --init --recursive', { 
                cwd: ROOT_DIR,
                stdio: 'pipe'
            });
            this.logSuccess('Submodules initialized');

            // Install dependencies
            execSync('npm install', { 
                cwd: ROOT_DIR,
                stdio: 'pipe'
            });
            this.logSuccess('Dependencies installed');
        } catch (error) {
            this.logError(`Setup failed: ${error.message}`);
            process.exit(1);
        }
    }

    async configureClaude() {
        this.logStep('Configuring Claude integration...');

        const claudeDir = join(ROOT_DIR, '.claude');
        if (!existsSync(claudeDir)) {
            mkdirSync(claudeDir, { recursive: true });
        }

        const configPath = join(claudeDir, 'config.json');
        
        if (existsSync(configPath)) {
            this.logSuccess('Claude configuration found');
            return;
        }

        this.log('\n📋 Claude API Key Setup:', 'yellow');
        this.log('1. Visit: https://console.anthropic.com/');
        this.log('2. Create an API key');
        this.log('3. Paste it below\n');

        const apiKey = await this.question('Claude API Key (leave blank to skip)');
        
        if (apiKey) {
            const config = {
                api_key: apiKey,
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4096
            };

            writeFileSync(configPath, JSON.stringify(config, null, 2));
            this.config.claudeKey = apiKey;
            this.logSuccess('Claude API key configured');
        } else {
            this.logWarning('Skipping Claude configuration');
        }
    }

    async setupGitHub() {
        this.logStep('Setting up GitHub integration...');

        try {
            const remoteUrl = execSync('git remote get-url origin', { 
                cwd: ROOT_DIR,
                encoding: 'utf8'
            }).trim();
            
            this.logSuccess(`Repository: ${remoteUrl}`);

            if (this.config.hasGitHub) {
                try {
                    execSync('gh auth status', { stdio: 'ignore' });
                    this.logSuccess('GitHub CLI authenticated');
                    
                    if (this.config.claudeKey) {
                        const setupSecrets = await this.confirm('Set up GitHub Actions secrets?');
                        if (setupSecrets) {
                            await this.setupGitHubSecrets();
                        }
                    }
                } catch (error) {
                    this.logWarning('GitHub CLI not authenticated. Run: gh auth login');
                }
            } else {
                this.logWarning('GitHub CLI not installed. Enhanced features unavailable.');
            }
        } catch (error) {
            this.logWarning('Not in a GitHub repository');
        }
    }

    async setupGitHubSecrets() {
        if (this.config.claudeKey) {
            try {
                const process = spawn('gh', ['secret', 'set', 'CLAUDE_API_KEY'], {
                    cwd: ROOT_DIR,
                    stdio: ['pipe', 'pipe', 'pipe']
                });

                process.stdin.write(this.config.claudeKey);
                process.stdin.end();

                await new Promise((resolve, reject) => {
                    process.on('close', (code) => {
                        if (code === 0) {
                            this.logSuccess('GitHub secret CLAUDE_API_KEY created');
                            resolve();
                        } else {
                            reject(new Error(`Failed to set secret: ${code}`));
                        }
                    });
                });
            } catch (error) {
                this.logWarning(`Failed to set GitHub secret: ${error.message}`);
            }
        }
    }

    async setupOptionalIntegrations() {
        this.logStep('Setting up optional integrations...');

        // Zenhub integration
        const setupZenhub = await this.confirm('Configure Zenhub integration?');
        if (setupZenhub) {
            const zenhubToken = await this.question('Zenhub API Token');
            if (zenhubToken) {
                const zenhubDir = join(ROOT_DIR, '.zenhub');
                if (!existsSync(zenhubDir)) {
                    mkdirSync(zenhubDir);
                }
                
                const config = { token: zenhubToken };
                writeFileSync(join(zenhubDir, 'config.json'), JSON.stringify(config, null, 2));
                this.logSuccess('Zenhub configured');
            }
        }

        // Crystal check
        if (existsSync(join(ROOT_DIR, 'crystal'))) {
            this.logSuccess('Crystal configuration found');
        } else {
            this.logWarning('Crystal not configured (parallel development disabled)');
        }
    }

    createExamples() {
        this.logStep('Creating example workflows...');

        const examplesDir = join(ROOT_DIR, 'examples', 'quickstart');
        if (!existsSync(examplesDir)) {
            mkdirSync(examplesDir, { recursive: true });
        }

        const readmeContent = `# Quick Start Example

Welcome to your agentic development environment!

## ${symbols.rocket} Try it out:

1. Run: \`npm run agents:sync\`
2. Open Claude Code in your project
3. Use the configured agents for development
4. Create issues with templates in \`.github/ISSUE_TEMPLATE/\`

## ${symbols.star} Available Agents:

- **spec-orchestrator**: Coordinates development workflow
- **spec-analyst**: Analyzes requirements and specs
- **spec-architect**: Designs system architecture  
- **spec-planner**: Creates implementation plans
- **spec-developer**: Writes production code
- **spec-tester**: Creates comprehensive tests
- **spec-reviewer**: Reviews code quality
- **spec-validator**: Validates implementations

## Next Steps:

${symbols.arrow} Read the full documentation in \`README.md\`
${symbols.arrow} Explore \`examples/webapp/\` for a complete example
${symbols.arrow} Join community discussions for tips and support

Happy coding! ${symbols.tick}
`;

        writeFileSync(join(examplesDir, 'README.md'), readmeContent);
        this.logSuccess('Example workflows created');
    }

    runInitialSync() {
        this.logStep('Running initial agent synchronization...');

        try {
            execSync('npm run agents:sync', { 
                cwd: ROOT_DIR,
                stdio: 'pipe'
            });
            this.logSuccess('Agents synchronized successfully');
        } catch (error) {
            this.logWarning('Agent sync encountered issues - you can run manually later');
        }
    }

    showCompletionMessage() {
        console.log('\n' + '='.repeat(60));
        this.log(`${symbols.rocket} Setup completed successfully!`, 'green');
        console.log('='.repeat(60));

        this.log('\n📋 Next Steps:', 'bright');
        this.log('1. Open your project in Claude Code');
        this.log('2. Try: cd examples/quickstart && cat README.md');
        this.log('3. Create your first agent-powered feature!');

        this.log('\n⚡ Quick Commands:', 'bright');
        this.log('• Sync agents:     npm run agents:sync');
        this.log('• Apply Zenhub:    npm run zenhub:apply');
        this.log('• View examples:   ls examples/');

        this.log('\n🤝 Need Help?', 'bright');
        this.log('Visit: https://github.com/Jimmycarroll2021/agentic-dev-starter/discussions');
        this.log('');
    }

    async run() {
        try {
            console.clear();
            this.log(`${symbols.rocket} Agentic Dev Starter Setup`, 'blue');
            this.log('Transforming your AI development workflow...\n', 'cyan');

            this.checkRequirements();
            this.setupProject();
            await this.configureClaude();
            await this.setupGitHub();
            await this.setupOptionalIntegrations();
            this.createExamples();
            this.runInitialSync();
            this.showCompletionMessage();

        } catch (error) {
            this.logError(`Setup failed: ${error.message}`);
            process.exit(1);
        } finally {
            this.rl.close();
        }
    }
}

// Handle interruptions gracefully
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Setup interrupted. You can resume by running this script again.');
    process.exit(1);
});

// Run setup wizard
const wizard = new SetupWizard();
wizard.run();