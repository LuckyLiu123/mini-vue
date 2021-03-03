

function defineReactive(target, key, value, enumerable){
    //函数内部就是一个局部作用域，这个 value 就只在函数内使用的变量（闭包）
    let that = this;
    if(typeof value === 'object' && value !== null){
        observe(value);
    }

    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: !!enumerable,
        get(){
            console.log(`读取 ${key} 属性`);
            return value;
        },
        set(newVal){
            console.log(`设置 ${key} 属性`);
            value = newVal;
        }
    })
}

/** 将对象 obj 变成响应式，vm 就是 vue 的实例，为了在调用时处理上下文 */
function observe(obj, vm){
    //之前没有对 obj 本身进行操作，这一次就直接对 obj 进行判断
    if(Array.isArray(obj)){
        // 对其每一个元素进行处理
        for(let i = 0; i < obj.length; i++){
            observe(obj[i]);   //递归处理每一个数组元素
        }
    }else{
        //对其成员进行处理
        let keys = Object.keys(obj);
        for(let i = 0; i < keys.length; i++){
            let prop = keys[i];
            defineReactive.call(vm, obj, prop, obj[prop], true);
        }
    }
}

JGVue.prototype.initData = function(){

    //响应式化
    observe(this._data, this);
}