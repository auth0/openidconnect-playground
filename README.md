# OpenID Connect Playground

Uses Express, React, and I'll be taking apart passport next.

## Sponsor

|||
|-|-|
|![auth0 logo](https://user-images.githubusercontent.com/83319/31722733-de95bbde-b3ea-11e7-96bf-4f4e8f915588.png)|If you want to quickly add secure token-based authentication, built on the OpenID Connect standard to your projects, feel free to check Auth0's documentation and free plan at [auth0.com/developers](https://auth0.com/developers?utm_source=GHsponsor&utm_medium=GHsponsor&utm_campaign=oidc-playground&utm_content=auth)|

## Environment:

If running locally, create a `.env` file with these values:
```
JWT_SECRET=y0ur_secret
REDIRECT_URI=http://localhost:5000/callback
CLIENT_ID=(client_id from a client in your tenant)
CLIENT_SECRET=(client_secret from a client in your tenant)
NON_SECURE_SESSION=true
```

## To build:

```
npm run build
```

## To run:

```
node index.js
```

[http://localhost:5000](http://localhost:5000)

## Dev:

Terminal 1 (backend):
```
npm start
```

Terminal 2 (frontend):
```
npm run watch
```

[http://localhost:5000](http://localhost:5000)
