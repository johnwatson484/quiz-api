import Hoek from '@hapi/hoek'
import config from './config.js'
import { createClient } from 'redis'

const cacheConfig = config.get('cache')

let client: any = null

const cacheOptions: any = {
  socket: cacheConfig.socket,
  password: cacheConfig.password,
}

const start = async () => {
  client = createClient(cacheOptions)
  client.on('error', (err: any) => console.log(`Redis error: ${err}`))
  client.on('reconnecting', () => console.log('Redis reconnecting...'))
  client.on('ready', () => console.log('Redis connected'))
  await client.connect()
}

const stop = async () => {
  if (client.isOpen) {
    await client.quit()
  }
}

const get = async (cache: string, key: string) => {
  const fullKey = getFullKey(cache, key)
  const value = await client.get(fullKey)
  return value ? JSON.parse(value) : {}
}

const set = async (cache: string, key: string, value: any) => {
  const fullKey = getFullKey(cache, key)
  const serializedValue = JSON.stringify(value)
  await client.set(fullKey, serializedValue, { EX: cacheConfig.ttl })
}

const update = async (cache: string, key: string, cacheData: any) => {
  const existing = await get(cache, key)
  Hoek.merge(existing, cacheData, { mergeArrays: true })
  await set(cache, key, existing)
}

const getFullKey = (cache: string, key: string) => {
  const prefix = getKeyPrefix(cache)
  return `${prefix}:${key}`
}

const getKeyPrefix = (cache: string) => {
  return `${cacheConfig.partition}:${cache}`
}

export {
  start,
  stop,
  set,
  update,
}
