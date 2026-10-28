import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: 'vite-plugin-dev-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/')) {
              try {
                const urlPath = req.url.split('?')[0].replace('/api/', '')
                const filePath = `./api/${urlPath}.js`

                let rawBody = ''
                req.on('data', (chunk) => {
                  rawBody += chunk
                })

                req.on('end', async () => {
                  try {
                    req.body = rawBody ? JSON.parse(rawBody) : {}
                  } catch {
                    req.body = {}
                  }

                  const vercelRes = {
                    status(code) {
                      res.statusCode = code
                      return this
                    },
                    json(data) {
                      res.setHeader('Content-Type', 'application/json')
                      res.end(JSON.stringify(data))
                    },
                    send(data) {
                      res.end(data)
                    },
                  }

                  try {
                    const module = await import(/* @vite-ignore */ `${filePath}?t=${Date.now()}`)
                    const handler = module.default
                    if (typeof handler === 'function') {
                      await handler(req, vercelRes)
                    } else {
                      res.statusCode = 404
                      res.setHeader('Content-Type', 'application/json')
                      res.end(JSON.stringify({ message: 'API handler not found' }))
                    }
                  } catch (err) {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ message: err?.message || 'Server Error' }))
                  }
                })
              } catch (err) {
                next(err)
              }
            } else {
              next()
            }
          })
        },
      },
    ],
  }
})
