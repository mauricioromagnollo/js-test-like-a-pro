import { EventEmitter } from 'node:events'

export const mockRequest = ({ url, method, headers, body }) => {
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