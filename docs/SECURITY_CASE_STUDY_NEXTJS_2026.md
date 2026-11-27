# Case Study: Next.js Dependency Advisory Detection and Remediation

**Project:** [skuzu7/freeband-nextjs](https://github.com/skuzu7/freeband-nextjs)  
**Research type:** first-party dependency remediation and CI validation; **not** a third-party vulnerability discovery.  
**Evidence:** [remediation PR #10](https://github.com/skuzu7/freeband-nextjs/pull/10), [successful full GitHub Actions run](https://github.com/skuzu7/freeband-nextjs/actions/runs/43125517910).

## Summary

An automated pull-request pipeline identified a **critical-severity dependency advisory** involving the installed Next.js 16.3.8 line. The npm audit step failed before later tests ran. This is evidence that a dependency was flagged as vulnerable by the advisory database, **not** evidence that this specific deployment was practically exploitable or attacked.

The remediation upgraded `next` and `eslint-config-next` to **16.4.6**, regenerated the lockfile through npm, addressed one React immutability lint finding in native video caption handling, and ran the project's full CI suite before merging. No audit suppression or bypass of the security gate was used.

## Original detection

The PR verification log from the initial documentation-only change showed:

- `npm audit --omit=dev --audit-level=high` failing on Next.js 16.3.8;
- a **critical** severity report, with referenced advisories including [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) and [GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr);
- subsequent CI steps were skipped after the nonzero audit exit.

The initial remediation trial removed the critical production dependency finding, but the build pipeline then exposed a stricter `react-hooks/immutability` lint error in `src/components/media/player/Player.tsx` at the captions toggle. The code was adjusted to read the DOM video ref into a local variable before changing the associated native text track mode; the runtime interaction semantics were preserved.

## Change control

| Phase | Evidence | Acceptance standard |
| --- | --- | --- |
| Detect | Initial [CI run](https://github.com/skuzu7/freeband-nextjs/actions/runs/43122468507) | Fail on high/critical production dependency advisories |
| Patch | [PR #10 commits/diff](https://github.com/skuzu7/freeband-nextjs/pull/10/files) | Update version and lockfile without disabling audit |
| Regress | [Full passing CI run](https://github.com/skuzu7/freeband-nextjs/actions/runs/43125517910) | Audit, unit/security tests, lint/typecheck, production build, visual/a11y/motion/performance gates |
| Maintain | [Dependency-update config](https://github.com/skuzu7/freeband-nextjs/blob/main/.github/dependabot.yml) | Reviewable weekly update proposals; no automatic merges |

## Verified result and residual uncertainty

In the passing CI run, npm reported **0 production-dependency vulnerabilities** for `npm audit --omit=dev --audit-level=high`. The complete job concluded successfully, including unit and security tests, lint, typecheck, production build, visual browser smoke tests, reduced-motion checks and performance budget. The initial dependency install still reported **moderate/high advisories in development dependencies** (16 total in that run); these require follow-up. Neither a clean production audit nor passing smoke tests guarantees absence of vulnerabilities.

This repository update **does not prove that a remote production service has been redeployed**, that all exploitation preconditions were present, or that anyone discovered an unknown vulnerability. It is a concrete **advisory detection → patch → regression → CI evidence** case study in first-party software.

## Reproduce locally

Use a clean checkout of a reviewed commit (Node.js version matching the repository's declared engine and lockfile):

```bash
npm ci
npm audit --omit=dev --audit-level=high
npm run test
npm run lint
npm run typecheck
npm run build
```

Browser and performance smoke tests also need a running production build; consult the CI workflow for environment variables and startup. Never reuse CI dummy secrets in production. To compare the original failure with remediation, inspect the PR diff and recorded GitHub Actions logs instead of downgrading a production system.

## Secure research boundaries

The investigation involved only maintainer-controlled code and CI; no third-party production probing or exploitation. Any newly discovered externally reportable issue should follow responsible disclosure. Severity from an advisory database is not a substitute for application-specific exploitability analysis.

**Author:** Antonio Caetano (@skuzu7). This document is a transparent evidence report, not an attestation, CVE claim, accepted bug bounty or external security audit.
