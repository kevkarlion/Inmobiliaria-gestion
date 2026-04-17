# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| SEO audit, technical SEO, why am I not ranking, SEO issues | seo-audit | .agents/skills/seo-audit/SKILL.md |
| Programmatic SEO, template pages, pages at scale, [keyword] + [city] pages | programmatic-seo | .agents/skills/programmatic-seo/SKILL.md |
| AI SEO, AI Overviews, optimize for ChatGPT, AI citations | ai-seo | .agents/skills/ai-seo/SKILL.md |
| Analytics, GA4, conversion tracking, event tracking | analytics-tracking | .agents/skills/analytics-tracking/SKILL.md |
| Content strategy, content marketing | content-strategy | .agents/skills/content-strategy/SKILL.md |
| Copywriting, write copy, ad copy | copywriting | .agents/skills/copywriting/SKILL.md |
| SEO audit, site audit, keywords | seo-audit | .agents/skills/seo-audit/SKILL.md |

## Compact Rules

### seo-audit
- Start with Google Search Console data for baseline
- Priority order: Crawlability > Technical > On-Page > Content > Authority
- Check schema markup via browser tool (not curl/web_fetch - strips JS)
- Core Web Vitals thresholds: LCP < 2.5s, INP < 200ms, CLS < 0.1
- Title tags: 50-60 chars, primary keyword near start, compelling
- H1: One per page, contains primary keyword
- Canonical tags: self-referencing on unique pages
- Report issues with: Issue | Impact | Evidence | Fix | Priority format

### programmatic-seo
- Build pages at scale using templates + data (ciudad, tipo propiedad, etc)
- Each page needs 300+ words of unique content, not just listings
- Target long-tail keywords: "[tipo] en [ciudad]" patterns
- Use programmatic-SEO for pages where search volume exists but site doesn't rank
- Avoid thin content penalties - 20+ pages minimum for template approach
- Include local schema (RealEstateListing, PostalAddress)

### ai-seo
- Target AI citation: Be the BEST answer, not just a source
- Use structured data (schema markup) - REQUIRED for AI visibility
- Answer format: Direct answer first, then supporting detail
- Cite sources inline - AI prefers content that cites its sources
- Include FAQ schema for question-answer content
- Check: Google AI Overviews, ChatGPT, Perplexity for your queries

### analytics-tracking
- Track for decisions, not data - every event informs a decision
- Use GA4, not Universal Analytics (deprecado)
- Set up conversions first: what = success?
- UTM params: source/medium/campaign for all marketing channels
- Check event firing with GA Debugger before launch
- Attribution: understanding which touchpoints drive conversion

### content-strategy
- Focus on topic clusters, not random blog posts
- Content should answer questions - check "People Also Ask" in Google
- E-E-A-T signals: experience, expertise, authority, trustworthiness
- Update existing content regularly, not just publish new
- Internal linking: connect content to product/service pages

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | /home/kriq/mis-proyectos/Inmobiliaria-gestion/AGENTS.md | Agent guidelines |