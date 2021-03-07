let depid = 0;

class Dep{
    constructor(){
        this.id = depid++;
        this.subs = [];  //存储的是与 当前 Dep 关联的 watcher
    }

    /** 添加一个 watcher */
    addSub(sub){
        this.subs.push(sub);
    }

    /** 移除 */
    removeSub(sub){
        for(let i = this.subs.length - 1; i >= 0; i--){
            if(sub === this.subs[i]){
                this.subs.splice(i, 1);
            }
        }
    }
}

//全局的容器存储渲染 watcher
Dep.target = null;

let targetStack = [];

// 将当前操作的 watcher 存储到全局的 watcher 中，参数 target 就是当前的 watcher
function pushTarget(target){
    targetStack.push(Dep.target);   //vue 源码中使用的push
    Dep.target = target;
}

//将当前的 watcher 退出
function popTarget(){
    Dep.target = targetStack.shift();
}

/**
 * 在 watcher 调用 get 方法的时候，调用 pushTarget(this)
 * 在 watcher 的 get 方法结束的时候，调用 popTarget() 
*/
