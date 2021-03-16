# vue 源码解读
1. 各个文件夹的作用
2. Vue 的初始化流程

## 各个文件夹的作用
1. compiler 编译用的
    - vue 使用 **字符串** 作为模板
    - 在编译文件夹中存放对模板字符串的 解析算法，抽象语法树，优化等
2. core 核心，vue 的构造函数，以及生命周期等方法的部分（例如：虚拟DOM，发布订阅模式）
3. platforms 平台
    - 针对运行的环境(或设备)，有不同的实现
    - 也是 vue 的入口
4. server 服务端，主要是将 vue 用在服务端的代码处理
5. sfc 单文件组件
6. shared 公共工具，方法


## observer 文件夹中各个文件的作用
 - array.js 创建含有重写 数组方法的数组，让所有的响应树数据数组继承自该数组
 - dep.js  Dep类
 - index.js Observer 类，observe 的工厂函数
 - scheduler.js vue中任务调度的工具，watcher 执行的核心
 - traverse.js 递归遍历响应式数据，目的是触发依赖收集
 - watcher.js Watcher 类



 ## 算法题
 1. 不使用 JSON.stringify 实现将 对象转换为 JSON 格式的字符串?