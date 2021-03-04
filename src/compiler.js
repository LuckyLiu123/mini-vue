
/** 由 HTML DOM -> VNode: 将这个函数当作 compiler 函数 */
function getVNode(node){
    let nodeType = node.nodeType;
    let _vnode = null;
    if(nodeType === 1){    //元素节点
        let nodeName = node.nodeName;
        let attrs = node.attributes;
        let _attrObj = {};
        for(let i = 0; i < attrs.length; i++){
            _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
        }
        _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

        //考虑 node 的子元素
        let childNodes = node.childNodes;
        for(let i = 0; i < childNodes.length; i++){
            _vnode.appendChild( getVNode(childNodes[i]) );
        }
    }else if(nodeType === 3){   //文本节点
        _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType);
    }
    return _vnode;
}

//将 虚拟DOM VNode 转换为真正的 DOM
function parseVNode(vnode){
    let type = vnode.type;
    let _node;
    if(type === 3){
        return document.createTextNode(vnode.value);
    }else if(type === 1){
        _node = document.createElement(vnode.tag);

        let data = vnode.data;
        Object.keys(data).forEach(key => {
            let attrName = key;
            let attrValue = data[key];
            _node.setAttribute(attrName, attrValue);
        })

        let childrens = vnode.children;
        childrens.forEach(subvnode => {
            _node.appendChild( parseVNode(subvnode) );
        })
        return _node;
    }
}

let rkuohao = /\{\{(.+?)\}\}/g;

//根据路径访问对象成员
function getValueByPath(data, path){
    let paths = path.split(',');
    let res = data;
    let prop;
    while(prop = paths.shift()){
        res = res[prop];
    }
    return res;
}

/** 将 带有坑的 VNode 与数据 data 相结合，得到 填充数据的 VNode: 模拟 AST -> VNode */
function combine(vnode, data){
    let _type = vnode.type;
    let _data = vnode.data;
    let _value = vnode.value;
    let _tag = vnode.tag;
    let _children = vnode.children;

    let _vnode = null;
    if(_type === 3){   //文本节点
        _value = _value.replace(rkuohao, (_, g) => {
            return getValueByPath(data, g.trim());
        })
        _vnode = new VNode(_tag, _data, _value, _type);
    }else if(_type === 1){  //元素节点
        _vnode = new VNode(_tag, _data, _value, _type);
        _children.forEach(_subvnode => _vnode.appendChild( combine(_subvnode, data) ));
    }
    return _vnode;
}




