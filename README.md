# Confĩa

> **AI helps you find it. Confĩa helps you trust it.**

Confĩa is a bilingual product-information verification platform conceived by the UCF team for the **2026 HSI Battle of the Brains**. It connects AI-assisted shopping with traceable product facts, deterministic Trust Scores™, and explanations available in English and Spanish.

Rather than building another shopping chatbot, Confĩa is designed to work alongside existing conversational AI platforms. For the hackathon proof-of-concept, the primary customer entry point is ChatGPT through a Confĩa MCP integration.

**Status: Hackathon architecture and implementation plan.** The repository currently contains documentation and environment templates; the MCP server and application code have not been implemented yet.

The implementation goal is to demonstrate a complete flow from merchant product information, to Confĩa verification, to a Trust Score, and finally to an AI-assisted shopping experience inside ChatGPT.

---

## Contents

- [product scope](#product-scope)
- [what we are building](#what-we-are-building)
- [architecture](#architecture)
- [repository structure](#repository-structure)
- [getting started](#getting-started)
- [environment configuration](#environment-configuration)
- [trust and verification](#trust-and-verification)
- [mcp and chatgpt integration](#mcp-and-chatgpt-integration)
- [merchant dashboard](#merchant-dashboard)
- [english and spanish support](#english-and-spanish-support)
- [hallucination and discrepancy detection](#hallucination-and-discrepancy-detection)
- [testing](#testing)
- [deployment](#deployment)
- [demo walkthrough](#demo-walkthrough)
- [roadmap](#roadmap)
- [business and governance](#business-and-governance)
- [team](#team)

---

# Product Scope

AI shopping recommendations can contain incomplete specifications, stale prices, outdated availability, and inconsistent product information.

Confĩa gives merchants a way to submit product facts and supporting evidence for assessment. Confĩa evaluates those individual product claims, calculates a Trust Score™, and exposes the resulting verification information to compatible AI assistants.

The main customer experience does not require the shopper to use another standalone shopping application.

Instead, our intended experience is:

```text
SHOPPER
   │
   ▼
CHATGPT
   │
   ▼
CONFĨA MCP APP
   │
   ▼
CONFĨA VERIFICATION
   │
   ▼
TRUST SCORE + EVIDENCE
   │
   ▼
CHATGPT
   │
   ▼
SHOPPER
```

A Trust Score measures confidence in **product information**, not product quality, safety, or personal suitability.

For example:

```text
Trust Score: 9.1 / 10
```

does NOT mean:

```text
"This drill is a 9.1/10 drill."
```

It means:

```text
"Confĩa has strong evidence supporting the
information describing this product."
```

Unknown information remains unknown.

Differences between information should be identified as potential discrepancies rather than automatically classified as AI hallucinations.

---

# What We Are Building

The hackathon proof-of-concept contains six major pieces:

```text
1. PRODUCT CATALOG
        ↓
2. VERIFICATION ENGINE
        ↓
3. TRUST SCORE™ ENGINE
        ↓
4. CONFĨA BACKEND
        ↓
5. MCP SERVER
        ↓
6. CHATGPT EXPERIENCE
```

A lightweight merchant dashboard demonstrates the business-facing side of the platform.

The prototype intentionally uses approximately 8-12 clearly identified demo products rather than attempting to build production-scale retailer infrastructure.

---

# Architecture

The primary architecture is:

```text
                         CUSTOMER
                            │
                            │
                            ▼
                     ┌─────────────┐
                     │   CHATGPT   │
                     └──────┬──────┘
                            │
                            │ MCP
                            ▼
                  ┌───────────────────┐
                  │   CONFĨA SERVER   │
                  │                   │
                  │ search_products   │
                  │ get_product       │
                  │ get_trust_score   │
                  │ verify_product_claim│
                  └─────────┬─────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │      DOMAIN SERVICES     │
              │                          │
              │ Product Search           │
              │ Verification Engine      │
              │ Trust Score Engine       │
              │ Discrepancy Detection    │
              └────────────┬─────────────┘
                           │
                           ▼
                    PRODUCT DATA
                           │
              ┌────────────┴───────────┐
              ▼                        ▼
        demo-products.json       PostgreSQL
                                (future)
```

The merchant experience connects to the same backend:

```text
MERCHANT DASHBOARD
        │
        ▼
CONFĨA BACKEND
        │
        ▼
VERIFICATION ENGINE
        │
        ▼
TRUST SCORE
        │
        ▼
PRODUCT RECORD
        │
        ▼
MCP
        │
        ▼
CHATGPT
```

---

# Technology Stack

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Runtime | Node.js / TypeScript | One backend process |
| Primary interface | ChatGPT developer mode | Shopper conversation and bilingual explanations |
| Transport | TypeScript MCP SDK, Streamable HTTP | Four read-only tools at `/mcp` |
| Domain | Plain TypeScript | Search, verification, scoring, comparison |
| Storage | Validated JSON fixtures | Published synthetic catalog |
| Database, later | Supabase PostgreSQL | Durable products, evidence, assessments |
| Merchant UI, later | Optional Next.js / React | Business-facing demonstration only |
| Hosting | Compatible Node.js host or development tunnel | Reachable HTTPS MCP endpoint |

There is no shopper web frontend, embedded widget, or backend LLM API in the MVP. No OpenAI API key or model configuration is needed. Versions and hosting must be selected and tested during scaffolding.

The technical plan lives in [Architecture](docs/ARCHITECTURE.md), [MCP contracts](docs/API.md), and [ChatGPT setup](docs/CHATGPT_SETUP.md). The [original product vision](docs/PRODUCT_VISION.md) is historical background and may describe superseded web-first choices.

---

# Repository Structure

Current files are this README, `.gitignore`, environment templates, and the `docs/` specifications. Planned implementation layout:

```text
Confia/
├── src/
│   ├── server.ts                  # /mcp, /health, /ready
│   ├── config/env.ts
│   ├── mcp/                       # SDK factory, tool schemas, result envelopes
│   ├── domain/                    # Facts, evidence, scoring, comparison
│   ├── services/                  # Four tool use cases
│   ├── repositories/              # Repository interface and JSON adapter
│   └── i18n/                      # Localized labels and catalog text
├── scripts/                       # Catalog validation and local demo runner
├── data/demo-products.json
├── tests/                         # Domain, service, and MCP transport tests
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── CHATGPT_SETUP.md
│   └── PRODUCT_VISION.md
├── .env.example
├── .env.test.example
├── .gitignore
├── package.json                   # Planned, not present yet
└── tsconfig.json                  # Planned, not present yet
```

If implemented later, the merchant dashboard can live under `apps/merchant/`. It is not a dependency of the MCP server.

---

# Getting Started

Prepare configuration now, from PowerShell:

```powershell
Copy-Item .env.example .env.local
Copy-Item .env.test.example .env.test.local
git check-ignore .env.local .env.test.local
```

Use `cp` instead of `Copy-Item` in Bash. Do not overwrite a populated local configuration without preserving its values.

The server is not scaffolded yet. Its first milestone must pin Node.js and dependency versions, commit the npm lockfile, explicitly load `.env.local`, and add these planned commands:

| Command after implementation | Purpose |
| --- | --- |
| `npm ci` | Install locked dependencies |
| `npm run dev` | Start MCP service at `http://localhost:3000/mcp` |
| `npm run validate:catalog` | Check fixture schema and evidence references |
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm test` | Domain and service tests |
| `npm run test:mcp` | Initialization, discovery, and tool-call tests |
| `npm run build` / `npm start` | Compile and run the production service |
| `npm run demo` | Local fallback through shared services |

Once implemented, inspect the local endpoint, expose it through the chosen HTTPS connection path, and follow [ChatGPT setup](docs/CHATGPT_SETUP.md). No dashboard is needed to test the primary experience.

---

# Environment Configuration

The templates define the future server configuration; no runtime consumes them yet.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP listening port |
| `CONFIA_PUBLIC_BASE_URL` | `http://localhost:3000` | External origin; use actual HTTPS tunnel/deployment origin remotely |
| `CONFIA_MCP_PATH` | `/mcp` | MCP transport path |
| `CONFIA_MCP_AUTH_MODE` | `none` | MVP supports only public synthetic read-only data |
| `CONFIA_DATA_SOURCE` | `demo` | MVP repository; reject unsupported storage modes |
| `CONFIA_CATALOG_PATH` | `./data/demo-products.json` | Catalog file, resolved from project root |
| `CONFIA_DEFAULT_LOCALE` | `en` | `en` or `es` |
| `CONFIA_LOG_LEVEL` | `info` | `debug`, `info`, `warn`, or `error` |
| `CONFIA_TEST_NOW` | Test template only | Inject a fixed clock in tests; reject outside tests |

Load `.env.local` explicitly in development and `.env.test.local` explicitly in tests; deployment environment values take precedence. Do not assume Next.js environment loading exists in the Node.js service.

Removed configuration: `NEXT_PUBLIC_APP_URL`, `CONFIA_AI_ENABLED`, `OPENAI_API_KEY`, `OPENAI_MODEL`, and public demo-write controls. ChatGPT provides the conversation, and this backend makes no AI API calls. Database credentials will be introduced with the future persistence/authentication milestone, not required by the demo.

Keep local environment files ignored. No-auth access is limited to the public synthetic catalog; private data requires an implemented and tested authorization flow first.

---

# Trust and Verification

The initial `v1` Trust Score uses five categories:

```text
Pricing Accuracy              20%
Availability Verification     20%
Specification Verification    25%
Information Freshness         20%
Supporting Evidence           15%

                             ----
                             100%
```

The final total is converted into a score from:

```text
0.0 ───────────────────────────── 10.0
```

Example:

```text
PRODUCT

20V Cordless Drill

Price                   20/20
Availability            20/20
Specifications          20/25
Freshness               20/20
Supporting Evidence     15/15

TOTAL                    95/100

CONFĨA TRUST SCORE™

9.5 / 10
```

This 9.5 example has four of five specifications eligible and all required observations fresh; a conflicting fifth specification must remain explicitly labeled. See the exact [v1 policy](docs/ARCHITECTURE.md#scoring-policy-v1). Other scores in the presentation mockups below are illustrative, not computed fixture results.

The Trust Score must be calculated deterministically.

AI does NOT decide whether a product receives an 8, 9, or 10.

---

# Verified vs. Unverified

A verified product might appear as:

```text
✓ CONFĨA VERIFIED

Trust Score
9.1 / 10
```

An unassessed product might appear as:

```text
○ CONFĨA UNVERIFIED

Trust Score
N/A
```

`Unverified` does NOT mean:

```text
Unsafe
Bad
Incorrect
Poor quality
```

It means Confĩa currently lacks sufficient verification information to issue a Trust Score.

---

# MCP and ChatGPT Integration

The proof-of-concept is designed to expose Confĩa capabilities through a Model Context Protocol server.

The required MCP integration exposes four read-only tools through Streamable HTTP at `/mcp`. ChatGPT developer mode is the primary client. Exact schemas and result envelopes are specified in [MCP contracts](docs/API.md):

```text
search_products()

get_product()

get_trust_score()

verify_product_claim()
```

---

## search_products

Searches the Confĩa catalog according to customer needs.

Example customer request:

```text
Find me a cordless drill under $200
for basic projects around my house.
```

The tool can receive information such as:

```json
{
  "query": "cordless drill for basic home projects",
  "maxPriceMinor": 20000,
  "currency": "USD",
  "locale": "en"
}
```

---

## get_product

Returns the canonical Confĩa product record.

Possible information includes:

```text
Product Name
Brand
SKU
Price
Availability
Specifications
Verification Status
Verification Date
Trust Score
Evidence
```

---

## get_trust_score

Returns the deterministic Trust Score and explanation.

Example:

```text
CONFĨA TRUST SCORE™

9.1 / 10

Price                 ✓ Verified
Availability          ✓ Verified
Specifications        ✓ Verified
Freshness             ✓ Current
Supporting Evidence   ✓ Available
```

---

## verify_product_claim

Compares a supplied product claim against Confĩa's stored verified information.

Example:

```text
Presented information:

Price = $199.99

          │
          ▼

Confĩa record:

Price = $149.99

          │
          ▼

⚠ POTENTIAL DISCREPANCY
```

---

# ChatGPT Demo Experience

The customer starts directly inside ChatGPT.

Example:

```text
USER:

Find me a cordless drill under $200
for projects around my house.
```

ChatGPT uses Confĩa's MCP tools to retrieve supporting product information.

The response should communicate information similar to:

```text
20V Cordless Drill
Demo Brand

$149.99

✓ CONFĨA VERIFIED

Trust Score
9.1 / 10

✓ Price Verified
✓ Availability Verified
✓ Specifications Verified

Last verified:
September 29, 2026
```

The shopper can then ask:

```text
Why does Confĩa give this product a 9.1?
```

Confĩa returns the deterministic scoring breakdown.

---

# Merchant Dashboard

ChatGPT represents the customer-facing experience.

The Confĩa website primarily demonstrates the business-facing experience.

Example:

```text
┌──────────────────────────────────────┐
│ CONFĨA BUSINESS DASHBOARD            │
├──────────────────────────────────────┤
│                                      │
│ 20V Cordless Drill                   │
│ Demo Brand                           │
│                                      │
│ VERIFICATION                         │
│                                      │
│ Price              ✓ Verified        │
│ Availability       ✓ Verified        │
│ Specifications     ✓ Verified        │
│ Reviews            ⚠ Partial         │
│ Freshness          ✓ Current         │
│                                      │
│ ───────────────────────────────────  │
│                                      │
│ TRUST SCORE™                         │
│                                      │
│             8.7 / 10                 │
│                                      │
│ [ View Breakdown ]                   │
│                                      │
└──────────────────────────────────────┘
```

For the hackathon, merchant submission can remain simulated or ephemeral.

Production authentication, billing, and merchant permissions are deferred. The initial remote MCP endpoint exposes only read-only synthetic data; any later durable merchant writes require authorization before deployment.

---

# English and Spanish Support

English and Spanish experiences should use the same underlying verified product information.

```text
                 CONFĨA PRODUCT
                     RECORD
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          ENGLISH             ESPAÑOL
             │                   │
             └─────────┬─────────┘
                       ▼
                    CHATGPT
```

English example:

```text
Find me an affordable drill for projects
around my house.
```

Spanish example:

```text
Necesito un taladro económico para
proyectos en mi casa.
```

The conversational language can change.

The underlying:

```text
Price
Availability
Specifications
Trust Score
Evidence
```

must remain grounded in the same verified product record.

---

# Hallucination and Discrepancy Detection

Confĩa can compare information presented during an AI interaction against a verified record.

Example:

```text
AI-PRESENTED INFORMATION

Price:
$199.99

          │
          ▼

CONFĨA VERIFIED INFORMATION

Price:
$149.99

          │
          ▼

⚠ POTENTIAL INFORMATION DISCREPANCY
```

Confĩa should not automatically conclude:

```text
"AI hallucinated."
```

The information could simply have changed.

Instead, Confĩa reports:

```text
Potential discrepancy detected.

Presented: $199.99
Verified:  $149.99

Confĩa verification date:
September 29, 2026
```

This gives the shopper evidence rather than asking them to blindly trust either system.

---

# Development Priority

For the hackathon, development should happen in this order:

```text
[ ] 1. Create 8-12 demo products

       ↓

[ ] 2. Implement Trust Score algorithm

       ↓

[ ] 3. Implement product search

       ↓

[ ] 4. Implement verification logic

       ↓

[ ] 5. Build MCP server

       ↓

[ ] 6. Connect MCP server to ChatGPT

       ↓

[ ] 7. Test English query

       ↓

[ ] 8. Test Spanish query

       ↓

[ ] 9. Implement discrepancy example

       ↓

[ ] 10. Build merchant dashboard
```

The primary development priority is:

> **Get Confĩa working through ChatGPT before spending significant time polishing the merchant dashboard.**

---

# Testing

In addition to domain tests, verify MCP initialization, tool discovery, all four schemas, structured/text result parity, error envelopes, invalid arguments, and request cancellation. Rehearse actual ChatGPT tool traces and final answers in both languages using [the acceptance matrix](docs/CHATGPT_SETUP.md#rehearsal-matrix).

At minimum, test:

### Trust Scores

```text
✓ Score never below 0
✓ Score never above 10
✓ Missing evidence decreases score
✓ Stale information affects freshness
✓ Unassessed products have no score
```

### Product Search

```text
✓ Budget constraints work
✓ Relevant categories work
✓ Unverified products remain possible results
```

### Language

```text
✓ English and Spanish use the same product IDs
✓ Price does not change during translation
✓ Trust Score does not change during translation
```

### Verification

```text
✓ Matching claim passes
✓ Conflicting claim generates discrepancy
✓ Unknown information remains unknown
```

---

# Deployment

Deploy one Node.js MCP service exposing `/mcp`, `/health`, and `/ready`. For the chosen demo path, ChatGPT connects to a reachable HTTPS URL ending in `/mcp`; MCP Inspector can test localhost directly. A development tunnel or compatible deployed host provides the remote endpoint.

Verify transport/proxy compatibility, catalog readiness, and the four tool schemas before connecting the demo account. Use a stable endpoint for judging, refresh the connection if the URL or tool catalog changes, and keep only synthetic public data in no-auth mode.

Follow the [connection and rehearsal guide](docs/CHATGPT_SETUP.md), which links current official OpenAI guidance and describes the Secure MCP Tunnel alternative. ChatGPT connection is a required acceptance gate, not an optional integration after frontend work.

No host has been provisioned and no ChatGPT account has been connected by this documentation change.

---

# Demo Walkthrough

## Step 1: Start in ChatGPT

Ask:

```text
Find me a cordless drill under $200
for projects around my house.
```

---

## Step 2: Use Confĩa

ChatGPT retrieves relevant product information through Confĩa.

---

## Step 3: Show Verification

Demonstrate:

```text
✓ CONFĨA VERIFIED

Trust Score
9.1 / 10
```

---

## Step 4: Explain the Score

Ask:

```text
Why is this product a 9.1?
```

Confĩa returns:

```text
Price                 ✓
Availability          ✓
Specifications        ✓
Freshness             ✓
Supporting Evidence   ✓
```

---

## Step 5: Show a Discrepancy

Present:

```text
Product price:
$199.99
```

Confĩa responds:

```text
⚠ POTENTIAL DISCREPANCY

Presented:
$199.99

Verified:
$149.99
```

---

## Step 6: Switch to Spanish

Ask:

```text
Necesito un taladro de menos de $200
para proyectos en mi casa.
```

Show that the same verified underlying product information supports the Spanish experience.

---

## Step 7: Business Side

Open the Confĩa merchant dashboard.

Show:

```text
PRODUCT

20V Cordless Drill

Price              ✓
Stock              ✓
Specifications     ✓
Reviews            ⚠

Trust Score

8.7 / 10
```

---

# Complete Demo Story

```text
MERCHANT
   │
   ▼
SUBMITS PRODUCT INFORMATION
   │
   ▼
CONFĨA VERIFICATION ENGINE
   │
   ▼
TRUST SCORE™
   │
   ▼
CONFĨA MCP SERVER
   │
   ▼
CHATGPT
   │
   ▼
CUSTOMER
```

In one sentence:

> **ChatGPT handles the conversation. Confĩa handles verification.**

---

# Backup Demo

Use MCP Inspector or a small local demo runner calling the same domain services when ChatGPT is unavailable. Show search, exact score breakdowns, and claim comparison without building another shopper application. Describe this accurately as backend verification rather than a completed ChatGPT integration.

A later minimal merchant/backup panel can reuse an admin adapter. It must not duplicate scoring or become a prerequisite for the primary demo.

---

# Roadmap

- [x] Product direction and ChatGPT-first architecture
- [x] Proposed scoring policy and four MCP tool contracts
- [x] Environment templates and connection/rehearsal guide
- [ ] Node.js/TypeScript MCP scaffold, locked dependencies, configuration validation
- [ ] 8–12 synthetic products and evidence fixtures
- [ ] Scoring, search, and discrepancy services with tests
- [ ] Four read-only tools and MCP transport tests
- [ ] Reachable endpoint and ChatGPT developer-mode connection
- [ ] English/Spanish demo, evidence explanations, and failure-case evaluation
- [ ] Local fallback runner
- [ ] Optional merchant dashboard after the core demo works
- [ ] Persistent database, authorization, and recurring assessment

---

# Business and Governance

The original business proposal assumes:

```text
Subscription:
$6,000 / month

Annual:
$72,000 / year

One-Time Onboarding:
$15,000

Products:
Up to 500 priority products
```

These are hackathon business assumptions and are not finalized commercial pricing.

---

# Payment Does Not Buy Trust

Confĩa operates around a critical governance principle:

> **A business pays Confĩa to be assessed, not to receive a good score.**

```text
PAYMENT
   │
   ▼
ASSESSMENT
   │
   ▼
EVIDENCE
   │
   ▼
TRUST SCORE
```

Not:

```text
PAYMENT
   │
   ▼
HIGH SCORE
```

A paying company could still receive:

```text
4.2 / 10
```

---

# Sponsorship

Verification and sponsorship are different.

A future sponsored placement should be labeled:

```text
SPONSORED
```

A Confĩa assessment should be labeled:

```text
✓ VERIFIED
Trust Score: 8.9
```

A product can therefore potentially be:

```text
Sponsored + Verified
Sponsored + Unverified
Not Sponsored + Verified
Not Sponsored + Unverified
```

Commercial relationships should never silently modify Trust Scores.

---

# Prototype Limitations

This repository represents a proof-of-concept.

The hackathon implementation does NOT claim to provide:

```text
× Production certification
× Real retailer partnerships
× Universal ChatGPT distribution
× Real-time retailer inventory
× Enterprise security certification
× Full product-market validation
× Production-scale verification
```

Demo/synthetic information should remain clearly identified.

---

# Future Vision

A production version of Confĩa could eventually support:

```text
More merchants
More product categories
Additional languages
Large product catalogs
Recurring product verification
Automated catalog synchronization
Historical Trust Scores
Independent evidence sources
Merchant analytics
AI visibility analytics
Referral tracking
Conversion attribution
Additional AI assistants
```

The core architecture remains:

```text
VERIFY
   ↓
SCORE
   ↓
CONNECT
   ↓
EXPLAIN
   ↓
TRUST
```

---

# Team

Developed by the UCF team for the:

## 2026 HSI Battle of the Brains

- Sebastian Cardenas
- Javier Cuevas
- Natalia Del Vecchio
- Anjanette Diaz
- Miguel Hurtado
- David Navarrete
- Diogo Ortiz
- Alejandro Valdez

---

# Project Status

**HACKATHON PROOF-OF-CONCEPT**

Confĩa demonstrates how independently assessed product information could provide an additional trust layer within AI-assisted shopping.

The Trust Score methodology and integration contracts are proposed prototype designs. Implementation and validation remain outstanding.

---

# Confĩa

> ## **AI helps you find it. Confĩa helps you trust it.**

```text
AI DISCOVERY
     ↓
VERIFIED INFORMATION
     ↓
TRANSPARENCY
     ↓
CONFIDENCE
```
