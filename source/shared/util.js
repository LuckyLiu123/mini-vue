/* @flow */

export const emptyObject = Object.freeze({})

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}

export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
}

export function isTrue (v: any): boolean %checks {
  return v === true
}

export function isFalse (v: any): boolean %checks {
  return v === false
}

/**
 * Check if value is primitive.
 */
export function isPrimitive (value: any): boolean %checks {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString

export function toRawType (value: any): string {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}

export function isRegExp (v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
export function isValidArrayIndex (val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

export function isPromise (val: any): boolean {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
export function toString (val: any): string {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * 
 * makeMap 生成一个带有缓存的函数，用于判断 数据是否是缓存中的数据，
 * 例如：判断字符串(标签名)是否为内置的HTML标签
 */
export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

/**
 * Check if a tag is a built-in tag.
 */
export const isBuiltInTag = makeMap('slot,component', true)

/**
 * Check if an attribute is a reserved attribute.
 */
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**
 * Remove an item from an array.
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<*>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 * 面试经常会面到的方法：生成带有缓存的函数(闭包的应用)
 */
export function cached<F: Function> (fn: F): F {
  const cache = Object.create(null)
  return (function cachedFn (str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }: any)
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * Capitalize a string.
 */
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * cached 方法的作用(缓存):
 * 
 * vue是运行在浏览器上面的，所以需要考虑性能。浏览器相当于虚拟机的概念，而vue是js所写的代码，
 * 相当于在虚拟机中执行脚本。而脚本都是需要解释执行的，解释一句执行一句，那么损耗一般来说都是比较大的。
 * 所以网站的性能想要提升的话，就要考虑到性能。
 * 
 * 概念: 每次数据更新的时候都会伴随着虚拟DOM的生成( 背后涉及到模板解析的行为 )，在这种情况下，由于模板本身是一个字符串，
 * 为了提高性能，会将经常使用的字符串和算法进行缓存。
 * 在垃圾回收原则中有一个统计现象: 使用越多的数据，一般都会频繁的使用。( 垃圾回收中的策略 )
 * 
 * 垃圾回收采用的回收方式：
 * 1. 每次创建一个数据，就会考虑是否要将其回收。
 * 2. 内存有个一个标记，当申请的数据达到一定限额的时候，就会考虑将一部分数据进行回收( 回收不是实时的 
 *    (平常说我定义一个对象，然后将对象的变量指向空的时候，对象就会回收掉了。只是说从表象上可以这么理解，
 *     但是程序在运行的时候，它会找一个时机，将其回收掉的) )
 *  在这个回收的时候会有一些策略：
 *  - 如果每次都要判断对象是否需要回收，那么就需要遍历( 如果内存中的变量越多，那么遍历所花的时候也就越长 )，所以在这种情况下将变量进行划分。
 *  - 统计的结果是: 
 *    - 往往一个数据使用完以后就不需要使用了；
 *    - 如果一个对象在一次回收之后还保留下来，那么这个对象会比较持久的在内存中驻留；(就是说会集中一个时机进行回收，不会实时的进行回收，所以在触发
 *    - 回收的时候，在内存中驻留的对象有一部分会被清空掉，有一部分就会保留下来)
 * 
 * 在模板中常常会使用 "指令"，在 vue 中以 xxx-xxx-xxx 的形式出现的属性。
 * 因为每次数据更新的时候，模板都会被解析，所以每次数据更新的时候，都会带来指令的解析。
 * 解析就是字符串处理，一般会消耗一定的性能。
 * 
 * 在 vue 项目中不止一个组件(不止一个模板)，模板很多，那么指令也就会很多，如果需要定制的开发，那么还会定义自己的指令，那么
 * 这些指令都要频繁的进行解析，而且解析的过程中还会涉及到抽象语法树的生成，虚拟dom的生成等等一系列的行为。所以说，当你把这些
 * 事情集中到一起去做的时候，那么它的性能才会有一定的损失，它是积累的过程，不是单一的过程，不是单一运行的。
 * 
 * 这么做的好处：模板一解析完，就把它缓存起来。等到第二次在对 指令 进行解析的时候，就不用去解析了，直接从缓存
 * 里面拿就可以了，这样就可以提高一定的性能。这是 vue 进行优化的一个手段。
*/

/**
 * 性能损耗一般考虑的是运行时的性能，运行的时候抽象语法树一但生成，只要模板不发生变化，那么这个抽象语法树可以
 * 不用去生成的，因为这里用到了带有缓存的函数。所以说生成抽象语法树的过程中消耗的性能就相当于不存在了。但是运行
 * Vue 项目的整个过程中需要做的事情是对数据进行更新；在把抽象语法树和数据进行合并生成虚拟dom的过程中，也会涉及到
 * 解析的行为。
 * 
 * v-if v-for 都有可能会导致模板的变化，会对利用抽象语法树生成虚拟dom的变化比较大
 * 在描述一个节点存在 v-if 的时候，实际上 v-if 是一个属性的形式存在，有可能会展示到页面上，也有可能不展示到页面上，
 * v-for 在展示抽象语法树的时候也是以属性的形式展示的
 * 在v-for中会添加 key ，是为了将模板进行复用(对dom节点进行复用)
 * 
 * 在转换成抽象语法树的时候，v-if 会被转换成节点一个属性。
 * 在生成抽象语法树之后，只要模板不变，抽象语法树基本上不会变。
 * 在抽象语法树和数据进行结合之后生成的数据是会发生变化的。
 * 
 * 计算属性会被缓存，另一方面减少语法解析的过程
*/








/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}

function nativeBind (fn: Function, ctx: Object): Function {
  return fn.bind(ctx)
}

export const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind

/**
 * Convert an Array-like object to a real Array.
 */
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * Mix properties into target object.
 */
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
export function toObject (arr: Array<any>): Object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
export function noop (a?: any, b?: any, c?: any) {}

/**
 * Always return false.
 */
export const no = (a?: any, b?: any, c?: any) => false

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
export const identity = (_: any) => _

/**
 * Generate a string containing static keys from compiler modules.
 */
export function genStaticKeys (modules: Array<ModuleOptions>): string {
  return modules.reduce((keys, m) => {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 * 
 * 判断两个对象是否相等
 * 1. js 中对象无法使用 == 来比较的，比较的是地址
 * 2. 我们一般会定义如果对象的各个属性值都相等，那么对象就是相等的
 * 算法描述:
 * 1. 假定对象a 和 b
 * 2. 遍历 a 中的成员，判断是否每一个 a 中的成员都在 b 中，并且与 b 中的对应成员相等。
 * 3. 再遍历 b 中的成员，判断是否每一个 b 中的成员都在 a 中，并且与 a 中的对应成员相等
 * 4. 如果成员是引用类型，递归。
 */
export function looseEqual (a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
export function looseIndexOf (arr: Array<mixed>, val: mixed): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

/**
 * 让一个函数只执行一次
 * Ensure a function is called only once.
 */
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
