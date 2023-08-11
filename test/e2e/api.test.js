import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'

import { fetchHelper, getValidToken, makeTestServer } from '../helpers/index.js'
import { app } from '../../src/api.js'

describe('E2E > api', () => {
  let BASE_URL = ''
  let _server = {}

  before(async () => {
    const testServer = await makeTestServer(app)
    BASE_URL = testServer.BASE_URL
    _server = testServer.server
  })

  after((done) => _server.close(done))

  describe('/login', () => {
    it('should receive not authorized when user or password is invalid', async () => {
      const input = {
        user: 'invalid',
        password: 'invalid'
      }

      const { body, status } = await fetchHelper({
        url: `${BASE_URL}/login`,
        method: 'POST',
        body: input,
      })

      const expectedStatus = 401
      const expectedBody = { error: 'user invalid!' }

      assert.strictEqual(
        status, 
        expectedStatus, 
        `status code should be 401, but received: ${status}`
      )

      assert.deepStrictEqual(
        body, 
        expectedBody, 
        `response body should be ${JSON.stringify(expectedBody)}, but received: ${JSON.stringify(body)}`
      )
    })

    it('should succesfully login when given valid user and password', async () => {
      const input = {
        user: 'mauricioromagnollo',
        password: 'valid_password'
      }


      const { body, status } = await fetchHelper({
        url: `${BASE_URL}/login`,
        method: 'POST',
        body: input,
      })

      const expectedStatus = 200

      assert.strictEqual(
        status, 
        expectedStatus, 
        `status code should be 200, but received: ${status}`
      )
      
      assert.ok(body.token)
    })
  })

  describe('/', () => {
    it('should not be allowed to acess private data without a token', async () => {
      const input = {
        headers: {
          authorization: ''
        }
      }

      const { body, status } = await fetchHelper({
        url: `${BASE_URL}/login`,
        headers: input.headers
      })

      const expectedStatus = 400
      const expectedBody = { error: 'invalid token!' }

      assert.strictEqual(
        status, 
        expectedStatus, 
        `status code should be 200, but received: ${status}`
      )

      assert.deepStrictEqual(
        body,
        expectedBody,
        `response body should be ${JSON.stringify(expectedBody)}, but received: ${JSON.stringify(body)}`
      )
    })

    it('should be allowed to acess private data with valid token', async () => {
      const validToken = await getValidToken(`${BASE_URL}/login`, {
        user: 'mauricioromagnollo',
        password: 'valid_password'
      })

      const input = {
        headers: {
          authorization: validToken
        }
      }

      const { body, status } = await fetchHelper({
        url: `${BASE_URL}/login`,
        headers: input.headers
      })

      const expectedStatus = 200
      const expectedBody = { result: 'Hey welcome!' }

      assert.strictEqual(
        status, 
        expectedStatus, 
        `status code should be 200, but received: ${status}`
      )

      assert.deepStrictEqual(
        body,
        expectedBody,
        `response body should be ${JSON.stringify(expectedBody)}, but received: ${JSON.stringify(body)}`
      )
    })
  })
})