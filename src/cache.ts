import Hoek from '@hapi/hoek'
import config from './config.js'
import { createClient, RedisClientOptions } from 'redis'

const cacheConfig = config.get('cache')

let client: ReturnType<typeof createClient>

const cacheOptions: RedisClientOptions = {
  socket: cacheConfig.socket,
  password: cacheConfig.password,
}

async function start (): Promise<void> {
  client = await createClient(cacheOptions)
    .on('error', (err: Error) => console.log(`Redis error: ${err}`))
    .on('reconnecting', () => console.log('Redis reconnecting...'))
    .on('ready', () => console.log('Redis connected'))
    .connect()
}

async function stop (): Promise<void> {
  if (client.isOpen) {
    await client.quit()
  }
}

async function get (cache: string, key: string): Promise<Object> {
  const fullKey = getFullKey(cache, key)
  const value = await client.get(fullKey)
  return value ? JSON.parse(value) : {}
}

async function set (cache: string, key: string, value: any): Promise<void> {
  const fullKey = getFullKey(cache, key)
  const serializedValue = JSON.stringify(value)
  await client.set(fullKey, serializedValue, { EX: cacheConfig.ttl })
}

async function update (cache: string, key: string, cacheData: any): Promise<void> {
  const existing = await get(cache, key)
  Hoek.merge(existing, cacheData, { mergeArrays: true })
  await set(cache, key, existing)
}

function getFullKey (cache: string, key: string): string {
  const prefix = getKeyPrefix(cache)
  return `${prefix}:${key}`
}

function getKeyPrefix (cache: string): string {
  return `${cacheConfig.partition}:${cache}`
}

export {
  start,
  stop,
  set,
  update,
}
