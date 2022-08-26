
export const is = (instance, schema) => {
  if (instance === schema.is) {
    return
  }
  return `should be equal to ${schema.is}, but got ${instance}`
}

export const oneOf = (instance, schema) => {
  if (!Array.isArray(schema.oneOf)) {
    console.error('jsonschema attribute oneOf expect an array!', schema)
    return
  } else {
    if (schema.oneOf.includes(instance)) return
    return `should be one of ${schema.oneOf}, but got ${instance}`
  }
}