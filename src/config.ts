import convict from 'convict'
import convictFormatWithValidator from 'convict-format-with-validator'

convict.addFormats(convictFormatWithValidator)

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  isDev: {
    doc: 'True if the application is in development mode.',
    format: Boolean,
    default: process.env.NODE_ENV === 'development',
  },
  host: {
    doc: 'The host to bind.',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'HOST',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port',
  },
  cache: {
    socket: {
      host: {
        doc: 'The cache host.',
        format: String,
        default: '',
        env: 'REDIS_HOST'
      },
      port: {
        doc: 'The cache port.',
        format: 'port',
        default: 6379,
        env: 'REDIS_PORT'
      }
    },
    password: {
      doc: 'The cache password.',
      format: String,
      default: '',
      env: 'REDIS_PASSWORD'
    },
    partition: {
      doc: 'The cache partition prefix.',
      format: String,
      default: 'quiz-api:',
      env: 'REDIS_PARTITION'
    },
    ttl: {
      doc: 'The default cache TTL (in seconds).',
      format: Number,
      default: 172800, // 2 days
      env: 'REDIS_TTL'
    }
  }
})

config.validate({ allowed: 'strict' })

export default config
