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