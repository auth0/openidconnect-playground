# OpenID Connect Playground

Uses Express, React, and I'll be taking apart passport next.

## Sponsor

|||
|-|-|
|![auth0 logo](https://user-images.githubusercontent.com/83319/31722733-de95bbde-b3ea-11e7-96bf-4f4e8f915588.png)|If you want to quickly add secure token-based authentication, built on the OpenID Connect standard to your projects, feel free to check Auth0's documentation and free plan at [auth0.com/developers](https://auth0.com/developers?utm_source=GHsponsor&utm_medium=GHsponsor&utm_campaign=oidc-playground&utm_content=auth)|

## Run the Project

### Development environment

Create a `.env` file under the root project directory:

```bash
touch .env
```

Populate the `.env` file with these values:

```
# A long, secret value used to encrypt the session cookie
JWT_SECRET='LONG_RANDOM_VALUE'
CLIENT_ID=(client_id from a client in your tenant)
CLIENT_SECRET=(client_secret from a client in your tenant)
REDIRECT_URI=http://localhost:5000/callback
NON_SECURE_SESSION=true
PORT=5000
```

You can execute the following command to generate a suitable string for the `JWT_SECRET` value:

```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

Run the following command in a terminal tab to run the server:

```
npm start
```

Then, run the following command in another terminal tab to watch the server for changes:
```
npm run watch
```

Visit [http://localhost:5000](http://localhost:5000) to interact with the application.

### Production environment

Run the following to build the project:

```bash
npm run build
```

Run the following command to run the built project:

```bash
node index.js
```

Visit [http://localhost:5000](http://localhost:5000) to interact with the application.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
