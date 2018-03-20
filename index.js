/**
 * RegExp for basic auth user/pass
 *
 * user-pass   = userid ":" password
 * userid      = *<TEXT excluding ":">
 * password    = *TEXT
 * @private
 */

const USER_PASS_REGEXP = /^([^:]*):(.*)$/

/**
 * Checks the given credential array for matches
 *
 * @param {object} credentials Users credentials
 * @param {string} credentials.name - Received username
 * @param {string} credentials.pass - Received password
 * @param {bool} valid Credentials are valid
 * @param {array} credentialPair Pair of credentials to check
 * @returns {boolean} Found matching credentials
 * @private
 */

function checkCredentialArray (credentials, valid, credentialPair) {
  return valid || (credentials.pass === credentialPair[1] && credentials.name === credentialPair[0])
}

/**
 * Parses basic auth base64 string to an object with username and password
 *
 * @param {string} authHeaderValue - Base64 coded user pass pair as string
 * @returns {(undefined|Object)} Decoded user and pass as object or undefined
 * @private
 */

function parse (authHeaderValue) {
  if (typeof authHeaderValue !== 'string') return undefined
  // parse header
  const match = authHeaderValue.split(' ')
  if (match[0].toLowerCase() !== 'basic') return undefined
  // decode user and pass
  const decoded = Buffer.from(match[1], 'base64').toString()
  const credentials = USER_PASS_REGEXP.exec(decoded)
  if (!credentials) return undefined
  return {name: credentials[1], pass: credentials[2]}
}

/**
 * Basic function to validate credentials,
 * sets the authorization headers
 *
 * @example
 * const check = require('@turbo-tools/basic-auth')
 * const isValid = check(request, response, [['user1', 'pass1'], ['user2', 'pass2']])
 * if (!isValid) { response.statusCode = 401; response.end() }
 * @example
 * const check = require('@turbo-tools/basic-auth')
 * const isValid = check(request, response, credentials => credentials.pass === 'admin' && credentials.name === 'admin')
 * if (!isValid) { response.statusCode = 401; response.end() }
 *
 * @param {Object} request Raw request object
 * @param {Object} response Raw response object
 * @param {(Array|Function)} credentialsArrayOrFn Nested array with user:pass pairs or validation function
 * @returns {boolean} Given user and pass are valid
 * @public
 */

function check (request, response, credentialsArrayOrFn) {
  // set authorization header
  response.setHeader('WWW-Authenticate', 'Basic realm="example"')
  // parse credentials (returns undefined if parsing goes wrong)
  const parsedCredentials = parse(request.getHeader('Authorization'))
  if (!parsedCredentials) return false
  // check if an external auth function is given, if so, execute
  if (typeof credentialsArrayOrFn === 'function') return credentialsArrayOrFn(parsedCredentials)
  // if the given credentials check isn't an array or a function, bail out
  if (!Array.isArray(credentialsArrayOrFn)) return false
  // check if given array matches the given credentials
  return credentialsArrayOrFn.reduce(checkCredentialArray.bind(null, parsedCredentials), false)
}

module.exports = check
