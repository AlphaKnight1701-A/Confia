# Confĩa

> **AI helps you find it. Confĩa helps you trust it.**

Confĩa is a bilingual product-information verification platform conceived by the UCF team for the **2026 HSI Battle of the Brains**.

Confĩa works alongside AI-assisted shopping experiences by providing verified product information, deterministic Trust Scores™, and transparent explanations in English and Spanish.

Rather than building another AI shopping assistant, Confĩa acts as an independent **trust layer** between businesses, conversational AI platforms, and shoppers.

---

## Project Status

**Hackathon Proof-of-Concept — monorepo scaffold in place.** Both app shells and shared package boundaries are implemented. The demo catalog, verification/scoring algorithms, MCP tools, ChatGPT connection, completed business views, and synthetic analytics remain implementation milestones. See [the delivery plan](docs/IMPLEMENTATION.md).

This repository is organized to deliver two sides of the Confĩa platform:

1. **AI Shopping Integration**
   An MCP-powered service that allows compatible conversational AI platforms such as ChatGPT to access Confĩa product verification data.

2. **Business Platform**
   A website where companies can learn about Confĩa and view product verification results, Trust Scores, discrepancies, and demonstration analytics.

Both applications depend on the same product-data, verification, and Trust Score packages. Today the catalog is empty and the engines contain only policy metadata/vocabulary; there are no fabricated scores or analytics.

---

# The Problem

As shopping moves toward conversational AI, companies face a new challenge:

> **How can businesses remain accurately represented while customers know whether the product information AI gives them can actually be trusted?**

AI-assisted product information may contain:

- Outdated prices
- Incorrect availability
- Missing specifications
- Stale product information
- Conflicting product claims
- Inconsistent information between languages

Confĩa adds transparency to this process.

---

# The Solution

The Confĩa ecosystem follows a simple flow:

```text
                         CONFĨA
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
       BUSINESS PLATFORM             AI SHOPPING LAYER
             │                             │
       Landing Page                   MCP Server
       Dashboard                          │
       Analytics                          ▼
       Products                        ChatGPT
       Verification                       │
             │                             ▼
             │                          Shopper
             │
             └─────────────┐
                           ▼
                    SHARED SERVICES
                           │
              ┌────────────┼─────────────┐
              ▼            ▼             ▼
           Product      Trust Score   Verification
            Data          Engine         Engine
```

The company provides product information.

Confĩa verifies available evidence and calculates a Trust Score.

The verified information can then be accessed by compatible AI shopping experiences.

---

# Core Philosophy

Confĩa follows five steps:

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

### Verify

Evaluate product facts and supporting information.

### Score

Calculate a deterministic Trust Score™.

### Connect

Expose verified information to compatible AI shopping experiences.

### Explain

Show businesses and shoppers where the score came from.

### Trust

Give customers more context when making purchasing decisions.

---

# Monorepo Architecture

Confĩa uses a monorepo so both applications can share the same business logic.

```text
confia/
│
├── apps/
│   │
│   ├── web/
│   │   ├── Landing Page
│   │   ├── Business Dashboard
│   │   ├── Products
│   │   ├── Verification Results
│   │   └── Analytics
│   │
│   └── mcp-server/
│       ├── search_products
│       ├── get_product
│       ├── get_trust_score
│       └── verify_product_claim
│
├── packages/
│   │
│   ├── trust-engine/
│   ├── verification/
│   ├── product-data/
│   ├── types/
│   └── ui/
│
├── data/
│   └── demo-products.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── CHATGPT_SETUP.md
│   ├── IMPLEMENTATION.md
│   └── PRODUCT_VISION.md
│
├── package.json
├── package-lock.json
├── tsconfig.base.json
├── turbo.json
└── README.md
```

---

# Application 1: AI Shopping Integration

The consumer-facing experience happens primarily through a conversational AI platform.

For the prototype:

```text
SHOPPER
   │
   ▼
CHATGPT
   │
   │ MCP
   ▼
CONFĨA MCP SERVER
   │
   ▼
PRODUCT SEARCH
   │
   ▼
VERIFICATION ENGINE
   │
   ▼
TRUST SCORE
   │
   ▼
CHATGPT RESPONSE
```

The shopper does not need to understand how Confĩa works technically.

They simply receive additional verification information alongside their shopping experience.

---

## Example

The customer asks:

```text
Find me a cordless drill under $200
for projects around my house.
```

Confĩa can provide supporting information such as:

```text
20V Cordless Drill
Demo Brand

$149.99

✓ CONFĨA VERIFIED

Trust Score: 9.1 / 10

✓ Price Verified
✓ Availability Verified
✓ Specifications Verified

Last Verified:
September 29, 2026
```

The customer can then ask:

```text
Why does this product have a 9.1?
```

Confĩa returns the evidence supporting that score.

---

# Application 2: Business Platform

The second application is the company-facing Confĩa website.

It serves two purposes.

## Public Landing Page

Allows prospective companies to understand:

- What Confĩa does
- How verification works
- How Trust Scores work
- How AI integration works
- English/Spanish accessibility
- Business value
- Partnership opportunities

Suggested landing page:

```text
CONFĨA

Make your products more trustworthy
in AI-assisted shopping.

[ Request a Demo ]

--------------------------------

How Confĩa Works

1. Submit
2. Verify
3. Score
4. Connect
5. Measure

--------------------------------

Built for the future of
AI-assisted shopping.
```

---

# Business Dashboard

The dashboard demonstrates what a participating company could see after joining Confĩa.

```text
CONFĨA BUSINESS DASHBOARD

Verified Products
428 / 500

Average Trust Score
8.7 / 10

AI Product Impressions
14,892

Click Through Rate
6.4%

Potential Discrepancies
12

Spanish Queries
23%
```

For the hackathon, analytics may use **clearly labeled synthetic/demo data**.

The objective is to demonstrate the future business experience, not claim that these metrics are already being collected in production.

---

# Product Verification

Example company product:

```text
20V Cordless Drill

Verification Status

Price                 ✓ Verified
Availability          ✓ Verified
Specifications        ✓ Verified
Supporting Evidence   ⚠ Partial
Freshness             ✓ Current

----------------------------

Trust Score™

8.7 / 10

[ View Score Breakdown ]
```

---

# Trust Score™

The Confĩa Trust Score measures confidence in **product information**.

It does NOT measure whether the product itself is good or bad.

For the prototype:

```text
Pricing Accuracy              20%
Availability Verification     20%
Specification Verification    25%
Information Freshness         20%
Supporting Evidence           15%

                             ----
                             100%
```

Example calculation:

```text
Price                 20 / 20
Availability          20 / 20
Specifications        20 / 25
Freshness             20 / 20
Evidence              15 / 15

TOTAL                  95 / 100

Trust Score™

9.5 / 10
```

The score will be calculated deterministically using the [v1 policy](docs/ARCHITECTURE.md#scoring-policy-v1). The 9.5 example above represents four of five eligible specifications and fresh evidence for all claims; any conflicting specification remains explicitly labeled. Other numbers in these product mockups are illustrative, not live fixture outputs.

> **The AI model does not determine the Trust Score.**

---

# Verified vs. Unverified

Verified:

```text
✓ CONFĨA VERIFIED

Trust Score
9.1 / 10
```

Unverified:

```text
○ CONFĨA UNVERIFIED

Trust Score
N/A
```

Unverified does **not** mean:

```text
Bad
Unsafe
Incorrect
Low Quality
```

It means Confĩa currently does not have enough verified information to assign a score.

---

# Payment Does Not Buy Trust

One of Confĩa's most important principles is:

> **Companies pay to be assessed. They do not pay for the result.**

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

A paying customer can still receive:

```text
Trust Score: 4.2 / 10
```

---

# Sponsorship

Sponsorship and verification must remain separate.

```text
Sponsored
```

represents a commercial relationship.

```text
✓ Confĩa Verified
Trust Score: 8.9
```

represents the verification result.

A product could therefore be:

```text
Sponsored + Verified

Sponsored + Unverified

Not Sponsored + Verified

Not Sponsored + Unverified
```

Sponsorship does not modify the Trust Score.

---

# MCP Server

The MCP server exposes the shared Confĩa services to compatible conversational AI systems.

The prototype should expose four primary tools:

```text
search_products()

get_product()

get_trust_score()

verify_product_claim()
```

---

## search_products()

Find products relevant to a shopping request.

Example:

```json
{
  "query": "cordless drill for home projects",
  "maxPriceMinor": 20000,
  "currency": "USD",
  "locale": "en"
}
```

---

## get_product()

Retrieve Confĩa's canonical information for a product.

Possible fields:

```text
Name
Brand
SKU
Price
Availability
Specifications
Verification Date
Trust Score
Evidence
```

---

## get_trust_score()

Returns the deterministic score and breakdown.

```text
Trust Score

9.1 / 10

Price                 ✓
Availability          ✓
Specifications        ✓
Freshness             ✓
Evidence              ✓
```

---

## verify_product_claim()

Compares presented information against the Confĩa record.

```text
Presented Price

$199.99

      ↓

Confĩa Verified Price

$149.99

      ↓

⚠ POTENTIAL DISCREPANCY
```

---

# Discrepancy Detection

Confĩa should not automatically classify every disagreement as a hallucination.

For example:

```text
AI-Presented Price
$199.99

Confĩa Verified Price
$149.99

Last Verified
September 29, 2026
```

The appropriate result is:

```text
⚠ Potential information discrepancy detected.
```

The underlying information may have changed.

Confĩa provides the evidence and lets the user understand the conflict.

---

# English and Spanish Support

Confĩa uses the same verified underlying facts for both languages.

```text
                 VERIFIED PRODUCT
                      RECORD
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
           ENGLISH             ESPAÑOL
              │                   │
              └─────────┬─────────┘
                        ▼
                  AI EXPERIENCE
```

English:

```text
Find me an affordable drill for projects
around my house.
```

Spanish:

```text
Necesito un taladro económico para
proyectos en mi casa.
```

The presentation language changes.

These should not:

```text
Price
Availability
Product ID
Trust Score
Verification
Evidence
```

---

# Technology Stack

## Monorepo

```text
Turborepo
npm workspaces (one root package-lock.json)
TypeScript
```

## Business Platform

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
```

## MCP Service

```text
Node.js
TypeScript
Model Context Protocol
```

## Shared Business Logic

```text
TypeScript
```

Shared packages contain:

```text
Trust Score Engine
Verification Engine
Product Types
Search Logic
Product Data Access
```

## Data

Prototype:

```text
JSON
demo-products.json
```

Future:

```text
Supabase
PostgreSQL
```

## Deployment

```text
GitHub
     ↓
Vercel / Compatible Hosting
     ↓
apps/web

Public server deployment
     ↓
apps/mcp-server
     ↓
ChatGPT
```

---

# Demo Data

For the hackathon, use approximately 8-12 clearly labeled demonstration products.

Include:

```text
2 Highly Verified Products

2 Mostly Verified Products

2 Partially Verified Products

1 Stale Product

1 Unverified Product

1 Product with a Deliberate
Information Discrepancy
```

Example:

```text
Presented Price:
$199

Verified Price:
$149
```

Demo data should be identified as synthetic/demo information.

---

# Development Setup

Use Node **24.14.1** (`.node-version`) and npm **11.11.0**. Install from the repository root:

```bash
npm ci
npm run setup:env
npm run dev
```

`setup:env` creates each app's local configuration only if it does not already exist. Root legacy `.env.local` files are not read by either application.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start both app shells through Turborepo |
| `npm run dev:web` | Business website at `http://localhost:3000` |
| `npm run dev:mcp` | Service bootstrap at `http://localhost:3001` |
| `npm run check` | Dependency boundaries, all TypeScript checks, bootstrap integration test |
| `npm run build` | Build both applications and validate shared packages |
| `npm run start:web` | Serve the built business website |
| `npm run start:mcp` | Serve the built Node service |

Current business routes: `/`, `/dashboard`, and `/dashboard/products`, `/verification`, `/discrepancies`, `/analytics` under the dashboard prefix. These are starter pages with explicit empty states. Product details and full workflows are planned.

The service currently returns 200 at `/health`, 503 at `/ready`, and 501 at `/mcp`. This is intentional: its process runs, but MCP transport/tools are not implemented. Follow [ChatGPT setup](docs/CHATGPT_SETUP.md) after the MCP milestone; do not treat a healthy process as a connected ChatGPT integration.

## Workspace ownership

| Location | Owns |
| --- | --- |
| `apps/web` | Company-facing landing page, dashboard, product/evidence views, synthetic analytics |
| `apps/mcp-server` | Four shopper tools, MCP transport, tool schemas and errors |
| `packages/types` | Canonical contracts and shared vocabulary |
| `packages/trust-engine` | Deterministic score policy and future calculation |
| `packages/verification` | Evidence eligibility and future discrepancy comparison |
| `packages/product-data` | Canonical catalog plus shared use-case orchestration for both apps |
| `packages/ui` | React presentation only; never imported by MCP |
| `data` | Single versioned synthetic product fixture source |

See [Architecture](docs/ARCHITECTURE.md), [API contracts](docs/API.md), and [Implementation plan](docs/IMPLEMENTATION.md) for the dependency graph, two-app acceptance criteria, and work ownership. Tailwind/shadcn are target UI choices; the starter uses plain CSS until those components are needed.

---

# Environment Configuration

Environment files are scoped to the application that consumes them:

| File | Current variables | Loading |
| --- | --- | --- |
| `apps/web/.env.local` | `NEXT_PUBLIC_APP_URL=http://localhost:3000` | Next.js automatically loads it; public metadata origin only |
| `apps/mcp-server/.env.local` | `PORT=3001` | Node dev/start commands explicitly load it |
| Root `.env.example` | Migration guidance only | Not loaded |
| Root `.env.test.example` | Reserved test guidance | Tests currently inject values directly |

Use the corresponding committed `.env.example` templates, not real secrets in Git. App-local `.env.local` files are ignored. An OpenAI API key is unnecessary because ChatGPT handles the conversation; database/authentication credentials will be introduced only with those future features.

---
# Development Priority

For the hackathon:

```text
[x] 1. MONOREPO SCAFFOLD
        ↓
[ ] 2. DEMO PRODUCT DATA
        ↓
[ ] 3. TRUST SCORE ENGINE
        ↓
[ ] 4. VERIFICATION ENGINE
        ↓
[ ] 5. PRODUCT SEARCH
        ↓
[ ] 6. MCP SERVER
        ↓
[ ] 7. CHATGPT CONNECTION
        ↓
[ ] 8. ENGLISH + SPANISH
        ↓
[ ] 9. DISCREPANCY DEMO
        ↓
[ ] 10. LANDING PAGE
        ↓
[ ] 11. BUSINESS DASHBOARD
        ↓
[ ] 12. POLISH
```

Prioritize the **working ChatGPT + Confĩa flow** before advanced dashboard features. The landing page, business dashboard, verification views, and labeled demo analytics remain required MVP deliverables. See the dependency-ordered [implementation plan](docs/IMPLEMENTATION.md).

---

# Demo Walkthrough

## 1. Business

Start from the Confĩa landing page.

Explain:

> Confĩa gives businesses a way to verify the information AI shoppers may rely upon.

---

## 2. Dashboard

Show:

```text
Products
Trust Scores
Verification Status
Analytics
Discrepancies
```

---

## 3. Enter ChatGPT

Ask:

```text
Find me a cordless drill under $200
for projects around my house.
```

---

## 4. Confĩa Verification

Show:

```text
✓ CONFĨA VERIFIED

9.1 / 10
```

---

## 5. Explain

Ask:

```text
Why does Confĩa give this a 9.1?
```

Show the verification breakdown.

---

## 6. Catch Incorrect Information

Demonstrate:

```text
Presented:
$199

Verified:
$149

⚠ Potential discrepancy
```

---

## 7. Spanish

Ask:

```text
Necesito un taladro de menos de $200
para proyectos en mi casa.
```

Demonstrate the same verified underlying information.

---

# Complete Product Story

```text
                  BUSINESS
                     │
                     ▼
               CONFĨA WEB
                     │
             Product Information
                     │
                     ▼
            VERIFICATION ENGINE
                     │
                     ▼
              TRUST SCORE™
                     │
                     ▼
                MCP SERVER
                     │
                     ▼
                  CHATGPT
                     │
                     ▼
                  SHOPPER
                     │
                     ▼
          VISIBILITY + ENGAGEMENT
                     │
                     ▼
             BUSINESS ANALYTICS
```

---

# Prototype Success Criteria

The prototype succeeds if we can demonstrate:

- [ ] Company-facing landing page
- [ ] Business dashboard
- [ ] Demo product catalog
- [ ] Deterministic Trust Scores
- [ ] Verification breakdown
- [ ] MCP product search
- [ ] ChatGPT integration
- [ ] Verified and unverified products
- [ ] Discrepancy detection
- [ ] English/Spanish interaction
- [ ] Demonstration analytics

---

# Out of Scope

Do NOT prioritize these for the hackathon:

```text
× Payment processing
× Real Home Depot integration
× Real Lowe's integration
× Enterprise authentication
× 500 products
× Production certification
× Real-time retailer inventory
× Large analytics pipelines
× Automatic retailer scraping
× Full conversion attribution
```

---

# Future Development

Confĩa could eventually support:

```text
Retailer APIs
Large Product Catalogs
More AI Assistants
More Languages
Recurring Verification
Historical Trust Scores
Evidence Auditing
Merchant Authentication
Real Analytics
Referral Tracking
Conversion Attribution
Automated Catalog Synchronization
```

---

# Business Model

The current hackathon business proposal assumes:

```text
Enterprise Subscription

$6,000 / month
$72,000 / year

+

One-Time Onboarding

$15,000
```

The proposed subscription covers up to:

```text
500 priority products
```

These are hackathon planning assumptions and not finalized commercial pricing.

---

# Governance

Confĩa follows four core principles:

### 1. Companies pay for assessment, not scores.

### 2. Sponsorship and verification remain separate.

### 3. Trust Scores must be explainable.

### 4. AI should help communicate information, not determine what is true.

---

# Team

Developed by the UCF team for the **2026 HSI Battle of the Brains**.

- Sebastian Cardenas
- Javier Cuevas
- Natalia Del Vecchio
- Anjanette Diaz
- Miguel Hurtado
- David Navarrete
- Diogo Ortiz
- Alejandro Valdez

---

# Final Vision

Confĩa is not another AI shopping assistant.

It is infrastructure connecting:

```text
BUSINESSES
     │
     ▼
VERIFIED INFORMATION
     │
     ▼
AI SHOPPING
     │
     ▼
CUSTOMERS
```

Our core value proposition remains simple:

> # **AI helps you find it. Confĩa helps you trust it.**
