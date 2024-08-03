import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import message from './routes/message'
import user from './routes/users';
import { jwt } from 'hono/jwt';

const app = new Hono()

app.use(
  '/auth/*',
  jwt({
    secret: process.env.JWT_SECRET as string,
  })
)

app.route("/auth/message", message);
app.route("user", user);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = 4000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
