import { describe, it } from 'node:test'
import assert from 'node:assert'

import { mockRequest, mockResponse, getFirstCallArg } from '../helpers/index.js'
import { handler } from '../../src/api.js'

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
  })
})