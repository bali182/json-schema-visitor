import createVisitor from '../src/index'
import { capitalize } from '../src/utils'
import {
  ALL_OF_TYPE, ANY_OF_TYPE, UNKNOWN_TYPE, ARRAY_TYPE, BOOLEAN_TYPE, ENUM_TYPE,
  NULL_TYPE, NUMBER_TYPE, OBJECT_TYPE, ONE_OF_TYPE, STRING_TYPE, REF_TYPE
} from '../src/types'

const unknownSchema = {}
const booleanSchema = { type: 'boolean' }
const nullSchema = { type: 'null' }
const numberSchema = { type: 'number' }
const stringSchema = { type: 'string' }
const objectSchema = { type: 'object' }
const enumSchema = { enum: ['a', 'b', 'c'] }
const arraySchema = { type: 'array' }
const refSchema = { $ref: '#foo' }
const allOfSchema = { allOf: [objectSchema] }
const anyOfSchema = { anyOf: [objectSchema, arraySchema, stringSchema] }
const oneOfSchema = { oneOf: [objectSchema, arraySchema, stringSchema] }

const types = [
  ALL_OF_TYPE, ANY_OF_TYPE, UNKNOWN_TYPE, ARRAY_TYPE, BOOLEAN_TYPE, ENUM_TYPE,
  NULL_TYPE, NUMBER_TYPE, OBJECT_TYPE, ONE_OF_TYPE, STRING_TYPE, REF_TYPE
]

const createCompleteVisitor = visitCreator => createVisitor(
  types.reduce((visitor, type) => {
    visitor[`visit${capitalize(type)}Type`] = visitCreator(type)
    return visitor
  }, {})
)

describe('visitor', () => {
  it('should return the type of schemas', () => {
    const typeVisitor = createCompleteVisitor(type => () => type)

    expect(typeVisitor(unknownSchema)).toBe(UNKNOWN_TYPE)
    expect(typeVisitor(booleanSchema)).toBe(BOOLEAN_TYPE)
    expect(typeVisitor(nullSchema)).toBe(NULL_TYPE)
    expect(typeVisitor(numberSchema)).toBe(NUMBER_TYPE)
    expect(typeVisitor(stringSchema)).toBe(STRING_TYPE)
    expect(typeVisitor(objectSchema)).toBe(OBJECT_TYPE)
    expect(typeVisitor(enumSchema)).toBe(ENUM_TYPE)
    expect(typeVisitor(arraySchema)).toBe(ARRAY_TYPE)
    expect(typeVisitor(refSchema)).toBe(REF_TYPE)
    expect(typeVisitor(allOfSchema)).toBe(ALL_OF_TYPE)
    expect(typeVisitor(anyOfSchema)).toBe(ANY_OF_TYPE)
    expect(typeVisitor(oneOfSchema)).toBe(ONE_OF_TYPE)
  })

  it('should return the schema itself', () => {
    const schemaVisitor = createCompleteVisitor(() => schema => schema)

    expect(schemaVisitor(unknownSchema)).toBe(unknownSchema)
    expect(schemaVisitor(booleanSchema)).toBe(booleanSchema)
    expect(schemaVisitor(nullSchema)).toBe(nullSchema)
    expect(schemaVisitor(numberSchema)).toBe(numberSchema)
    expect(schemaVisitor(stringSchema)).toBe(stringSchema)
    expect(schemaVisitor(objectSchema)).toBe(objectSchema)
    expect(schemaVisitor(enumSchema)).toBe(enumSchema)
    expect(schemaVisitor(arraySchema)).toBe(arraySchema)
    expect(schemaVisitor(refSchema)).toBe(refSchema)
    expect(schemaVisitor(allOfSchema)).toBe(allOfSchema)
    expect(schemaVisitor(anyOfSchema)).toBe(anyOfSchema)
    expect(schemaVisitor(oneOfSchema)).toBe(oneOfSchema)
  })

  it('should return the arguments', () => {
    const argsAsArray = ['foo', 1, {}]
    const argsVisitor = createCompleteVisitor(() => (_, ...args) => args)

    expect(argsVisitor(unknownSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(booleanSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(nullSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(numberSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(stringSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(objectSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(enumSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(arraySchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(refSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(allOfSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(anyOfSchema, 'foo', 1, {})).toEqual(argsAsArray)
    expect(argsVisitor(oneOfSchema, 'foo', 1, {})).toEqual(argsAsArray)
  })

  it('should properly work if not all visitor methods are given', () => {
    const gappyVisitor = createVisitor({
      visitStringType() {
        return STRING_TYPE
      },
      visitObjectType() {
        return OBJECT_TYPE
      }
    })

    expect(gappyVisitor(stringSchema)).toBe(STRING_TYPE)
    expect(gappyVisitor(objectSchema)).toBe(OBJECT_TYPE)

    expect(gappyVisitor(unknownSchema)).toBeUndefined()
    expect(gappyVisitor(booleanSchema)).toBeUndefined()
    expect(gappyVisitor(nullSchema)).toBeUndefined()
    expect(gappyVisitor(numberSchema)).toBeUndefined()
    expect(gappyVisitor(enumSchema)).toBeUndefined()
    expect(gappyVisitor(arraySchema)).toBeUndefined()
    expect(gappyVisitor(refSchema)).toBeUndefined()
    expect(gappyVisitor(allOfSchema)).toBeUndefined()
    expect(gappyVisitor(anyOfSchema)).toBeUndefined()
    expect(gappyVisitor(oneOfSchema)).toBeUndefined()
  })

  it('should use defaultVisit when not all visit methods given', () => {
    const gappyVisitor = createVisitor({
      visitStringType() {
        return STRING_TYPE
      },
      visitObjectType() {
        return OBJECT_TYPE
      }
    }, () => 'foo')

    expect(gappyVisitor(stringSchema)).toBe(STRING_TYPE)
    expect(gappyVisitor(objectSchema)).toBe(OBJECT_TYPE)

    expect(gappyVisitor(unknownSchema)).toBe('foo')
    expect(gappyVisitor(booleanSchema)).toBe('foo')
    expect(gappyVisitor(nullSchema)).toBe('foo')
    expect(gappyVisitor(numberSchema)).toBe('foo')
    expect(gappyVisitor(enumSchema)).toBe('foo')
    expect(gappyVisitor(arraySchema)).toBe('foo')
    expect(gappyVisitor(refSchema)).toBe('foo')
    expect(gappyVisitor(allOfSchema)).toBe('foo')
    expect(gappyVisitor(anyOfSchema)).toBe('foo')
    expect(gappyVisitor(oneOfSchema)).toBe('foo')
  })

  it('should inject the correct this context', () => {
    const visitorUsingThis = createVisitor({
      foo: 'bar',
      visitStringType() {
        return this.foo
      }
    })

    expect(visitorUsingThis(stringSchema)).toBe('bar')
  })
})
