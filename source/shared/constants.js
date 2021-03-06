export const SSR_ATTR = 'data-server-rendered'

/**
 * 深入的时候需要了解
 * 每一个 Vue 组件都会挂载的成员
*/
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]

/** 声明周期函数 hook 钩子函数 */
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
]
