# Confĩa

> **AI helps you find it. Confĩa helps you trust it.**

Confĩa is a bilingual product verification and AI-shopping trust platform designed to work alongside conversational AI shopping experiences.

Rather than replacing existing AI assistants or creating another AI model, Confĩa provides a software layer that connects AI-assisted shopping with structured, independently assessed product information.

The goal is simple:

> **Help customers understand whether the product information behind an AI recommendation is accurate, current, complete, and trustworthy.**

This project was developed as a proof-of-concept for the **2026 HSI Battle of the Brains**.

---

# Table of Contents

1. #the-problem
2. #our-solution
3. #how-confĩa-works
4. #system-architecture
5. #1-verification-engine
6. #2-confĩa-trust-score
7. #3-ranking-and-filtering
8. #ai-shopping-integration
9. #hallucination-and-discrepancy-detection
10. #english-and-spanish-support
11. #merchant-experience
12. #shopper-experience
13. #technology-stack
14. #suggested-project-structure
15. #data-model
16. #api-design
17. #mcp-integration
18. #trust-and-governance
19. #demo-dataset
20. #demo-flow
21. #prototype-scope
22. #future-development
23. #business-model
24. #team

---

# The Problem

Artificial Intelligence is quickly changing how people search for, compare, and ultimately choose the products they purchase.

As more product discovery moves into conversational AI experiences, businesses face a new challenge:

> **How do companies make sure their products are visible while customers can also trust the information AI provides about those products?**

AI-generated product information can potentially be:

- Incorrect
- Incomplete
- Outdated
- Missing important specifications
- Based on stale pricing
- Based on stale availability
- Inconsistent between languages
- Difficult for consumers to independently validate

This creates a trust problem for both sides.

### For customers

Customers may not know whether information provided by an AI assistant is current or accurate.

### For businesses

Companies may have accurate product information available, but conversational AI systems may not always represent that information correctly.

### For Hispanic and bilingual consumers

Differences in language and context can additionally influence how customers search for products and interpret recommendations.

Confĩa addresses these problems by creating a verification layer that can work alongside AI-assisted shopping.

---

# Our Solution

Confĩa sits between verified product information and AI-assisted shopping experiences.

Companies submit products to Confĩa for assessment.

Confĩa then:

1. Standardizes product information.
2. Verifies supported product claims.
3. Calculates a Trust Score™.
4. Makes verification information machine-readable.
5. Allows AI shopping experiences to retrieve the information.
6. Shows shoppers why a product received its score.
7. Supports both English and Spanish shopping experiences.

The overall system looks like this:

```text
                  BUSINESS
                     │
                     │
             Product Information
                     │
                     ▼
          ┌────────────────────┐
          │       CONFĨA       │
          │                    │
          │ Verification Engine│
          │ Trust Score™       │
          │ Product Records    │
          └─────────┬──────────┘
                    │
             Verified Data
                    │
                    ▼
          Conversational AI
                    │
                    ▼
                 SHOPPER
```

---

# How Confĩa Works

Confĩa follows five major steps:

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

## VERIFY

A company provides product information and supporting evidence.

## SCORE

Confĩa evaluates the reliability and completeness of that information.

## CONNECT

Structured product information becomes available to compatible shopping experiences.

## EXPLAIN

Customers can see what contributed to the product's verification.

## TRUST

Customers receive additional transparency when deciding whether to trust product information.

---

# System Architecture

The proof-of-concept consists of three primary technical components:

```text
                          CONFĨA

        ┌─────────────────────────────────────┐
        │                                     │
        │   1. VERIFICATION ENGINE            │
        │                                     │
        │   Merchant Data                     │
        │        ↓                            │
        │   Normalize Product                 │
        │        ↓                            │
        │   Check Claims                      │
        │                                     │
        ├─────────────────────────────────────┤
        │                                     │
        │   2. TRUST SCORE™                   │
        │                                     │
        │   Price                             │
        │   Availability                      │
        │   Specifications                    │
        │   Freshness                         │
        │   Supporting Evidence               │
        │        ↓                            │
        │      0 - 10                         │
        │                                     │
        ├─────────────────────────────────────┤
        │                                     │
        │   3. DISCOVERY / FILTERING          │
        │                                     │
        │   Query                             │
        │      ↓                              │
        │   Relevant Products                 │
        │      ↓                              │
        │   Verification Information          │
        │                                     │
        └──────────────────┬──────────────────┘
                           │
                           ▼
                  AI Shopping Experience
                           │
                           ▼
                        Shopper
```

---

# 1. Verification Engine

When a participating company subscribes to Confĩa, it can submit approved product information.

This can include:

- Product name
- Brand
- SKU
- Product category
- Product description
- Price
- Currency
- Availability
- Product specifications
- Features
- Product policies
- Supporting reviews
- Supporting verification information
- Product URL
- Last verification date

The Verification Engine converts this information into a standardized internal product record.

Example:

```json
{
  "id": "drill-001",
  "name": "20V Cordless Drill",
  "brand": "Demo Brand",
  "sku": "DRILL-001",
  "category": "Power Tools",
  "description": "20V cordless drill intended for general home projects.",
  "price": 149.99,
  "currency": "USD",
  "availability": "InStock",
  "features": [
    "Brushless motor",
    "20V battery",
    "Variable speed"
  ],
  "verified_at": "2026-09-29"
}
```

For the proof-of-concept, the product catalog is intentionally small and controlled.

A production implementation could later consume retailer feeds, APIs, catalog exports, or other approved sources.

---

# Machine-Readable Product Data

Confĩa structures product information so that it can be easily retrieved and interpreted by software.

The proof-of-concept can represent product information using JSON and JSON-LD-style product records.

Example:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "20V Cordless Drill",
  "sku": "DRILL-001",
  "brand": {
    "@type": "Brand",
    "name": "Demo Brand"
  },
  "offers": {
    "@type": "Offer",
    "price": "149.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

The purpose of structured information is to give the system a predictable representation of product facts rather than relying only on unstructured text.

---

# 2. Confĩa Trust Score™

Each verified product receives a score between:

```text
0.0 ───────────────────────────────────── 10.0
```

The Trust Score represents confidence in the **information describing the product**.

It is NOT intended to represent overall product quality.

For example:

```text
Product A

Confĩa Trust Score™

9.1 / 10
```

does NOT mean:

> Product A is a 9.1/10 product.

It means:

> Confĩa determined that the available product information has a high degree of verification and completeness according to the platform's current scoring criteria.

---

# Trust Score Calculation

For the prototype, the Trust Score should be deterministic.

The language model should **not independently decide the Trust Score**.

An example scoring model is:

```text
Pricing Accuracy              20%
Availability Verification     20%
Specification Verification    25%
Information Freshness         20%
Supporting Evidence           15%

                             ----
                             100%
```

Example:

```text
PRICE
Verified                        20/20

AVAILABILITY
Verified                        20/20

SPECIFICATIONS
4 of 5 verified                 20/25

FRESHNESS
Recently verified               20/20

SUPPORTING EVIDENCE
Partial                          10/15

TOTAL                            90/100

TRUST SCORE

9.0 / 10
```

The exact weighting system used by the hackathon prototype is an initial implementation and would require further research, testing, and independent validation before production deployment.

---

# Why the Score Matters

Without Confĩa, a shopper might see:

```text
20V Cordless Drill

$149.99
Brushless Motor
In Stock
```

But the shopper may not know:

- Where the price came from
- When it was checked
- Whether the specifications match
- Whether availability is current
- Whether another source contradicts the information

Confĩa instead provides:

```text
20V Cordless Drill

$149.99

✓ CONFĨA VERIFIED

Trust Score
9.1 / 10

✓ Price Verified
✓ Availability Verified
✓ Specifications Verified
✓ Recently Checked

[ Why This Score? ]
```

---

# 3. Ranking and Filtering

Verification, sponsorship, and relevance must remain separate concepts.

Confĩa follows an important principle:

> **Companies can pay to be assessed. They cannot pay for a higher Trust Score.**

Payment:

```text
Company
   │
   │ Subscription
   ▼
Confĩa Verification
```

does NOT mean:

```text
Company
   │
   │ $$$
   ▼
Higher Trust Score
```

A company can purchase Confĩa verification and receive:

```text
4.2 / 10
```

just as another product could receive:

```text
9.3 / 10
```

---

# Shopper-Controlled Filtering

Rather than automatically giving paying companies higher Trust Scores, Confĩa gives shoppers control over verification-based filtering.

For example:

```text
VERIFICATION FILTER

[x] Prioritize verified products

Minimum Trust Score:

0 ────────────●──────────── 10
              8
```

If the customer chooses a minimum Trust Score of `8`, the system can prioritize or filter according to that shopper-selected preference.

This distinction is important:

```text
COMPANY PAYMENT
      X
      │
      ▼
RANKING
```

Instead:

```text
CUSTOMER PREFERENCE
        │
        ▼
VERIFICATION FILTER
        │
        ▼
SEARCH EXPERIENCE
```

---

# Sponsorship

Future commercial partnerships may include sponsored placements.

However, sponsorship must remain visibly different from verification.

Example:

```text
Sponsored

20V Cordless Drill
Available from Retail Partner

✓ Confĩa Verified
Trust Score: 8.9
```

Here:

```text
Sponsored
```

describes the commercial relationship.

While:

```text
✓ Confĩa Verified
8.9 / 10
```

describes the verification result.

These are independent.

---

# AI Shopping Integration

Confĩa is designed to work alongside conversational AI platforms.

Conceptually:

```text
SHOPPER
   │
   │ "I need a drill under $200."
   ▼
AI ASSISTANT
   │
   │ Product discovery query
   ▼
CONFĨA
   │
   ├── Search product records
   ├── Retrieve verification
   ├── Retrieve Trust Score
   └── Return evidence
   │
   ▼
AI ASSISTANT
   │
   ▼
SHOPPER
```

The AI assistant handles conversational interaction.

Confĩa handles:

- Verified product records
- Trust Scores
- Verification evidence
- Structured product information
- Product discrepancy information

---

# Example Shopper Response

```text
You:
I need a cordless drill under $200 for basic
projects around my house.


Recommended Product

20V Cordless Drill
Demo Brand

$149.99

✓ CONFĨA VERIFIED

Trust Score
9.1 / 10

Price               ✓ Verified
Availability        ✓ Verified
Specifications      ✓ Verified

Why Confĩa verified this product >
```

---

# Unverified Products

Products do not need to disappear simply because they are outside the Confĩa network.

Instead, they can appear as:

```text
Product XYZ

$129.99

○ CONFĨA UNVERIFIED

Confĩa currently does not have enough
verified information to provide a Trust Score.

[ View Product ]
```

This distinction is important.

`Unverified` does NOT necessarily mean the product information is false.

It means Confĩa cannot currently verify enough information to issue a Trust Score.

---

# Hallucination and Discrepancy Detection

Another important use case for Confĩa is detecting discrepancies between product information presented during an AI interaction and product information available within Confĩa.

Example:

```text
AI INFORMATION

Product Price
$199.99

        │
        ▼

CONFĨA PRODUCT RECORD

Verified Price
$149.99

        │
        ▼

⚠ INFORMATION DISCREPANCY DETECTED
```

The interface could display:

```text
PRICE DISCREPANCY

AI-provided value:
$199.99

Confĩa verified value:
$149.99

Last verified:
September 29, 2026

[ View Verification Evidence ]
```

Confĩa should avoid automatically declaring every discrepancy a hallucination.

Prices, inventory, and other product information may legitimately change.

Therefore the safer description is:

> **Potential information discrepancy detected.**

---

# English and Spanish Support

Hispanic and bilingual accessibility is a core component of the project.

Confĩa should NOT create completely separate verification databases for English and Spanish.

Instead:

```text
                      ┌────────────────┐
                      │ VERIFIED       │
                      │ PRODUCT RECORD │
                      └───────┬────────┘
                              │
                   ┌──────────┴──────────┐
                   │                     │
                   ▼                     ▼
               ENGLISH                ESPAÑOL
                   │                     │
                   └──────────┬──────────┘
                              │
                              ▼
                           SHOPPER
```

Both experiences should be grounded in the same verified facts.

Example English query:

```text
I need an affordable drill for projects around my house.
```

Example Spanish query:

```text
Necesito un taladro económico para proyectos en mi casa.
```

The conversational response may change language, but the underlying verified information remains connected to the same product record.

---

# Merchant Experience

Confĩa has two major user experiences.

The first is the merchant/business side.

The merchant dashboard demonstrates how participating companies submit and monitor product information.

Example:

```text
┌────────────────────────────────────────┐
│ CONFĨA BUSINESS DASHBOARD              │
├────────────────────────────────────────┤
│                                        │
│ 20V Cordless Drill                     │
│ Demo Brand                             │
│                                        │
│ VERIFICATION                           │
│                                        │
│ Price                 ✓ Verified       │
│ Availability          ✓ Verified       │
│ Specifications        ✓ Verified       │
│ Reviews               ⚠ Partial        │
│ Freshness             ✓ Current        │
│                                        │
│ ────────────────────────────────────── │
│                                        │
│ TRUST SCORE™                           │
│                                        │
│              8.7 / 10                  │
│                                        │
│ [ View Breakdown ]                     │
│                                        │
└────────────────────────────────────────┘
```

For the prototype, product submission can be simplified.

The merchant interface does NOT require:

- Enterprise authentication
- Payment processing
- Real retailer integrations
- Complex permissions

The purpose is to demonstrate the workflow.

---

# Shopper Experience

The second major interface is the consumer-facing shopping experience.

The shopper should be able to:

- Ask a shopping question
- Receive multiple product suggestions
- See Confĩa verification
- See unverified products
- View Trust Scores
- Understand why a score exists
- Change verification filtering
- Switch between English and Spanish
- Open the underlying product
- See potential discrepancies

---

# Shopper UI

Suggested layout:

```text
┌─────────────────────────────────────────────────┐
│ Confĩa                               EN | ES     │
├─────────────────────────────────────────────────┤
│                                                 │
│ What are you shopping for?                      │
│                                                 │
│ [ I need a drill under $200...              ]   │
│                                        [ Ask ]  │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ Recommended for you                             │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ 20V Cordless Drill                         │ │
│ │                                             │ │
│ │ $149.99                                    │ │
│ │                                             │ │
│ │ ✓ CONFĨA VERIFIED                          │ │
│ │ Trust Score: 9.1 / 10                      │ │
│ │                                             │ │
│ │ ✓ Price                                    │ │
│ │ ✓ Availability                             │ │
│ │ ✓ Specifications                           │ │
│ │                                             │ │
│ │ [Why this score?]     [View Product]       │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

# Technology Stack

The hackathon prototype is designed around a lightweight web architecture.

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
```

Used for:

- Shopper interface
- Merchant dashboard
- Product cards
- Trust Score displays
- Verification badges
- Language selector
- Trust breakdown interface

---

## Backend

```text
Next.js API Routes
Node.js
TypeScript
```

Used for:

- Product search
- Product retrieval
- Verification
- Trust Score calculation
- AI requests
- Merchant product submission

The prototype intentionally avoids unnecessary microservices.

---

# Database

Recommended:

```text
Supabase
PostgreSQL
```

Example tables:

```text
products
verification_records
trust_scores
merchants
product_evidence
```

For an extremely time-constrained prototype, the database can initially be replaced with:

```text
/data/demo-products.json
```

and migrated to Supabase once the user experience is functional.

---

# AI Layer

An LLM API can handle:

- Conversational shopping queries
- Query interpretation
- English/Spanish interaction
- Natural-language explanation

However:

> **The LLM should not independently calculate the Trust Score.**

Trust Score calculation should remain deterministic.

```text
LLM
 │
 ├── Conversation
 ├── Query interpretation
 └── Explanation generation

Verification Engine
 │
 ├── Product facts
 ├── Verification rules
 └── Trust Score
```

---

# Integration Layer

The proposed architecture uses a Model Context Protocol-compatible interface where supported.

The purpose of this layer is to expose Confĩa functionality as tools that conversational systems can query.

Conceptually:

```text
                   CONVERSATIONAL AI

                           │
                           │
                         MCP
                           │
                           ▼

                  ┌─────────────────┐
                  │ CONFĨA SERVER   │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼

      search_products  get_product  get_trust_score

             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                      CONFĨA DATA
```

The hackathon prototype does not depend on a production MCP deployment.

If an external integration is unavailable during the demonstration, the same backend functionality can be demonstrated through the Confĩa shopper interface.

---

# Suggested Project Structure

```text
confia/
│
├── app/
│   │
│   ├── page.tsx
│   │
│   ├── shop/
│   │   └── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   └── api/
│       │
│       ├── search/
│       │   └── route.ts
│       │
│       ├── products/
│       │   └── route.ts
│       │
│       ├── verify/
│       │   └── route.ts
│       │
│       └── trust-score/
│           └── route.ts
│
├── components/
│   │
│   ├── ChatInterface.tsx
│   ├── ProductCard.tsx
│   ├── TrustBadge.tsx
│   ├── TrustBreakdown.tsx
│   ├── VerificationCard.tsx
│   ├── LanguageToggle.tsx
│   ├── VerificationFilter.tsx
│   └── DiscrepancyAlert.tsx
│
├── lib/
│   │
│   ├── ai.ts
│   ├── products.ts
│   ├── verification.ts
│   ├── trust-score.ts
│   └── translation.ts
│
├── data/
│   │
│   └── demo-products.json
│
├── public/
│
├── .env.local
├── README.md
├── package.json
└── tsconfig.json
```

---

# Data Model

A simple prototype product object could look like:

```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string;

  description: {
    en: string;
    es: string;
  };

  price: number;
  currency: string;

  availability:
    | "InStock"
    | "OutOfStock"
    | "Unknown";

  features: string[];

  productUrl?: string;

  verification: {
    price: boolean;
    availability: boolean;
    specifications: boolean;
    reviews: boolean;
  };

  verifiedAt?: string;

  trustScore?: number;
}
```

---

# Verification Model

```typescript
interface VerificationRecord {
  productId: string;

  priceVerified: boolean;
  availabilityVerified: boolean;

  specificationsVerified: number;
  specificationsTotal: number;

  reviewsVerified: boolean;

  lastVerified: string;

  evidence: VerificationEvidence[];
}
```

---

# Evidence Model

```typescript
interface VerificationEvidence {
  type:
    | "price"
    | "availability"
    | "specification"
    | "review"
    | "policy";

  source: string;

  value: string;

  verifiedAt: string;
}
```

---

# Trust Score Function

Example prototype logic:

```typescript
function calculateTrustScore(product: VerificationRecord): number {
  let score = 0;

  if (product.priceVerified) {
    score += 20;
  }

  if (product.availabilityVerified) {
    score += 20;
  }

  if (product.specificationsTotal > 0) {
    score +=
      (product.specificationsVerified /
        product.specificationsTotal) *
      25;
  }

  if (isFresh(product.lastVerified)) {
    score += 20;
  }

  if (product.reviewsVerified) {
    score += 15;
  }

  return Number((score / 10).toFixed(1));
}
```

The prototype can later be expanded with more sophisticated verification criteria.

---

# API Design

The proof-of-concept only requires a small API.

---

## Search Products

```text
POST /api/search
```

Request:

```json
{
  "query": "cordless drill under $200",
  "language": "en",
  "minimumTrustScore": 0
}
```

Response:

```json
{
  "products": [
    {
      "id": "drill-001",
      "name": "20V Cordless Drill",
      "price": 149.99,
      "trustScore": 9.1,
      "verified": true
    }
  ]
}
```

---

# Get Product

```text
GET /api/products/:id
```

Example:

```text
GET /api/products/drill-001
```

Returns:

- Product
- Price
- Availability
- Specifications
- Verification
- Trust Score
- Evidence

---

# Calculate Trust Score

```text
POST /api/trust-score
```

The endpoint receives verification information and calculates the score using deterministic rules.

---

# Verify Product Claims

```text
POST /api/verify
```

Request:

```json
{
  "productId": "drill-001",
  "claims": {
    "price": 199.99,
    "availability": "InStock"
  }
}
```

Potential response:

```json
{
  "productId": "drill-001",
  "discrepancies": [
    {
      "field": "price",
      "provided": 199.99,
      "verified": 149.99
    }
  ]
}
```

---

# MCP Integration

The proposed MCP interface can expose three primary tools.

```text
search_products

get_product

get_trust_score
```

Potential flow:

```text
ChatGPT / AI Assistant

        │
        │
        │ "Find me a drill under $200."
        │
        ▼

search_products()

        │
        ▼

Confĩa Product Database

        │
        ▼

Relevant Products

        │
        ▼

get_trust_score()

        │
        ▼

Verification Evidence

        │
        ▼

AI Response
```

The production version may expand this interface with additional tools.

Possible future tools:

```text
verify_claim

get_verification_evidence

report_discrepancy

get_product_history

get_supported_retailers
```

---

# Trust and Governance

Trust is the central product value of Confĩa.

Therefore the system should follow several principles.

## 1. Payment Does Not Equal Verification

Companies pay for the assessment process.

They do not purchase the outcome.

---

## 2. Trust Scores Must Be Explainable

Every Trust Score should have a breakdown.

```text
Trust Score: 8.7

Price              ✓
Availability       ✓
Specifications     ✓
Freshness          ✓
Reviews            ⚠
```

---

## 3. Sponsorship Must Be Visible

Sponsored relationships should be explicitly labeled.

```text
SPONSORED
```

and should not be presented as:

```text
VERIFIED
```

unless the product independently meets verification requirements.

---

## 4. Unverified Does Not Mean Bad

Confĩa should distinguish:

```text
Verified
```

from:

```text
Unverified
```

rather than automatically treating unverified products as unreliable or low quality.

---

## 5. AI Should Not Determine Truth

AI can help interpret user queries and explain results.

Verified product records remain the basis for factual product verification.

---

# Demo Dataset

For the hackathon, the catalog can consist of approximately 8-12 demonstration products.

Suggested category:

```text
Power Tools
```

The demo dataset should intentionally include:

### Product A

Highly verified.

```text
Trust Score: 9.3
```

### Product B

Mostly verified.

```text
Trust Score: 8.1
```

### Product C

Missing specification information.

```text
Trust Score: 6.2
```

### Product D

Old verification.

```text
Trust Score: 5.4
```

### Product E

Unverified.

```text
Trust Score: N/A
```

The dataset should also contain at least one deliberately conflicting value for the discrepancy demonstration.

Example:

```text
Presented Price
$199

Verified Price
$149
```

All synthetic/demo product data should be clearly identified as demonstration data.

---

# Demo Flow

The recommended hackathon demonstration follows one customer journey.

---

## STEP 1

Customer asks:

```text
I need a cordless drill under $200
for basic projects around my house.
```

---

## STEP 2

The shopping experience returns relevant products.

```text
Recommended Products

Product A
Product B
Product C
```

---

## STEP 3

Confĩa provides verification context.

```text
Product A

✓ CONFĨA VERIFIED

Trust Score
9.1 / 10
```

---

## STEP 4

Customer asks:

```text
Why should I trust this?
```

or selects:

```text
[ Why this score? ]
```

---

## STEP 5

Confĩa displays:

```text
WHY THIS PRODUCT IS VERIFIED

Price
✓ Verified

Availability
✓ Verified

Specifications
✓ Verified

Information Freshness
✓ Recently Verified

Supporting Evidence
✓ Available

------------------------

Trust Score

9.1 / 10
```

---

# STEP 6: Hallucination Demonstration

The AI/product experience displays:

```text
Price:
$199
```

Confĩa detects:

```text
⚠ POTENTIAL INFORMATION DISCREPANCY

Presented Price
$199

Verified Price
$149

Last Verified
September 29, 2026
```

---

# STEP 7: Spanish Experience

Customer switches:

```text
EN → ES
```

and asks:

```text
Necesito un taladro de menos de $200
para proyectos en mi casa.
```

Confĩa returns product information based on the same underlying verification records.

---

# STEP 8: Merchant Dashboard

The demo switches to the business side.

The judge sees:

```text
PRODUCT VERIFICATION

20V Cordless Drill

Price              ✓
Availability       ✓
Specifications     ✓
Reviews             ⚠

Trust Score

8.7 / 10
```

This completes the story:

```text
BUSINESS SUBMITS
      ↓
CONFĨA VERIFIES
      ↓
PRODUCT IS SCORED
      ↓
AI RETRIEVES
      ↓
SHOPPER UNDERSTANDS
      ↓
CUSTOMER TRUST
```

---

# Prototype Scope

This repository represents a proof-of-concept.

The prototype SHOULD demonstrate:

- Product search
- Product records
- Verification states
- Trust Score calculation
- Verified/unverified distinction
- Trust Score explanation
- English/Spanish experience
- Shopping interface
- Merchant dashboard
- Product discrepancy detection
- AI-assisted query interpretation

---

# What We Are NOT Building Yet

For the hackathon prototype, the following are intentionally outside scope:

```text
× Real payment processing
× Enterprise authentication
× Hundreds of products
× Production retailer integrations
× Automatic retailer scraping
× Full certification infrastructure
× Production security architecture
× Complex company permissions
× Full analytics system
× Real-time inventory infrastructure
× Large-scale multilingual support
```

These are future development opportunities.

---

# Prototype Development Priority

Development should follow this order:

```text
1. PRODUCT DATA
       ↓
2. TRUST SCORE
       ↓
3. SHOPPING EXPERIENCE
       ↓
4. SCORE EXPLANATION
       ↓
5. SPANISH EXPERIENCE
       ↓
6. DISCREPANCY DETECTION
       ↓
7. MERCHANT DASHBOARD
       ↓
8. MCP INTEGRATION
```

If time becomes limited, prioritize the **working shopper journey** before external integrations.

---

# Future Development

The production vision could expand Confĩa across:

- Additional product categories
- Additional retailers
- Additional AI assistants
- Larger catalogs
- Additional languages
- Automated catalog synchronization
- Verification history
- Customer feedback
- Retailer analytics
- AI visibility monitoring
- Product change monitoring
- Referral tracking
- Conversion attribution
- Independent verification workflows
- Enterprise administration
- APIs for merchant integrations

---

# Recurring Verification

Confĩa is designed as an ongoing service rather than a one-time product certification.

Product information changes.

Examples include:

```text
Prices
Inventory
Product specifications
Promotions
Policies
Product versions
Availability
```

Therefore:

```text
INITIAL VERIFICATION
        ↓
PRODUCT CHANGES
        ↓
RE-VERIFICATION
        ↓
UPDATED TRUST SCORE
        ↓
ONGOING MONITORING
        ↺
```

This supports the recurring-service model proposed in the business plan.

---

# Business Model

Confĩa follows a B2B subscription model.

Enterprise customers pay Confĩa for product assessment, monitoring, and access to the platform.

The proposed business-plan pricing is:

```text
Enterprise Subscription

$6,000 / month

$72,000 / year

+

One-Time Onboarding Fee

$15,000
```

The proposed enterprise subscription supports up to:

```text
500 priority products
```

and ongoing monitoring according to the business-plan service model.

These numbers represent proposed hackathon business assumptions rather than finalized commercial pricing.

---

# Revenue Relationship

Conceptually:

```text
ENTERPRISE CUSTOMER
        │
        │ Subscription
        ▼
      CONFĨA
        │
        ├── Product Verification
        │
        ├── Monitoring
        │
        ├── Trust Scores
        │
        ├── Structured Data
        │
        └── Analytics
        │
        ▼
AI-ASSISTED SHOPPING
        │
        ▼
     CONSUMER
```

The consumer-facing verification information can provide value to shoppers while enterprise customers fund the verification infrastructure.

---

# Design Philosophy

Confĩa is built around one central idea:

> **We are not replacing AI shopping. We are creating the trust layer underneath it.**

AI is valuable for:

```text
Discovery
Conversation
Personalization
Query understanding
Product comparison
```

Confĩa focuses on:

```text
Verification
Accuracy
Freshness
Transparency
Evidence
Trust
```

Together:

```text
               AI
               │
               │ finds
               ▼
            PRODUCT
               │
               │ verified by
               ▼
            CONFĨA
               │
               │ trusted by
               ▼
            CUSTOMER
```

---

# Success Criteria

For the hackathon proof-of-concept, the project is successful if we can demonstrate:

```text
✓ Customer asks a real shopping question

✓ System retrieves relevant products

✓ Verified products receive Trust Scores

✓ Unverified products are clearly identified

✓ Customer can understand WHY a score exists

✓ Incorrect information can be flagged against
  a verified product record

✓ The same verified information supports
  English and Spanish experiences

✓ Merchant can see the verification status
  of submitted products
```

---

# Team

Developed by the UCF team for the:

## 2026 HSI Battle of the Brains

Team Members:

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

```text
STATUS: HACKATHON PROOF-OF-CONCEPT
```

Confĩa is currently a prototype designed to demonstrate the technical feasibility and business potential of adding a transparent product-verification layer to AI-assisted shopping.

The current Trust Score methodology, product information, retailer relationships, integrations, and verification workflows should not be interpreted as production certification infrastructure unless explicitly identified otherwise.

---

# Confĩa

### AI helps you find it. Confĩa helps you trust it.

```text
DISCOVER → VERIFY → UNDERSTAND → TRUST
```
