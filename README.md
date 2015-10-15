# node-salesforceiq
SalesforceIQ API wrapper for NodeJS

[![Coverage Status](https://coveralls.io/repos/Illumineto/node-salesforceiq/badge.svg?branch=master&service=github)](https://coveralls.io/github/Illumineto/node-salesforceiq?branch=master) [![Build Status](https://travis-ci.org/Illumineto/node-salesforceiq.svg?branch=master)](https://travis-ci.org/Illumineto/node-salesforceiq)

Inspired by https://github.com/sjlu/node-relateiq

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
