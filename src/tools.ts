interface PropShape {
  name: string;
  type?: string;
  required?: boolean;
  is?: string;
  oneOf?: string[];
  format?: string;
  [k: string]: any;
}

export function createSchemaWithProperties(propList: PropShape[]) {
  let propSchema = {}
  const requireSchema = []
  propList.forEach((item) => {
    // eslint-disable-next-line
    const { name, required = false, ...rest } = item
    propSchema = {
      ...propSchema,
      [item.name]: {
        type: "string",
        ...rest
      }
    }
    if (required) {
      requireSchema.push(item.name)
    }
  })

  return {
    type: "object",
    properties: propSchema,
    required: requireSchema
  }
}