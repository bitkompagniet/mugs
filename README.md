For API endpoint details, see [the documentation](docs/index.md).

## Quickstart

Add to the project:

```
npm i --save mugs
```

Then mount the application:

```javascript
const express = require('express');
const mugs = require('mugs');

const configuration = {
	appName: 'My application'
};

const app = express();
app.use(mugs(configuration));
```

## Unit tests

```
npm test
```

## Command line

You can sign a test user token with:

```bash
npm run sign -- [--secret <secret>] [--clean] [...roles]
```

Roles are space-separated roles on the `role@scope` form. `secret` is optional, and will default to `ssh`. The expiry period will be set to 7 days on creation. `clean` can be set to suppress adding default user roles.

## Configuration

- `appName`: the application name, shown in e-mail.
- `appUrl`: the root URL to the application, used to prefix the links sent in e-mails.
- `db`: mongo URI for the user database.
- `smtp`: smtps string for sending e-mails.
- `senderEmail`: e-mail to use as From in system e-mails.
- `secret`: secret used to issue and verify JWT tokens.
- `logoLink`: URL to logo displayed in template.
- `redirectConfirmUrl`: URL used for confirmation redirection. Will receive `success` query param, and `message` on failure.
- `port`: port to start the process on.

## User model and endpoints

See the [documentation](docs/index.md).