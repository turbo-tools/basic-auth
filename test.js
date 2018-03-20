/* eslint-env jest */
const bc = require('./index')
// default auth header value with credentials admin:admin
const requestWithCredentialsAdminAdmin = 'Basic YWRtaW46YWRtaW4='
// request/response mocks
const request = {
  header: '',
  getHeader: function () {
    return this.header
  }
}
const response = {
  headers: {},
  setHeader: function (a, b) {
    this.headers[a] = b
  }
}

afterEach(() => {
  request.header = ''
  response.headers = {}
})

test('can do successfull auth with array', () => {
  // setup
  request.header = requestWithCredentialsAdminAdmin
  const result = bc(request, response, [['admin', 'admin']])
  expect(result).toBeTruthy()
})

test('can do successfull auth with function', () => {
  // setup
  request.header = requestWithCredentialsAdminAdmin
  const result = bc(request, response, credentials => credentials.name === 'admin' && credentials.pass === 'admin')
  expect(result).toBeTruthy()
})

test('can do unsuccessfull auth with array', () => {
  // setup
  request.header = 'Basic YWRtaW46YWRtaW4='
  const result = bc(request, response, [['foo', 'bar']])
  expect(result).toBeFalsy()
})

test('can do unsuccessfull auth with function', () => {
  // setup
  request.header = requestWithCredentialsAdminAdmin
  const result = bc(request, response, credentials => credentials.name === 'foo' && credentials.pass === 'bar')
  expect(result).toBeFalsy()
})

test('does set basic auth header', () => {
  // setup
  request.header = requestWithCredentialsAdminAdmin
  bc(request, response, [['foo', 'bar']])
  expect(response.headers).toEqual({'WWW-Authenticate': 'Basic realm="example"'})
})

test('no auth header found', () => {
  const result = bc(request, response, [['foo', 'bar']])
  expect(result).toBeFalsy()
})

test('no auth header string', () => {
  request.header = {}
  const result = bc(request, response, [['foo', 'bar']])
  expect(result).toBeFalsy()
})

test('no auth method or array given', () => {
  // setup
  request.header = requestWithCredentialsAdminAdmin
  const result = bc(request, response)
  expect(result).toBeFalsy()
})

test('malformed auth given', () => {
  // setup
  request.header = 'Basic '
  const result = bc(request, response)
  expect(result).toBeFalsy()
})
