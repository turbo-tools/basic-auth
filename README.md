# @turbo-tools/basic-auth

Pluggable Basic Auth functionality for [turbo-http](https://github.com/mafintosh/turbo-http) based servers

[![Build Status](https://travis-ci.org/turbo-tools/basic-auth.svg?branch=master)](https://travis-ci.org/turbo-tools/basic-auth)
[![npm (scoped)](https://img.shields.io/npm/v/@turbo-tools/basic-auth.svg?style=flat-square)](https://www.npmjs.com/package/@turbo-tools/basic-auth)
[![dependencies Status](https://david-dm.org/turbo-tools/basic-auth/status.svg)](https://david-dm.org/turbo-tools/basic-auth)
[![dependencies Status](https://david-dm.org/turbo-tools/basic-auth/dev-status.svg)](https://david-dm.org/turbo-tools/basic-auth#info=devDependencies)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3f7c95c81719a6d64b02/test_coverage)](https://codeclimate.com/github/turbo-tools/basic-auth/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/3f7c95c81719a6d64b02/maintainability)](https://codeclimate.com/github/turbo-tools/basic-auth/maintainability)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fturbo-tools%2Fbasic-auth.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fturbo-tools%2Fbasic-auth?ref=badge_shield)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/greenkeeperio/greenkeeper.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/turbo-tools/basic-auth/badge.svg?targetFile=package.json)](https://snyk.io/test/github/turbo-tools/basic-auth?targetFile=package.json)

## Getting Started

```js
const check = require('@turbo-tools/basic-auth')
```

### check(request, response, arrayWithUserPasswordPairsOrCallback)

Get the basic auth credentials from the given request. The `Authorization`
header is parsed and if the header is invalid, `false` is returned.
It also sets the `WWW-Authenticate` header to `Basic realm="example"` by default.

## Example

```js
const check = require('@turbo-tools/basic-auth')
const isValid = check(request, response, [['user1', 'pass1'], ['user2', 'pass2']])
// if an `Authorization` is given, it checks for every combination in the array given,
// if it finds a matching pair, it returns true, otherwise false
```

### With turbo-http server

```js
const http = require('turbo-http')
const check = require('@turbo-tools/basic-auth')
// in production environments, use something like tsscmp
// to prevent short-circut and use timing-safe compare
const compare = require('tsscmp')

// Create server
const server = http.createServer(function (req, res) {
  const isValid = check(req, res, function (credentials) {
    let valid = true
    // Simple method to prevent short-circut and use timing-safe compare
    valid = compare(name, 'john') && valid
    valid = compare(pass, 'secret') && valid
    return valid
  })

  // Check if auth has been successfull & respond accordingly
  if (!isValid) {
    const denied = 'Access denied'
    res.statusCode = 401
    res.setHeader('Content-Length', denied.length)
    res.write(Buffer.from(denied))
  } else {
    const granted = 'Access granted'
    res.statusCode = 200
    res.setHeader('Content-Length', granted.length)
    res.write(Buffer.from(granted))
  }
})


// Listen
server.listen(3000)
```

### Installing

```bash
npm install @turbo-tools/basic-auth --save
```

## Running the tests

All tests are contained in the [test.js](test.js) file, and written using [Jest](https://facebook.github.io/jest/docs/en/getting-started.html)

Run them:

```bash
npm test
```

If you´d like to get the coverage data in addition to runnign the tests, use:

```bash
npm run test-coverage
```

## Built With

* [NPM](https://www.npmjs.com/) - Dependency Management
* [Commitizen](https://github.com/commitizen/cz-cli) - Easy semantic commit messages
* [Jest](https://facebook.github.io/jest/) - Easy tests
* [Semantic Release](https://github.com/semantic-release/semantic-release) - Easy software releases

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process for submitting pull requests to us, and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on the code of conduct.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/turbo-tools/basic-auth/tags).

## Authors

* **Sebastian Golasch** - *Initial work* - [asciidisco](https://github.com/asciidisco)

See also the list of [contributors](https://github.com/turbo-tools/basic-auth/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to [@mafintosh](https://github.com/mafintosh) for building [turbo-net](https://github.com/mafintosh/turbo-net) and [turbo-http](https://github.com/mafintosh/turbo-http)
