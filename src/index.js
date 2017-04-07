import { schemaType } from './types'
import { noop } from './utils'

const createVisitor = (visitor = {}) => 
  (schema, ...args) => 
  (visitor[schemaType(schema)] || visitor.any || noop).call(visitor, schema, ...args)

export default createVisitor
