interface ISafeParams {
  [key: string]: string
}

const DANGEROUS_KEYS = [
  '__proto__',
  'prototype',
  'constructor',
  'constructor.prototype',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
  'toString',
  'valueOf',
  'watch',
  'unwatch',
]

const isSafeKey = (key: string) => {
  if (key.startsWith('$')) return false
  if (DANGEROUS_KEYS.includes(key)) return false
  return true
}

const sanitizer = (obj: ISafeParams) => {
  for (const key in obj) {
    if (!isSafeKey(key)) delete obj[key]
  }
}

export default sanitizer
