JGVue.prototype.mount = function(){
    //需要提供一个 render 方法，生成虚拟DOM
    this.render = this.createRenderFn();

    this.mountComponent();
}

JGVue.prototype.mountComponent = function(){
    let mount = () => {
        this.update(this.render());
    }

    mount.call(this);    //本来应该交给 watcher 来调用
}

JGVue.prototype.createRenderFn = function(){
    let ast = getVNode(this._template);

    //Vue: 将 AST + data => VNode
    //JGVue: 将带有坑的VNode + data => 带有数据的VNode
}