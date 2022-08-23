# router-params-validator

一个用来校验页面之间相互跳转所携带参数的库。目的是规范页面跳转的参数传递，同时方便快速查找到页面的所有入口情况。

## 安装

`npm i router-params-validator`

or

`yarn add router-params-validator`

## 用法

### 如何定义校验规则

假设将要从当前页面`from/page/url`跳转到`to/page/url`，携带的参数为`p1=1`和`p2=str`，即完整的跳转路由为`to/page/url?p1=1&p2=str`

那么，校验规则的形式为：

```js
// rules.js
const schema1 = {
  type: "object",
  properties: {
    p1: { type: "string" },
    p2: { type: "string" }
  },
  required: ["p1", "p2"],
}

export const rules = {
  'to/page/url': {
    'from/page/url': schema1
  }
}
```

其中，`schema1`的格式遵循[`jsonschema`](https://www.npmjs.com/package/jsonschema)规定的schema格式。

假设`other/from/page/url`也能跳转到`to/page/url`，并且携带参数`a=1`和`b=true`，那么`to/page/url`的校验规则如下：

```js
// rules.js
const schema1 = {
  type: "object",
  properties: {
    p1: { type: "string" },
    p2: { type: "string" }
  },
  required: ["p1", "p2"],
}

const schema2 = {
  type: "object",
  properties: {
    a: { type: "string" },
    b: { type: "string" }
  },
  required: ["a", "b"],
}

export default {
  'to/page/url': {
    'from/page/url': schema1,
    'other/from/page/url': schema2
  },
  // ...
}
```

更细节的Schema定义方式，请参考`jsonschema`文档

定义好的规则将用于创建校验库实例。

### 创建校验库实例

```js
// index.js
import { createValidator } from 'router-params-validator'
import ruleConfig from './rules'

export default createValidator(ruleConfig)
```

如上代码，利用前面创建好的校验规则，初始化并导出了校验实例。

接下来看看要如何使用该实例。

### 如何校验路由参数

```js
import validator from './index'

const from = 'from/page/url'
const to = 'to/page/url'
const query = {
  p1: '1',
  p2: 'string'
}

validator.validate(from, to, query)
```

校验实例`validator`提供了validate函数，分别传入当前路由，目标路由，以及路由参数，注意from和to都不带参数，需要和规则里定义的路由格式保持一致。

通常以上逻辑在在各个框架提供的路由拦截器逻辑中实现。

如果路由校验通过，则该函数返回null，否则返回错误信息的格式如下：

```js
{
  from: 'from/page/url' // string类型，上一级路由
  to: 'to/page/url' // string，目标路由
  query: { p1: '1', p2: 'str' } // object，路由参数对象
  message: ['error msg 1', 'error msg 2'] // string[]，字符串数组，数组每项表示一个错误信息
}
```

### 扩展校验规则

通常来讲，校验规则可以在一个地方定义，然后全部传递给`createValidator`函数，也就是说，在初始化的时候就获取整个项目的路由校验规则。

但是，有的项目可能有模块化的需求，如果当前模块没有被加载，那么该模块的规则也就没有必要一开始就传入，所以校验实例也提供了扩展规则的接口：

```js
const extraRules = {
  'to/page/url': {
    'from/page/url': schema1,
    'other/from/page/url': schema2
  }
}

validator.extendRules(extraRules)
```

扩展的规则和初始化时传入的规则会做简单的合并，所以，如果一个页面的入口规则最好写在一起，否则扩展规则会覆盖之前的规则。

### 自定义校验规则函数

路由参数一般都是字符串类型的（即使是数字，解析出来也是字符串形式），所以上面示例中展示的校验规则其实意义并不大，比如：

```js
const schema1 = {
  type: "object",
  properties: {
    p1: { type: "string" },
    p2: { type: "string" }
  },
  required: ["p1", "p2"],
}
```

这个规则可以校验p1和p2是否存在，但是如果参数有更加细节的要求，当前的校验规则就无能为力了

好在`jsonschema`有提供接口扩展自定义的校验规则([详情](https://github.com/tdegrunt/jsonschema#formats))

该库了提供了供开发者自定义校验规则的接口：

```js
// 第一个参数为规则名称，第二个是校验函数
validator.addCustomFormats('numStr', (str: string): boolean => /^\d+$/.test(str))

const schema1 = {
  type: "object",
  properties: {
    // p1参数校验使用了numStr规则
    p1: { type: "string",  format: 'numStr' },
    p2: { type: "string" }
  },
  required: ["p1", "p2"],
}
```

当用以上规则校验参数时，不仅仅要求p1是字符串，而且必须是数字字符串，否则不通过。

当前库内置的自定义规则：

|规则字符串|释义|
|:----:|:----:|
|numStr|数字字符串，比如id值|
|boolStr|true/false/True/False字符串|

