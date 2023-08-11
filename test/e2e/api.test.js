import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'

import { app } from '../../src/api.js'

describe('E2E > api', () => {
  let BASE_URL = ''
  let _server = {}
  let _globalToken = ''

  before(async () => {
    _server = app
    _server.listen() 
    await new Promise((resolve, reject) => {
      _server.once('listening', () => {
        const { port } = _server.address()
        BASE_URL = `http://localhost:${port}`
        console.log(`Server listening at ${BASE_URL}`)
        resolve()
      })
    })
  })

  after((done) => _server.close(done))

  describe('/login', () => {
    it('should receive not authorized when user or password is invalid', async () => {
      const input = {
        user: 'invalid',
        password: 'invalid'
      }

      const result = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(input),
      })

      const receivedBody = await result.json()
      const receivedStatus = result.status

      const expectedStatus = 401
      const expectedBody = { error: 'user invalid!' }

      assert.strictEqual(
        receivedStatus, 
        expectedStatus, 
        `status code should be 401, but received: ${result.status}`
      )

      assert.deepStrictEqual(
        receivedBody, 
        expectedBody, 
        `response body should be ${JSON.stringify(expectedBody)}, but received: ${JSON.stringify(receivedBody)}`
      )
    })

    it('should succesfully login when given valid user and password', async () => {
      const input = {
        user: 'mauricioromagnollo',
        password: 'valid_password'
      }

      const result = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(input),
      })

      const receivedBody = await result.json()
      const receivedStatus = result.status

      const expectedStatus = 200
      // const expectedBody = 

      assert.strictEqual(
        receivedStatus, 
        expectedStatus, 
        `status code should be 200, but received: ${result.status}`
      )
      
      assert.ok(receivedBody.token)

      _globalToken = receivedBody.token
    })
  })

  describe('/', () => {
    it('should not be allowed to acess private data without a token', async () => {
      const input = {
        headers: {
          authorization: ''
        }
      }

      const result = await fetch(`${BASE_URL}/login`, {
        method: 'GET',
        headers: input.headers
      })

      const receivedBody = await result.json()
      const receivedStatus = result.status

      const expectedStatus = 400
      const expectedBody = { error: 'invalid token!' }

      assert.strictEqual(
        receivedStatus, 
        expectedStatus, 
        `status code should be 200, but received: ${result.status}`
      )

      assert.deepStrictEqual(
        receivedBody,
        expectedBody,
        `response body should be ${JSON.stringify(expectedBody)}, but received: ${JSON.stringify(receivedBody)}`
      )
    })

    it('should be allowed to acess private data with valid token', async () => {
      const input = {
        headers: {
          authorization: _globalToken
        }
      }

      const result = await fetch(`${BASE_URL}/login`, {
        method: 'GET',
        headers: input.headers
      })

      const receivedBody = await result.json()
      const receivedStatus = result.status

      const expectedStatus = 200
      const expectedBody = { result: 'Hey welcome!' }

      assert.strictEqual(
        receivedStatus, 
        expectedStatus, 
        `status code should be 200, but received: ${result.status}`
      )

      assert.deepStrictEqual(
        receivedBody,
        expectedBody,
        `response body should be ${JSON.stringify(expectedBody)}, but received: ${JSON.stringify(receivedBody)}`
      )
    })
  })
})