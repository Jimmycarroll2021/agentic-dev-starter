# Sub-agent practices (field-tested)

## 🎯 **Why Sub-Agents Exist (The Original Problem)**

### **Context Window Crisis**
> *"Before cloud code has the sub agent feature everything will be done by the cloud code agent itself which means before it start implementing It might already use 80% of the context window... which will likely trigger this compact conversation command that will summarize the whole conversation before it can proceed. And as we know every time when you compact conversation the performance just dropped dramatically because it start losing context."*

### **The Sub-Agent Solution**
- **Token Optimization**: Sub-agents consume massive tokens for file reading/searching in isolated context
- **Context Preservation**: Parent agent only sees task assignment and summary report (few hundred tokens)
- **Performance Gain**: Avoids conversation compaction that dramatically reduces performance
- **Information Retention**: Gets most important information without context pollution

## Core principles

- **Short, role-clean prompts**; one artefact per hand-off.

- **Explicit gates** between phases. Define pass/fail criteria.

- **Artefact contract** that the next phase consumes.

- **Parallel exploration** for risky tasks (use Crystal to run 2–3 alternatives).

- **Time-box agent runs**. Prefer iteration over single large prompts.

## ❌ **THE BIG MISTAKE (Video Insights)**

### **Direct Implementation Anti-Pattern**
> *The moment if whatever sub agent implemented is not 100% correct and you want agent to fix it. That's where the problem begin because for each agent it only has very limited information about what is going on.*

- **❌ WRONG APPROACH**: Frontend dev agent + Backend dev agent doing direct implementation
- **❌ PROBLEM**: Context isolation - agents don't know what other agents did
- **❌ RESULT**: When bugs occur, debugging becomes impossible due to lack of shared context

### **✅ THE CORRECT APPROACH: Research-Only Sub-Agents**
> *"Sub-agent works best when they just looking for information and provide a small amount of summary back to main conversation thread."* - **Adam Wolf, Claude Code Team**

- **✅ RIGHT APPROACH**: Sub-agents as researchers and planners only
- **✅ BENEFIT**: Parent agent does ALL implementation with full context
- **✅ RESULT**: Debugging and iteration works because parent has complete picture

## Common mistakes to avoid (additional anti-patterns)

### **Over-reliance on single agent**
- ❌ Using one agent for everything instead of specialized sub-agents
- ✅ Create focused agents with single, clear responsibilities

### **Poor context management**
- ❌ Letting context windows fill up without clearing
- ✅ Use `/clear` frequently when starting new tasks or phases

### **Insufficient planning**
- ❌ Jumping straight into implementation without analysis
- ✅ Ask Claude to "think" through the approach first

### **Tool over-permission**
- ❌ Granting all tools to every agent
- ✅ Limit tool access to only what each agent needs

## 🗃️ **FILE SYSTEM CONTEXT MANAGEMENT (Video-Proven Pattern)**

### **The Manus-Inspired Approach**
> *"Use file system as ultimate context management system. Instead of storing all the tool results in the conversation history directly they receive a result to a local file which can be retrieved later."*

### **The Workflow Pattern:**
1. **Context File**: Parent agent creates `docs/tasks/current-session.md` with project info
2. **Research Phase**: Sub-agents read context file first, then do research  
3. **Documentation**: Sub-agents save research reports to `docs/` MD files
4. **Context Updates**: Sub-agents update context file after completing work
5. **Implementation**: Parent agent reads all reports and does implementation with full context

### **Sub-Agent Rules (Video-Tested):**
- **Goal**: "Design and propose detailed implementation plan, never do actual implementation"
- **Always read context file first** to understand project state
- **Save design file to docs/claude/doc file**
- **Output format**: "I've created plan at this file, please read that first before you proceed"
- **Update context file** after finishing work

## Workflow optimization tips

### **Context preservation**
- Use sub-agents to verify details early in conversations
- Preserve main context by delegating investigations to sub-agents  
- Clear chat history between major phases or topics

### **Strategic abstraction**
- Focus on strategy and intent rather than low-level code details
- Let Claude handle execution while you guide direction
- Use test-driven development approach with explicit TDD instructions

### **Parallel processing advantages**
- Run multiple sub-agents concurrently (testing + debugging)
- Use Crystal for parallel exploration of approaches
- Compare results before selecting winning approach

## Quality gates

Each phase should produce specific outputs:

- **Planning**: requirements.md, architecture.md, tasks.md
- **Development**: working code + tests
- **Validation**: test results, acceptance criteria verification

## Hand-off protocol

1. Agent completes phase and produces artefacts
2. Human reviews artefacts against quality gate criteria
3. If passed: commit artefacts and move to next phase
4. If failed: iterate with agent or reassign

## Advanced techniques (2025 best practices)

### **Thinking modes**
- Use "think" to trigger extended analysis
- Progressive thinking: "think" < "think hard" < "think harder" < "ultrathink"
- Apply thinking modes during planning phases for better outcomes

### **Specialized Expert Sub-Agents (Video Pattern)**
> *"What if each service provider like Vercel AI SDK, Supabase, Tailwind, they can just have one agent that is equipped with all the latest knowledge about their documentations, best practice and design..."*

#### **Service-Specific Experts:**
- **Vercel AI SDK Expert**: Loaded with latest v5 documentation and migration guides
- **ShadCN/UI Expert**: Equipped with MCP tools to retrieve components and examples
- **Stripe Expert**: Latest Stripe docs with usage-based pricing patterns
- **Supabase Expert**: Database patterns and auth implementation guides

#### **Expert Agent Structure:**
- **System Prompt**: Include latest documentation directly in system prompt
- **MCP Tools**: Service-specific tools for component/example retrieval  
- **Research Focus**: Analyze existing codebase and propose implementation plan
- **Output**: Detailed MD file with components, examples, and integration approach

#### **General Specialization Patterns:**
- **Code Review Agent**: Finds logic errors and security issues humans miss
- **Testing Agent**: Focuses purely on comprehensive test generation
- **Architecture Agent**: System design and API specifications
- **Research Agent**: Information gathering and requirements analysis

### **Version control integration**
- Check sub-agents into version control for team sharing
- Use GitHub app integration for automated PR reviews
- Commit agent-generated artefacts under `docs/YYYY_MM_DD/` for audit trails

### **Security considerations**
- Use `--dangerously-skip-permissions` only in sandboxed environments
- Never grant arbitrary command execution without containers
- Isolate network access when running untrusted agent code

### **Performance optimization**
- Generate initial agents with Claude, then customize for your needs
- Use @-tagging for file references to improve context accuracy
- Switch between Opus (complex reasoning) and Sonnet (speed) as needed

## Team collaboration

### **Scaling workflows**
- Share specialized agents across projects
- Establish team conventions for agent naming and structure
- Create agent libraries for common development patterns
- Use agent templates for consistent quality standards