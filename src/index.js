import { schemaType } from './types'
import { capitalize, noop, isFunction } from './utils'

const createVisitor = (visitor = {}, defaultVisit = noop) => (schema, ...args) => {
  const type = schemaType(schema)
  const visitMethod = visitor[`visit${capitalize(type)}Type`]
  const method = visitMethod && isFunction(visitMethod) ? visitMethod : defaultVisit
  return method.apply(visitor, [schema, ...args])
}

export default createVisitor
