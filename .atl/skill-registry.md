# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review. | branch-pr | /home/kriq/.config/opencode/skills/branch-pr/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage. | go-testing | /home/kriq/.config/opencode/skills/go-testing/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature. | issue-creation | /home/kriq/.config/opencode/skills/issue-creation/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen". | judgment-day | /home/kriq/.config/opencode/skills/judgment-day/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI. | skill-creator | /home/kriq/.config/opencode/skills/skill-creator/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- NEVER add "Co-Authored-By" or AI attribution to commits
- NEVER build after changes
- Always check git status, diff, and log before creating a PR
- Analyze all changes including ALL commits that will be in the PR
- Do NOT push force to main/master
- Follow the issue-first enforcement system

### go-testing
- Use teatest for Bubbletea TUI testing
- Use testing package for standard Go tests
- Follow Go testing conventions with table-driven tests
- Include benchmark tests for performance-critical code

### issue-creation
- Follow the issue-first enforcement system
- Use conventional issue templates
- Include reproduction steps for bugs
- Use appropriate labels and project association

### judgment-day
- Launch two independent blind judge sub-agents simultaneously
- Both judges review the same target independently
- Synthesize their findings and apply fixes
- Re-judge until both pass or escalate after 2 iterations

### skill-creator
- Follow the Agent Skills spec format
- Include frontmatter with name, description, license, metadata
- Document trigger conditions clearly
- Include rules and patterns sections

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | /home/kriq/Inmobiliaria-gestion/AGENTS.md | Project-level conventions |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.