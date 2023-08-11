import { fetchHelper } from './fetch-helper.js'

export async function getValidToken(url, validUser) {
  const { body } = await fetchHelper({
    url,
    method: 'POST',
    body: validUser,
  })

  return body.token
}