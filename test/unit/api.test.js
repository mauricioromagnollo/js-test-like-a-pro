import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import { EventEmitter } from 'node:events'

import { handler } from '../../api.js'

const mockRequest = ({ url, method, headers, body }) => {
  const options = {
    url: url ?? '/',
    method: method ?? 'GET',
    headers: headers ?? {},
  }

  const request = new EventEmitter()

  request.url = options.url
  request.method = options.method
  request.headers = options.headers

  setTimeout(() => request.emit('data', JSON.stringify(body)))

  return request
}

const mockResponse = ({ mockContext }) => {
  const response = {
    writeHead: mockContext.fn(),
    end: mockContext.fn(),
  }

  return response
}

const getFirstCallArg = (mock) => mock.calls[0].arguments[0]

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
        getFirstCallArg(mockResponseOutput.writeHead.mock),
        401,
        'should return 401 when user or password is invalid'
      )

      assert.strictEqual(mockResponseOutput.end.mock.calls.length, 1)

      assert.strictEqual(
        getFirstCallArg(mockResponseOutput.end.mock),
        expectedResponse,
        'should return error message when user or password is invalid'
      )
    })
  })
})