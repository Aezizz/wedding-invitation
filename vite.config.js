import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.XENDIT_SECRET_KEY) {
    process.env.XENDIT_SECRET_KEY = env.XENDIT_SECRET_KEY
  }

  return {
    plugins: [
      react(),
      {
        name: 'vite-plugin-xendit-dev-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/create-xendit-invoice') && req.method === 'POST') {
              try {
                let rawBody = ''
                req.on('data', (chunk) => {
                  rawBody += chunk
                })
                req.on('end', async () => {
                  try {
                    req.body = rawBody ? JSON.parse(rawBody) : {}
                    const vercelRes = {
                      status(code) {
                        res.statusCode = code
                        return this
                      },
                      json(data) {
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify(data))
                      },
                    }

                    const { default: handler } = await import('./api/create-xendit-invoice.js')
                    await handler(req, vercelRes)
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
