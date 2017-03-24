'use strict';

var isArray = function isArray(input) {
  return input instanceof Array;
};

var isObject = function isObject(input) {
  return input instanceof Object && !isArray(input);
};

var isDefined = function isDefined(input) {
  return input !== null && typeof input !== 'undefined';
};

var isFunction = function isFunction(input) {
  return !!(input && input.constructor && input.call && input.apply);
};

var capitalize = function capitalize(input) {
  return input.length && typeof input === 'string' ? input.charAt(0).toUpperCase() + input.slice(1).toLowerCase() : input;
};

var noop = function noop() {};

var UNKNOWN_TYPE = 'unknown';
var OBJECT_TYPE = 'object';
var ARRAY_TYPE = 'array';
var ONE_OF_TYPE = 'oneOf';
var ANY_OF_TYPE = 'anyOf';
var ALL_OF_TYPE = 'allOf';
var ENUM_TYPE = 'enum';
var BOOLEAN_TYPE = 'boolean';
var NUMBER_TYPE = 'number';
var STRING_TYPE = 'string';
var NULL_TYPE = 'null';
var REF_TYPE = 'ref';

var schemaType = function schemaType(schema) {
  if (!isDefined(schema)) {
    return UNKNOWN_TYPE;
  }

  if (schema.$ref) {
    return REF_TYPE;
  }

  if (!schema.allOf && !schema.anyOf && !schema.oneOf) {
    if (schema.type === 'object' || isObject(schema.properties) && !schema.type) {
      return OBJECT_TYPE;
    } else if (schema.type === 'array' || isObject(schema.items) && !schema.type) {
      return ARRAY_TYPE;
    }
  }

  if (isArray(schema.oneOf)) {
    return ONE_OF_TYPE;
  } else if (isArray(schema.anyOf)) {
    return ANY_OF_TYPE;
  } else if (isArray(schema.allOf)) {
    return ALL_OF_TYPE;
  } else if (isArray(schema.enum)) {
    return ENUM_TYPE;
  }

  switch (schema.type) {
    case 'boolean':
      return BOOLEAN_TYPE;
    case 'number':
      return NUMBER_TYPE;
    case 'integer':
      return NUMBER_TYPE;
    case 'string':
      return STRING_TYPE;
    case 'null':
      return NULL_TYPE;
    default:
      break;
  }

  return UNKNOWN_TYPE;
};

var createVisitor = function createVisitor() {
  var visitor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultVisit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  return function (schema) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var type = schemaType(schema);
    var visitMethod = visitor['visit' + capitalize(type) + 'Type'];
    var method = visitMethod && isFunction(visitMethod) ? visitMethod : defaultVisit;
    return method.apply(visitor, [schema].concat(args));
  };
};

module.exports = createVisitor;
