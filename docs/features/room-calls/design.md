---
description: "Room Calls: user journeys, interaction states, and design constraints."
icon: pen-ruler
---

# Design

Companion to [specification](spec.md). The following UX is transposed from the same source revision without changing behavior.

### Entry and discovery

A room shows whether a call is active and who is present. A person with room view access can start or join from that room. The entry action clearly distinguishes joining from sending a room message.

### In-call experience

The expanded view shows participants and their media state, with screen sharing available when supported. Controls for microphone, camera, screen sharing, device choice, and leaving remain easy to find. Each control reports its current state. A denied device permission or failed share produces a clear explanation and leaves the medium off. Plan usage and remaining participant-minutes are accessible from the call and limits page; a warning precedes exhaustion, and the call's end explains the monthly limit.

### Navigation and switching

A compact call control remains available while the participant navigates Wodge. Closing the expanded view minimizes it; leaving is a separate action. Attempting to join another room call opens a confirmation that names the consequence of disconnecting the current call.

### Feedback and accessibility

The interface distinguishes connecting, connected, reconnecting, and disconnected states. Participant names, media state, and errors are conveyed in text as well as visual cues. Controls have accessible names and keyboard paths. An access loss explains why the call ended.

### Changes from the capstone

The capstone already had room-based audio/video, screen sharing, self-controls, and a compact call card. The revival keeps those experiences while starting microphone and camera off, defining room-view access for call participation, confirming a switch to another room call, and disconnecting when authorization is lost.

## Engineering boundaries

Use the [shared architecture](../../architecture/overview.md), [domain model](../../architecture/domain-model.md), [security rules](../../architecture/security.md), [quality requirements](../../architecture/non-functional-requirements.md), [stack](../../architecture/tech-stack.md), and [testing strategy](../../development/testing-strategy.md). These are migrated shared decisions, not newly invented feature contracts. HTTP, synchronization and MCP paths must preserve the same authoritative product rules where applicable.

Detailed schemas, endpoint contracts and implementation patterns not settled by those sources remain implementation decisions. The owner authors repository agent instructions; this migration does not generate `AGENTS.md`.

## Prototypes and evidence

The inspected Linear documents contain written UX, not a standalone executable prototype. No prototype asset has been invented or an empty prototypes directory created. Existing capstone screens/code are implementation evidence and may differ from the revival specification. The repository walkthrough remains linked from the root README.

## Delivery and operation

Detailed work and evidence remain in the existing Linear project. Shared [CI/CD](../../operations/ci-cd.md), [deployment coordination](../../operations/runbooks/revival-deployment.md), [release policy](../../operations/release-policy.md), and [maintenance guidance](../../operations/maintenance.md) apply. Any additional feature rollout or migration requirement needs explicit coordination; lack of a feature deployment file does not assert operational readiness.

## Source and revision

- Migrated from [Room Calls](https://linear.app/amr21/document/room-calls-1db9fa3b4d87), document ID `dbd27a6f-c380-4496-822a-03bc412bd913`.
- Source revision: 2026-10-06T23:58:37.250Z; source author: Amr Yasser; last editor: Amr Yasser.
- Repository migration revision: `migration-draft-1`, 2026-10-09. The user confirmed preparation and placement in this chat. Approval of this rewritten repository revision and remote canonical-link cutover is pending.
- Existing decision/approval statements are source evidence, not new approvals or proof of implementation.
