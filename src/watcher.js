let watcherid = 0;

/** Watcher 观察者，用于 发射更新行为 */
class Watcher{
    /**
     * @param {object} vm JGVue实例
     * @param {String|Function} expOrfn 如果是渲染 watcher，传入的就是渲染函数，如果是 计算 watcher，传入的就是路径表达式，暂时只考虑 expOfFn 为函数的情况.
    */
    constructor(vm, expOrfn){
        this.vm = vm;
        this.getter = expOrfn;
        this.id = watcherid++;

        this.deps = [];   //依赖项
        this.depIds = {};    //是一个 Set 类型，用于保证依赖项的唯一性

        //一开始需要渲染: 真实 vue 中: this.lazy ? undefined : this.get()
        this.get();
    }

    //计算，触发 getter
    get(){
        pushTarget(this);
    }


}
