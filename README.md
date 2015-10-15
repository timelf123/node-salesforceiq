# node-salesforceiq
SalesforceIQ API wrapper for NodeJS

Inspired by https://github.com/sjlu/node-relateiq

This module makes it easier to communicate with the SalesforceIQ API in NodeJS.

## Usage
### Installation

```
npm install salesforceiq --save
```

### Getting Started
```
var SalesforceIQ = require('salesforceiq');

var client = new SalesforceIQ(key, secret);
client.createAccount({
  name: "Abacus"
}, function(err, account) {
  console.log(err);
  console.log(account.id);
});
```

### More Examples

## Developing

### Tests
To run the mocha tests, you'll need to have a valid SalesforceIQ API Key and Secret. Once you have obtained them, you will need to expose them to your local
environment.

```
export SALESFORCEIQ_KEY=
export SALESFORCEIQ_SECRET=
```

## License

MIT.
