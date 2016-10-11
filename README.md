# OpenID Connect Playground

Uses Express, React, and I'll be taking apart passport next.

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

## Dev:

Terminal 1 (backend):
```
npm start
```

Terminal 2 (frontend):
```
npm run watch
```
