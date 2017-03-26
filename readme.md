# json-schema-visitor [![Build Status](https://travis-ci.org/bali182/json-schema-visitor.svg?branch=master)](https://travis-ci.org/bali182/json-schema-visitor)

A package for inspecting JSON schemas. 

## Supported schema types

These directly translate to the method names you need to supply to the configuration object passed to `createVisitor`:

- `object`
- `array`
- `enum`
- `boolean`
- `number`
- `null`
- `string`
- `oneOf`
- `anyOf`
- `allOf`
- `ref`
- `unknown`


## Usage

### Simple example

```js
import createVisitor from 'json-schema-visitor'

const visitor = createVisitor({
  object(schema) {
    return `An object schema: ${JSON.stringify(schema)}`
  }
  array(schema) {
    return `An array schema: ${JSON.stringify(schema)}`
  }
})

// 2 cases handled
expect(visitor({ type: 'object' })).toBe('An object schema: {type:"object"}')
expect(visitor({ type: 'array' })).toBe('An array schema: {type:"array"}')

// All other cases
expect(visitor({ type: 'string' })).toBeUndefined()
expect(visitor(null)).toBeUndefined()
expect(visitor('foo')).toBeUndefined()
```

### Default visit method

```js
const visitor = createVisitor({
  object(schema) {
    return 'An object schema'
  }
}, schema => 'Everything else')

// Case handled
expect(visitor({ type: 'object' })).toBe('An object schema')

// All other cases
expect(visitor({ type: 'string' })).toBe('Everything else')
expect(visitor(null)).toBe('Everything else')
expect(visitor('foo')).toBe('Everything else')
```

### Extra arguments

```js
const visitor = createVisitor({
  object(schema, someArg, otherArg) {
    return `An object schema. Also args: ${someArg} and ${otherArg}`
  }
})

expect(visitor({ type: 'object' }, 'foo', 42)).toBe('An object schema. Also args: foo and 42')
```

### Recursive traversing

```js
const visitor = createVisitor({
  object(schema, callback) {
    callback(schema)
    Object.keys(schema.properties)
      .map(key => schema.properties[key])
      .forEach(childSchema => visitor(childSchema, callback))
  }
  array(schema, callback) {
    callback(schema)
    visitor(schema.items, callback)
  },
  allOf(schema, callback) {
    callback(schema)
    schema.allOf.forEach(childSchema => visitor(childSchema, callback))
  },
  anyOf(schema, callback) {
    callback(schema)
    schema.anyOf.forEach(childSchema => visitor(childSchema, callback))
  },
  oneOf(schema, callback) {
    callback(schema)
    schema.oneOf.forEach(childSchema => visitor(childSchema, callback))
  }
}, (schema, callback) => callback(schema))

visitor(someSchema, schema => console.log(schema))
```