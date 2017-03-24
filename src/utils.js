export const isArray = input => input instanceof Array

export const isObject = input => input instanceof Object && !isArray(input)

export const isDefined = input => input !== null && typeof input !== 'undefined'

export const isFunction = input => Boolean(input && input.constructor && input.call && input.apply)

export const capitalize = input => input.length && typeof input === 'string'
  ? input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()
  : input

export const noop = () => { /* noop */ }
