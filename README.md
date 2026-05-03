# Firedrill Mock Shop

Welcome to the Firedrill workshop. This is a small e-commerce site with five
production incidents currently breaking the customer experience. Your job is
to fix them under time pressure, with AI assistance, in 45 minutes.

## How the workshop runs

- 12 participants, each working in their own isolated VPS slot (p1..p12).
- 5 incidents fire on a randomized schedule over the first few minutes.
- Each fix gets validated by an automated Playwright spec running against your
  slot's preview URL.
- Your kanban (in the workshop microsite) updates live as incidents move from
  todo -> in_progress -> done.
- The facilitator is on stage. The two co-presenters can answer questions in
  the room.

## The five incidents (customer reports)

These are the symptoms customers reported. The bug locations are NOT given —
that's the exercise.

- **INC-A:** Customer reports their multi-item cart total is off by 1 CZK on
  every order with mixed-currency items.
- **INC-B:** Monitoring: search-api p95 latency 8s+ when users type single
  letters. 502 errors spiking.
- **INC-C:** Customer report: "My SubClub points were credited to yesterday —
  I checked out at 00:30."
- **INC-D:** Slovak customer: "Why are these prices in CZK and showing
  Czech-only items? I'm in Bratislava."
- **INC-E:** QA: Several customers complaining the cart total stays the same
  after they remove items. Reproducible in Chrome.

(Hints become available in the kanban after a few minutes if you're stuck.)

## Setup

```
git clone https://github.com/Visionvolve/firedrill-mock-public.git
cd firedrill-mock-public
npm install
npm run dev      # opens http://localhost:3000 — verify the shop loads
```

You can also run the validation specs locally before submitting (much faster
feedback than round-tripping to the workshop validator):

```
npx playwright install chromium    # first time only
npm run test:incidents
```

## Deploy your fix

When the kanban shows your fix on a green incident, you can deploy:

```
npm run submit
```

The script will prompt for your cohort code and deploy token (visible in the
kanban "Show deploy token" button — click it to copy to clipboard). Or set
them as environment variables:

```
FIREDRILL_COHORT=M2TEST FIREDRILL_TOKEN=frd_... npm run submit
```

Or save them in `~/.firedrill/token` (one line each, token first):

```
mkdir -p ~/.firedrill
printf "frd_yourtoken...\nM2TEST\n" > ~/.firedrill/token
```

The script tars your working tree (excluding node_modules, .git, .next,
test-results, playwright-report — see `.firedrillignore`) and uploads it to
the workshop microsite. The server runs the validation spec against your
deployed code and the kanban updates live.

If the script reports `passed`, you're done with that incident. If it reports
`failed`, the kanban link in the output shows which assertion failed and
why — open it, refine the fix, and `npm run submit` again.

## Reset

If your changes broke the slot beyond use, click "Reset my slot" in your
kanban (or ask the facilitator to wipe all slots).

## Tips

- **Read the symptoms before touching anything.** Five minutes of reading
  saves twenty minutes of grep-driven exploration.
- **Use the time pressure.** The clock is the point of the exercise; lean
  into the discomfort of shipping under deadline.
- **Don't refactor.** If the fix is a one-line patch, ship the one-line
  patch. The exercise is debugging speed, not code aesthetics.
- **AI assistance is encouraged.** Open Claude Code, paste the symptom,
  let the agent grep your repo. The exercise teaches AI-assisted debugging,
  not AI-free hero work.
- **Run the local specs before submitting.** `npm run test:incidents` runs
  in seconds; the round-trip to the workshop validator takes ~30s per try.

## What this is NOT

- Production code. The shop is a teaching toy with synthetic incidents.
- A real customer-facing platform. No real payments, no real data.
- Affiliated with Dr.MAX. Visual design is an approximation used solely for
  this internal training exercise.
