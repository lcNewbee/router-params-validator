import { ruleConfig, extendRules } from './rules'
import * as jsonschema from "jsonschema"
import * as formats from './custom-format'
import * as attributes from './custom-attribute'

interface Query {
  [k: string]: string
}

interface ValidateErrorRes {
  query: Query;
  from: string;
  to: string;
  message: string[]
}

type ValidateRes = ValidateErrorRes | null

type CustomFormats = { [k in keyof typeof formats]: string }

const Validator = jsonschema.Validator;
var v = new Validator();

// 注册规则函数
function addCustomFormats(formatName: string, formatFun: (...args: any[]) => boolean): void {
  v.customFormats[formatName] = formatFun.bind(Validator.prototype.customFormats)
}

function addCustomAttribute(name: string, attributeFun) {
  v.attributes[name] = attributeFun
}

function validate(from: string, to: string, query): ValidateRes {
  const msg = { from, to, query }
  try {
    const rules = ruleConfig[to]
    if (!rules) {
      return {
        ...msg,
        message: [`没有找到${to}页面的路由参数校验规则`]
      }
    }
  
    if (!rules[from]) {
      return {
        ...msg,
        message: [`${to}页面没有对来自${from}的跳转做参数校验`]
      }
    }
  
    const schema = rules[from]
    const res = v.validate(query, schema)
    if (!res.valid) {
      const message = res.errors.map(it => it.stack)
  
      return { ...msg, message }
    }
    return null
  } catch (e) {
    return {
      ...msg,
      message: [`路由参数校验库内部错误: ${e}`]
    }
  }
}

export function createValidator(rules) {
  // 注册新自定义规则(CustomFormats)
  Object.keys(formats).forEach(name => addCustomFormats(name, formats[name]))
  // 注册自定义属性
  Object.keys(attributes).forEach(name => addCustomAttribute(name, attributes[name]))

  extendRules(rules)

  return {
    validate,
    extendRules,
    addCustomFormats,
    addCustomAttribute
  }
}

export const customFormats: CustomFormats = Object.keys(formats).reduce((pre, cur) => ({...pre, [cur]: cur}), {}) as CustomFormats
export * from './tools'