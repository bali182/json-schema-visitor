import {
  schemaType, ALL_OF_TYPE, ANY_OF_TYPE, UNKNOWN_TYPE, ARRAY_TYPE, BOOLEAN_TYPE,
  ENUM_TYPE, NULL_TYPE, NUMBER_TYPE, OBJECT_TYPE, ONE_OF_TYPE, STRING_TYPE, REF_TYPE
} from '../src/types'

const junk = { foo: 'bar', bar: 'foo', [Symbol()]: 'foobar', 1: 2 }

describe('types', () => {
  it('should classify as UNKNOWN_TYPE', () => {
    expect(schemaType(undefined)).toBe(UNKNOWN_TYPE)
    expect(schemaType(null)).toBe(UNKNOWN_TYPE)
    expect(schemaType({})).toBe(UNKNOWN_TYPE)
    expect(schemaType({ foo: 1, bar: 2 })).toBe(UNKNOWN_TYPE)
    expect(schemaType({ type: 'non-existing-type' })).toBe(UNKNOWN_TYPE)
    expect(schemaType({ type: 'other-non-existing-type', ...junk })).toBe(UNKNOWN_TYPE)
  })

  it('should classify as STRING_TYPE', () => {
    expect(schemaType({ type: 'string' })).toBe(STRING_TYPE)
    expect(schemaType({ type: 'string', ...junk })).toBe(STRING_TYPE)
  })

  it('should classify as NUMBER_TYPE', () => {
    expect(schemaType({ type: 'number' })).toBe(NUMBER_TYPE)
    expect(schemaType({ type: 'number', ...junk })).toBe(NUMBER_TYPE)
    expect(schemaType({ type: 'integer' })).toBe(NUMBER_TYPE)
    expect(schemaType({ type: 'integer', ...junk })).toBe(NUMBER_TYPE)
  })

  it('should classify as BOOLEAN_TYPE', () => {
    expect(schemaType({ type: 'boolean' })).toBe(BOOLEAN_TYPE)
    expect(schemaType({ type: 'boolean', ...junk })).toBe(BOOLEAN_TYPE)
  })

  it('should classify as NULL_TYPE', () => {
    expect(schemaType({ type: 'null' })).toBe(NULL_TYPE)
    expect(schemaType({ type: 'null', ...junk })).toBe(NULL_TYPE)
  })

  it('should classify as REF_TYPE', () => {
    expect(schemaType({ $ref: '#foo' })).toBe(REF_TYPE)
    expect(schemaType({ $ref: '#bar', type: 'string' })).toBe(REF_TYPE)
    expect(schemaType({ $ref: '#bar', ...junk })).toBe(REF_TYPE)
  })

  it('should classify as ENUM_TYPE', () => {
    expect(schemaType({ enum: ['a', 'b', 'c'] })).toBe(ENUM_TYPE)
    expect(schemaType({ enum: ['a', 'b', 'c'], ...junk })).toBe(ENUM_TYPE)
  })

  it('should classify as ARRAY_TYPE', () => {
    expect(schemaType({ type: 'array' })).toBe(ARRAY_TYPE)
    expect(schemaType({ type: 'array', ...junk })).toBe(ARRAY_TYPE)
    expect(schemaType({ type: 'array', items: {} })).toBe(ARRAY_TYPE)
    expect(schemaType({ type: 'array', items: {}, ...junk })).toBe(ARRAY_TYPE)
    expect(schemaType({ items: {} })).toBe(ARRAY_TYPE)
    expect(schemaType({ items: {}, ...junk })).toBe(ARRAY_TYPE)
  })

  it('should classify as OBJECT_TYPE', () => {
    expect(schemaType({ type: 'object' })).toBe(OBJECT_TYPE)
    expect(schemaType({ type: 'object', ...junk })).toBe(OBJECT_TYPE)
    expect(schemaType({ type: 'object', properties: {} })).toBe(OBJECT_TYPE)
    expect(schemaType({ type: 'object', properties: {}, ...junk })).toBe(OBJECT_TYPE)
    expect(schemaType({ properties: {} })).toBe(OBJECT_TYPE)
    expect(schemaType({ properties: {}, ...junk })).toBe(OBJECT_TYPE)
  })

  it('should classify as ANY_OF_TYPE', () => {
    expect(schemaType({ anyOf: [] })).toBe(ANY_OF_TYPE)
    expect(schemaType({ anyOf: [], ...junk })).toBe(ANY_OF_TYPE)
    expect(schemaType({ anyOf: [], type: 'object' })).toBe(ANY_OF_TYPE)
    expect(schemaType({ anyOf: [], type: 'object', ...junk })).toBe(ANY_OF_TYPE)
  })

  it('should classify as ONE_OF_TYPE', () => {
    expect(schemaType({ oneOf: [] })).toBe(ONE_OF_TYPE)
    expect(schemaType({ oneOf: [], ...junk })).toBe(ONE_OF_TYPE)
    expect(schemaType({ oneOf: [], type: 'object' })).toBe(ONE_OF_TYPE)
    expect(schemaType({ oneOf: [], type: 'object', ...junk })).toBe(ONE_OF_TYPE)
  })

  it('should classify as ALL_OF_TYPE', () => {
    expect(schemaType({ allOf: [] })).toBe(ALL_OF_TYPE)
    expect(schemaType({ allOf: [], ...junk })).toBe(ALL_OF_TYPE)
    expect(schemaType({ allOf: [], type: 'object' })).toBe(ALL_OF_TYPE)
    expect(schemaType({ allOf: [], type: 'object', ...junk })).toBe(ALL_OF_TYPE)
  })
})
