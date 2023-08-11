export async function fetchHelper({
  url,
  method = 'GET',
  headers = {},
  body,
}) {
  const fetchArgs = method === 'GET' || method === 'DELETE'
    ? {
      method,
      headers,
    } : { 
      method,
      headers,
      body: JSON.stringify(body) 
    }

  const response = await globalThis.fetch(url, fetchArgs)
  const data = await response.json()

  return {
    status: response.status,
    body: data,
  }
}