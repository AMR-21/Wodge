# Financial Assessment

### Purpose and decision

Wodge is a portfolio showcase with **Stripe test-mode billing** on **Workers Free**, without a Workers Paid subscription. Demo Pro displays **$29/month as an illustrative test price**; no subscriber pays it, so actual subscription revenue is **$0**. The original paid-plan calculation that suggested $29 is preserved below as historical reasoning and explicitly superseded. Current provider terms were checked on **2026-09-28**.

### Historical $50 model

The capstone's [Final Doc 2.pdf](<https://drive.google.com/file/d/1neESq9nYHmZFsH7o1KWp-u15nzoAqAFZ/view>), §2.3 Business Model, estimated monthly costs for a premium workspace as follows:

| Original line | Estimated monthly cost |
| -- | -- |
| Worker requests | $0.90 |
| Durable Objects, including a $5 Workers paid base | $6.513512 |
| LiveKit calls | $24.20 |
| R2 storage | $1.50 |
| GPT-3.5 writing | $4.50 |
| **Total** | **$37.613512** |

At $50, the historical model implied **$50 − $37.613512 = $12.386488**, approximately **$12.39**, before unmodeled costs. The graduation slides also described roughly $12 profit. That calculation mixed account-wide minimums and included allowances into a per-workspace estimate, so it was an illustrative business model rather than verified unit economics. It cannot be reused unchanged: the revival removes hosted AI, replaces LiveKit with Cloudflare Realtime, reduces storage allowances to 50/500 MB, and changes the data architecture.

### Current operating and cost boundary

The showcase uses **Workers Free** and does **not** subscribe to Workers Paid. SQLite-backed Durable Objects are available on this plan. Workers and Durable Objects do not accumulate paid overages within this plan: when a free limit is exhausted, affected operations fail until the relevant reset or capacity is available. Product-level Free and Demo Pro limits do not enlarge Cloudflare's account-wide free limits.
The cost and capacity assessment therefore has two distinct parts: **hard Workers/DO service limits** and **other services that may have monetary charges**. The user-facing pooled storage quota combines structured data and files, while Durable Objects SQLite and R2 have different provider limits and meters. Requests, CPU, active DO duration, database rows, stored bytes, and media egress must be assessed separately.

| Service | Published free allowance or cost behavior |
| -- | -- |
| [Workers Free](<https://developers.cloudflare.com/workers/platform/limits/>) | 100,000 requests per account per day and 10 ms CPU per invocation. After the daily request cap, the Worker returns Error 1027; consistently exceeding CPU can terminate an invocation. Static asset requests are free under [Workers pricing](<https://developers.cloudflare.com/workers/platform/pricing/>). |
| [SQLite-backed Durable Objects on Workers Free](<https://developers.cloudflare.com/durable-objects/platform/pricing/>) | 100,000 requests and 13,000 GB-s active duration per day; 5 million SQLite rows read and 100,000 rows written per day; 5 GB total SQLite stored data. Exceeding a free limit makes further operations of that type fail. Daily limits reset at 00:00 UTC. |
| [R2 Standard](<https://developers.cloudflare.com/r2/pricing/>) | 10 GB-month storage, 1 million Class A, and 10 million Class B operations included per month; overage prices are $0.015/GB-month, $4.50/million A, and $0.36/million B. Direct R2 egress is free. Cloudflare [requires a separate R2 subscription](<https://developers.cloudflare.com/r2/get-started/>) to use R2, even though initial usage is included. This is separate from Workers Paid. |
| [Cloudflare Realtime](<https://developers.cloudflare.com/realtime/sfu/platform/pricing/>) | SFU and TURN share 1,000 GB/month of included egress; further egress is $0.05/GB. Media ingress is free. |

[Stripe test mode](<https://docs.stripe.com/testing>) simulates payments without moving money, so showcase subscription revenue is **$0**. Email delivery, domain, monitoring, any R2 or Realtime overage, and other add-ons remain potential costs. No assumption that the whole application is free follows from using Workers Free.

### Where the $29 figure came from

The first $29 proposal used **Workers Paid**, before the decision to run this project on Workers Free. Its hypothetical cohort was 10 Free workspaces plus one paying Demo Pro workspace. Each was assumed to make 3 million Worker requests per month and keep six DOs active for two hours on each of 22 days. The old paid-plan calculation was:

1. Workers Paid base: **$5.00**.
2. Worker request overage: 11 × 3 million = 33 million; 23 million above the 10 million included × $0.30/million = **$6.90**.
3. DO duration overage: 11 × 6 × 2 × 22 × 3,600 × 0.125 GB = 1,306,800 GB-s; 906,800 above the paid 400,000 allowance rounded to 1 million × $12.50/million = **$12.50**.
4. DO request overage: 11 × (3,801,600 incoming WebSocket messages ÷ 20 + 6 connections) = 2,090,946 billed requests; 1,090,946 above the paid 1 million allowance rounded to 2 million × $0.15/million = **$0.30**.
   Those **paid-plan assumptions** produced **$5 + $6.90 + $12.50 + $0.30 = $24.70/month** for the whole cohort. Applying an illustrative 15% margin gave **$24.70 ÷ 0.85 = $29.06**, rounded to **$29/month**. That is the exact origin of the displayed number. It was never measured unit economics and omitted several costs.
   **The $24.70 → $29 justification is superseded:** the chosen Workers Free plan has neither the $5 Paid base nor these paid overage charges, and the assumed traffic would breach its hard limits. The owner has chosen to **retain $29 solely as a Stripe test checkout/display amount** for the showcase. It is a demonstrative price, not a price derived from the current hosting cost, a validated margin, or a claim of real revenue.

### Free-plan feasibility of the old scenario

The old 11-workspace planning load would produce **33 million Worker requests per 30-day month**, averaging **1.1 million/day**. That is **11 times** Workers Free's 100,000 daily request cap. One workspace at the historical 3 million/month would average 100,000/day and leave no request headroom in a 30-day month.
The same cohort would use **11 × 6 × 2 × 3,600 × 0.125 = 59,400 DO GB-s per active day**, about **4.6 times** the 13,000 daily DO duration allowance. These averages are illustrative; real traffic may peak more sharply. The 10 ms Worker CPU limit is another unproven fit for authentication, synchronization, and billing callbacks. The former cohort is **not a viable free-plan forecast**. Actual showcase capacity requires measurements and validation at the planned admission and activity levels.
The product's member, pooled storage, and call-minute limits bound some demand, but do not by themselves bound Worker requests, DO duration, row operations, or CPU. The operator pause on new workspace creation can limit additional admission; it cannot prevent existing usage from reaching a provider cap. A cap breach can interrupt existing workspaces, and the financial assessment cannot promise continuous availability under the free plan.

### Storage, calls, and other financial exposure

The product allows **50 MB Free / 500 MB Demo Pro pooled user content**, **4 / 12 simultaneous call participants**, and **60 / 300 call participant-minutes per UTC month**. Full user-facing storage across the old 10 Free + 1 Pro cohort would be **1,000 MB**, before indexes, retained sync history, database overhead, and other Cloudflare-account usage. This is below the standalone 5 GB DO SQLite and 10 GB-month R2 included storage amounts, but the split between structured data and files and operation counts determines actual headroom. The pooled product quota is not a provider bill.
All 11 workspaces using their call allowances would produce 900 participant-minutes. At an assumed average 1 Mbps delivered per participant, that is about **6.75 GB** of Realtime egress; at 3 Mbps, **20.25 GB**, below today's shared 1,000 GB monthly included amount. Actual egress depends on media bitrate and fanout; participant-minutes are a product proxy, not Cloudflare's billing unit. At higher usage, Realtime and R2 may produce charges even while Workers remains Free.
The old capstone's **$50** price came from estimated **$37.613512** monthly cost and about **$12.39** contribution under its then-current assumptions. The retained **$29** is a test display choice with a documented, now-invalid paid-plan origin. No live margin exists because test subscribers pay nothing. Any later paid launch would need measured workload, free-to-paid conversion assumptions, service bills, payment fees, and a new price decision.### Related knowledge
[Product Definition](overview.md) defines the showcase product. [Demo Billing & Limits](../features/demo-billing-limits/spec.md) defines the user-facing plans, quotas, and test billing flow.

## Source and revision

- Migrated from [Financial Assessment](https://linear.app/amr21/document/financial-assessment-901c09fdc50e), document ID `13ff9369-df7d-4d95-b75b-4564cd21a4ce`.
- Source revision: 2026-10-06T23:59:25.680Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
