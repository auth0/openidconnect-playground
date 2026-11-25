# Engineering principles: KISS, SOLID, Clean Code, functional style

> How the constitution shows up in code. Pragmatic, not dogmatic: a principle that makes the code harder to read in this context loses to readability.

## KISS / YAGNI: decision test

Before adding anything ask: (1) Which acceptance criterion needs it? (2) What is the simpler version? (3) What does it cost to delete later? If (1) is empty, don't add it.

## Clean Code rules (with limits)

| Topic | Rule | Limit |
| --- | --- | --- |
| Names | Intent-revealing, domain vocabulary (`redirectUri`, not `url2`). Files mirror the thing they define. | n/a |
| Functions | Do one thing, one level of abstraction, ≤ 3 params (use an object beyond). | ~30 lines |
| Modules | One reason to change. | ~300 lines; split when a second concern appears |
| Comments | Explain **why**, never **what**. Default to none: no comment that restates the code, none on every line or block, no section banners, no docstrings on obvious functions. If code needs a comment to be understood, rename or extract it first. Delete commented-out code. | n/a |
| Errors | Fail fast at boundaries, typed/explicit errors, no silent `catch`. | n/a |
| Duplication | Extract on the **third** occurrence (rule of three), and only if the abstraction has a name. | n/a |
| Dead code | Remove it. Git remembers. | n/a |
| Consistency | Match the surrounding style over personal taste. | n/a |

## SOLID in this stack

| Principle | Meaning here | Example |
| --- | --- | --- |
| **S**ingle responsibility | A component renders; a service computes; a store holds state. | `app/api/validate/utils.ts` verifies a token; a React component only displays the result. |
| **O**pen/closed | Extend via data/config, not by editing core. | A new server template = one entry in the configuration data, not a new branch in each step. |
| **L**iskov | Substitutes honor the contract. | Any "key input" implementation returns the same shape. |
| **I**nterface segregation | Small, focused props/APIs. | Pass the three fields a component needs, not the whole model. |
| **D**ependency inversion | Domain logic does not import frameworks/IO; inject at the edge. | Route handlers call pure functions (see `app/api/validate/utils.ts`); tests call them without a server. |

## Functional programming

Prefer a functional style where it keeps the code simpler; it is the default for domain logic.

- **Pure functions:** same input, same output, no hidden state. Parsing, formatting and decision logic are pure and unit-tested without a server or a DOM.
- **Immutable data:** return new values instead of mutating arguments or shared objects (`map`/`filter`/spread, `readonly` types).
- **Side effects at the edges:** network, storage, DOM and env access live in thin boundary functions; pure functions are composed in between.
- **Small, composable functions** over classes with inherited state. Use a class or a store only when the framework needs one.
- **Limit:** do not introduce functional libraries or abstractions (monads, pipe utilities) for their own sake; KISS wins over style.

## Frontend specifics

- **Components:** if it has behavior (events, state, lazy load) it is a component; pure markup reuse is a template partial/include.
- **React/Next:** server components by default, `"use client"` only at the leaves that need it (the debugger, headers, theme switcher and shell are client components today); colocate by feature (`src/features/<name>/{components,services,models,actions}`); no business logic in components. Route handlers in `app/api/**` are an ask-first zone.
- **TypeScript:** `strict: true`; no `any` without a comment; parse unknown input at the boundary.
- **CSS:** one SCSS module per component, `--color_*` tokens for color, the breakpoint variables for media queries. No CSS-in-JS. Global CSS only in `globals.scss`.

## Optimization policy

1. Measure first (Lighthouse, bundle analyzer, `performance.mark`). No optimization without a number.
2. Do the cheap structural wins before micro-optimizations: fewer bytes, fewer requests, less JS, cache at build time (e.g. content-hash disk caches).
3. Record the before/after in the PR.

## Smells that trigger a refactor request

Shotgun surgery (one change touches many files), boolean-flag parameters, god modules, deep prop drilling, copy-pasted blocks, comments that restate code, `utils` dumping grounds.
