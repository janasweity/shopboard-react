import { createServer } from 'node:http'
import { readCatalogue } from './src/catalogue.ts'
import { handleRequest } from './src/handle-request.ts'

const catalogue = readCatalogue()
const port = Number(process.env.PORT) || 4000

createServer((request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname
  const result = handleRequest(request.method || 'GET', pathname, catalogue)
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  if (result.status === 405) response.setHeader('Allow', 'GET')

  function answer(): void {
    response.statusCode = result.status
    response.end(JSON.stringify(result.body))
  }

  if (result.delayMs === 0) {
    answer()
    return
  }
  const timer = setTimeout(answer, result.delayMs)
  // Stop waiting if the client cancels the request.
  response.on('close', () => clearTimeout(timer))
}).listen(port, '127.0.0.1', () => {
  console.log(`RAHA products API on http://127.0.0.1:${port}`)
})
