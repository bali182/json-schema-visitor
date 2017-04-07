export const isArray = input => input instanceof Array

export const isObject = input => input instanceof Object && !isArray(input)

export const isDefined = input => input !== null && typeof input !== 'undefined'

export const noop = () => { /* noop */ }
