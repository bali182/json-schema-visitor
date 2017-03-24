import { isArray, isObject, isDefined } from './utils'

export const UNKNOWN_TYPE = 'unknown'
export const OBJECT_TYPE = 'object'
export const ARRAY_TYPE = 'array'
export const ONE_OF_TYPE = 'oneOf'
export const ANY_OF_TYPE = 'anyOf'
export const ALL_OF_TYPE = 'allOf'
export const ENUM_TYPE = 'enum'
export const BOOLEAN_TYPE = 'boolean'
export const NUMBER_TYPE = 'number'
export const STRING_TYPE = 'string'
export const NULL_TYPE = 'null'
export const REF_TYPE = 'ref'

export const schemaType = schema => {
  if (!isDefined(schema)) {
    return UNKNOWN_TYPE
  }

  if (schema.$ref) {
    return REF_TYPE
  }

  if (!schema.allOf && !schema.anyOf && !schema.oneOf) {
    if (schema.type === 'object' || isObject(schema.properties) && !schema.type) {
      return OBJECT_TYPE
    } else if (schema.type === 'array' || isObject(schema.items) && !schema.type) {
      return ARRAY_TYPE
    }
  }

  if (isArray(schema.oneOf)) {
    return ONE_OF_TYPE
  } else if (isArray(schema.anyOf)) {
    return ANY_OF_TYPE
  } else if (isArray(schema.allOf)) {
    return ALL_OF_TYPE
  } else if (isArray(schema.enum)) {
    return ENUM_TYPE
  }

  switch (schema.type) {
    case 'boolean': return BOOLEAN_TYPE
    case 'number': return NUMBER_TYPE
    case 'integer': return NUMBER_TYPE
    case 'string': return STRING_TYPE
    case 'null': return NULL_TYPE
    default: break
  }

  return UNKNOWN_TYPE
}
