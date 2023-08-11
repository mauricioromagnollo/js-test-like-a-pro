export async function makeTestServer(app) {
  const server = app
  server.listen()

  return new Promise((resolve, reject) => {
    server.once('listening', () => {
      const { port } = server.address()
      const BASE_URL = `http://localhost:${port}`
      console.log(`Server listening at ${BASE_URL}`)
      resolve({ server, BASE_URL })
    })
    server.once('error', reject)
  })
}