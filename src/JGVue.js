function JGVue(options){
    this._data = options.data;
    let elem = document.querySelector(options.el);
    this._template = elem;
    this._parentNode = elem.parentNode;

    this.initata();

    this.mount();
}