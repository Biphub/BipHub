import R from 'ramda'
import graphqlHTTP from 'express-graphql'
import fluture from 'fluture'
import express from 'express'
import compression from 'compression'
import appRoot from 'app-root-path'
import session from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import errorHandler from 'errorhandler'
import lusca from 'lusca'
import flash from 'express-flash'
import path from 'path'
import { exec } from 'child_process'
import {logger} from './logger'
import * as passportConfig from './config/passport.config'
import {installPods} from './DAO/pod.dao'
import {default as config} from './config'
import expressValidator from 'express-validator'
import {models, sequelize} from './models'
import routes from './routes'
import {executeTask} from './workers/pipeline.worker'
import * as Queue from './queue'
import Schema from './graphql/schema'

const Future = fluture.Future

/**
 *
 * @param {e.Application} app
 */
const initializePods = app => Future((rej, res) => {
  installPods(app).fork(
    rej,
    () => res(app)
  )
})

/**
 * Bootstrap express app context with various things
 * Typical REST endpoints
 * Graphql Endpoint
 * @param {e.Application} app
 */
const bootstrapExpress = app => Future((rej, res) => {
  logger.info('START - Express setup')
  const SessionStore = require('express-session-sequelize')(session.Store)
  const sequelizeSessionStore = new SessionStore({db: sequelize})
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: sequelizeSessionStore
  }))
  app.set('port', process.env.PORT || 3000)
  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'pug')
  app.use(compression())
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(expressValidator())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())
  app.use(lusca.xframe('SAMEORIGIN'))
  app.use(lusca.xssProtection(true))
  app.use((req, res, next) => {
    res.locals.user = req.user
    next()
  })
  app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
      req.session.returnTo = req.path
    } else if (req.user &&
      req.path === '/account') {
      req.session.returnTo = req.path
    }
    next()
  })
  const staticConfig = {
    maxAge: 31557600000
  }
  // Main statics
  app.use(express.static(appRoot.resolve('/core/public'), staticConfig))
  logger.info('main /core/public static is set!')
  app.use(express.static(appRoot.resolve('/pods'), staticConfig))
  logger.info('staging pod /pod/staging')
  // Routes!
  app.use(routes())

  // Graphql
  const root = {
    hello: () => 'Hello from Bipflow!'
  }
  app.use('/graphql', graphqlHTTP({
    schema: Schema,
    rootValue: root,
    pretty: true,
    graphiql: true
  }))

  // Error Handler. Provides full stack - remove for production
  app.use(errorHandler())
  logger.info('END - Express setup')
  res(app)
})

/**
 * Binds queue to the current app context
 * @param {e.Application} app
 */
const setupQueue = app => Future((rej, res) => {
  logger.info('START - Queue setup')
  const q = Queue.createQueue(executeTask)
  console.log('setting up', Queue)
  if (!q) {
    return rej(false)
  }
  // Bind queue to application context
  app.queue = q
  // Binds queue to request as well
  app.use((req, res, next) => {
    req.queue = q
    next()
  })
  logger.info('END - Queue setup')
  res(app)
})

// Move this to actual seeders folder
const seedDb = app => Future((rej, res) => {
  const env = process.env.NODE_ENV
  if (env === 'development' || env === 'test') {
    logger.info('It always run seeding in development')
    exec('sequelize db:seed:all', (err, stdout, stderr) => {
      if (err) {
        logger.error(err)
        rej(err)
      }
      logger.info(stdout)
      logger.info(stderr)
      res(app)
    })
  } else {
    console.info('skipping migration because you are in production mode')
    res(app)
  }
})

/**
 * Connect to db using Sequelize.
 * @param {e.Application} app
 */
const connectDb = app => Future((rej, res) => {
  // 3. Set up sequelize
  const env = process.env.NODE_ENV
  const syncOptions = {
    force: env !== 'production'
  }
  sequelize.sync(syncOptions)
    .then(migrator => {
      return res(app)
    })
    .catch(e => {
      console.error(e)
      return rej(e)
    })
})

// Initiating app so it's available throughout the ramda compose
const initiateExpress = () => Future((rej, res) => {
  const app = express()
  if (!R.isEmpty(app)) {
    logger.info('Initiated app in start!')
    res(app)
  }
})

/**
 * Starts the server
 * Required environment variables
 * Critical:
 * NODE_ENV: development | production | test
 */
export const start =
  R.compose(
    R.chain(initializePods),
    R.chain(bootstrapExpress),
    R.chain(setupQueue),
    R.chain(seedDb),
    R.chain(connectDb),
    R.chain(initiateExpress),
    () => {
      return Future((rej, res) => {
        // 1. Set up config from dotenv
        config.setup()
        logger.info('Main config setup!')
        // 2. Set up passport
        // TODO: Fix this
        passportConfig.setupPassport()
        logger.info('Passport setup!')
        res(null)
      })
    }
  )
