JGVue.prototype.mount = function(){
    //需要提供一个 render 方法，生成虚拟DOM
    this.render = this.createRenderFn();

    this.mountComponent();
}

JGVue.prototype.mountComponent = function(){
    let mount = () => {
        this.update(this.render());
    }

    // mount.call(this);    //本来应该交给 watcher 来调用

    // 这个 Watcher 就是全局的 Watcher，在任何一个位置都可以访问它(简化的写法)
    new Watcher(this, mount);    //相当于这里调用来 mount
}

JGVue.prototype.createRenderFn = function(){
    let ast = getVNode(this._template);

    //Vue: 将 AST + data => VNode
    //JGVue: 将带有坑的VNode + data => 带有数据的VNode
    return function render(){
        //将带有坑的 VNode 转换为带有数据的VNode
        let _tmp = combine(ast, this._data);
        return _tmp;
    }
}

// 将 虚拟DOM 渲染到页面中: diff 算法就在这里
JGVue.prototype.update = function(vnode){
    //简化，直接生成 HTML DOM replaceChild 页面中
    let realDOM = parseVNode(vnode);
    this._parentNode.replaceChild(realDOM, document.querySelector('#root'));
}