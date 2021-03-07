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

    /** 将当前 Dep 与当前的 Watcher(暂时为渲染 watcher)关联 */
    depend(){
        if(Dep.target){
            this.addSub(Dep.target);  //将当前的 watcher 关联到当前的 dep 上
            Dep.target.addDep(this);  //将当前的 dep 与当前的 渲染watcher 关联起来

        }
    }

    /** 触发与之关联的 watcher 的 update 方法，起到更新的作用 */
    notify(){
        /**
         * 在真实的 Vue 中是依次触发 this.subs 中的 watcher 的 update 方法
         * 此时，deps 中已经关联到 我们需要使用的 那个 watcher 了
        */
        let deps = this.subs.slice();
        deps.forEach(watcher => {
            watcher.update();
        })
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
