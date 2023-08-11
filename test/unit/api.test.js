import { describe, it } from 'node:test'
import assert from 'node:assert'

import { mockRequest, mockResponse, getFirstCallArg } from '../helpers/index.js'
import { handler } from '../../src/api.js'

async function getValidToken(context) {
  const mockRequestInput = mockRequest({
    url: '/login',
    method: 'POST',
    body: {
      user: 'mauricioromagnollo',
      password: 'valid_password'
    }
  })

  const mockResponseOutput = mockResponse({ 
    mockContext: context.mock 
  })

  await handler(mockRequestInput, mockResponseOutput)

  return JSON.parse(getFirstCallArg(mockResponseOutput.end)).token
}

describe('UNIT > api', () => {
  describe('/login', () => {
    it('should receive not authorized when user or password is invalid', async (context) => {
      const mockRequestInput = mockRequest({
        url: '/login',
        method: 'POST',
        body: {
          user: '',
          password: 'valid_password'
        }
      })

      const mockResponseOutput = mockResponse({ 
        mockContext: context.mock 
      })

      await handler(mockRequestInput, mockResponseOutput)

      const expectedResponse = JSON.stringify({ error: 'user invalid!' })

      assert.strictEqual(
        getFirstCallArg(mockResponseOutput.writeHead),
        401,
        'should return 401 when user or password is invalid'
      )

      assert.strictEqual(mockResponseOutput.end.mock.calls.length, 1)

      assert.strictEqual(
        getFirstCallArg(mockResponseOutput.end),
        expectedResponse,
        'should return error message when user or password is invalid'
      )
    })

    it('should succesfully login when given valid user and password', async (context) => {
      const mockRequestInput = mockRequest({
        url: '/login',
        method: 'POST',
        body: {
          user: 'mauricioromagnollo',
          password: 'valid_password'
        }
      })

      const mockResponseOutput = mockResponse({ 
        mockContext: context.mock 
      })

      await handler(mockRequestInput, mockResponseOutput)
      
      assert.strictEqual(mockResponseOutput.end.mock.calls.length, 1)
      assert.ok(JSON.parse(getFirstCallArg(mockResponseOutput.end)).token)
    })

    it('should receive not authorized when given invalid token', async (context) => {
      const mockRequestInput = mockRequest({
        url: '/',
        method: 'GET',
      })

      const mockResponseOutput = mockResponse({ 
        mockContext: context.mock 
      })

      await handler(mockRequestInput, mockResponseOutput)

      const expectedResponse = JSON.stringify({ error: 'invalid token!' })

      assert.strictEqual(
        getFirstCallArg(mockResponseOutput.writeHead),
        400,
        'should return 400 when given invalid token'
      )

      assert.strictEqual(mockResponseOutput.end.mock.calls.length, 1)

      assert.strictEqual(
        getFirstCallArg(mockResponseOutput.end),
        expectedResponse,
        'should return error message when given invalid token'
      )
    })

    it('should receive authorized when given a valid token', async (context) => {
      const validToken = await getValidToken(context)
      
      const mockRequestInput = mockRequest({
        url: '/',
        method: 'GET',
        headers: {
          authorization: `Bearer ${validToken}`
        }
      })

      const mockResponseOutput = mockResponse({ 
        mockContext: context.mock 
      })

      await handler(mockRequestInput, mockResponseOutput)

      const expectedResponse = JSON.stringify({ result: 'Hey welcome!' })

      assert.strictEqual(mockResponseOutput.end.mock.calls.length, 1)

      assert.strictEqual(
        getFirstCallArg(mockResponseOutput.end),
        expectedResponse,
        'should return error message when given invalid token'
      )
    })
  })
})