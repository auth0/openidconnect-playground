# OpenID Connect Playground

An interactive playground for exploring the [OpenID Connect](https://openid.net/connect/) authorization-code flow step by step: discover a provider, exchange an authorization code for tokens, and inspect the decoded ID token.

Built with **Next.js 16** (App Router), **React 19**, and **TypeScript**. The OAuth/OIDC backend logic runs as Next.js route handlers under `app/api/*` (`discover`, `auth_data`, `callback`, `code_to_token`, `validate`, `fallback`).

## Sponsor

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/images/auth0-footer-logo-dark.svg">
  <img alt="Auth0 by Okta — Developers" src="public/images/auth0-footer-logo-light.svg" width="260">
</picture>

If you want to quickly add secure token-based authentication, built on the OpenID Connect standard to your projects, check out Auth0's documentation and free plan at [auth0.com/developers](https://auth0.com/developers?utm_source=GHsponsor&utm_medium=GHsponsor&utm_campaign=oidc-playground&utm_content=auth).

## Requirements

- Node.js >= 22

## Environment

Create a `.env` file in the project root (use [`.env.sample`](.env.sample) as a starting point):

```
CLIENT_ID=(client_id from a client in your tenant)
CLIENT_SECRET=(client_secret from a client in your tenant)
JWT_SECRET=y0ur_secret
REDIRECT_URI=http://localhost:3000/api/callback
```

`REDIRECT_URI` must point at the running app's `/api/callback` route and match a callback URL configured on your OIDC client. The dev server runs on port `3000` by default (see below).

Optional analytics variables (only needed in production-like deployments): `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_ADOBE_ANALYTICS_URL`, `NEXT_PUBLIC_IS_PROD`.

## Install

```
npm ci
```

## Develop

```
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Build & run (production)

```
npm run build
npm start
```

## Testing

The project has both unit tests (Vitest) and end-to-end tests (Playwright).

### Unit tests (Vitest)

Route handlers and utilities under `tests/` are covered with [Vitest](https://vitest.dev/).

```
npm run test        # watch mode
npm run test:run    # single run
npm run coverage    # single run with coverage report
```

### End-to-end tests (Playwright)

The debugger happy-path flow is covered end-to-end with [Playwright](https://playwright.dev/) under `e2e/`, running on Chromium and Firefox. The test mocks the backend API calls, so no live OIDC provider is required.

First install the browsers (once):

```
npx playwright install --with-deps
```

Then run the suite (the `NODE_OPTIONS` flag is required on Node 22):

```
NODE_OPTIONS="--no-experimental-strip-types" npm run test:e2e
```

Playwright auto-starts the dev server (`npm run dev`) on port `3000`, so no separate server is needed. To explore interactively, append `-- --ui` or `-- --headed`.

## Lint

```
npm run lint
npm run lint:fix
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
