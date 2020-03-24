import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import redis from 'redis'
import mongoose from 'mongoose'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import {
  APP_PORT,
  IN_PROD,
  CONNECTION_STRING,
  SESSION_NAME, SESSION_SECRET, SESSION_LIFETIME,
  REDIS_HOST, REDIS_PASSWORD, REDIS_PORT
} from './config'

(async () => {
  try {
    await mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })

    console.log(REDIS_HOST)
    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient({
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
      port: REDIS_PORT
    })
    redisClient.unref()
    redisClient.on('error', console.error)
    const store = new RedisStore({
      client: redisClient
    })

    const app = express()
    app.disable('x-powered-by')
    app.use(session({
      store,
      name: SESSION_NAME,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: SESSION_LIFETIME,
        sameSite: true,
        secure: IN_PROD
      }
    }))

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cors: false,
      playground: IN_PROD ? false : {
        settings: {
          'request.credentials': 'include'
        }
      },
      context: ({ req, res }) => ({ req, res })
    })

    server.applyMiddleware({ app })

    app.listen({ port: APP_PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`
      )
    )
  } catch (error) {
    console.error(error)
  }
})()
