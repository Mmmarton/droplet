!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t){e.exports="<div class='checkbox' onclick=\"{toggle}\">\r\n    <span class='red' *if='{inputs.checked}'>o</span>\r\n</div>"},function(e,t){e.exports="<div class='list-item'>\r\n    <span>\r\n        <Checkbox />\r\n        <content>{inputs.content}</content>\r\n    </span>\r\n    <button class='shady-button' onclick=\"{remove}\">x</button>\r\n</div>"},function(e,t){e.exports="<div class='main-container'>\r\n    <h1 class='title'>To do:</h1>\r\n    <input class='todo-text' value='{text.content}' onkeyup=\"{updateText}\" type=\"text\" />\r\n    <button class='shady-button big-button' onclick=\"{addIem}\">Add</button>\r\n    <ul class='list'>\r\n        <ListItem *for='{listItems}' remove='{removeItem}' />\r\n    </ul>\r\n</div>"},function(e,t,n){"use strict";function r(e,t){return e.substring(t.length).replace(/((\/)|( \/))?/,"").replace(new RegExp(/([a-zA-Z0-9*]+?)\=['"](.+?)['"]((\/)|( \/))?/,"g"),'"$1":"$2",')}function i(e){let t=function e(t=""){let n="",i=0;for(let c=0;c<t.length&&c<1e4;c++)if("<"===t[c]&&"/"!==t[c+1]){c>i+1&&(n+=`"${t.substring(i,c)}",`);let p=t.indexOf(">",c),u=t.substring(c+1,p),f=u.split(" ")[0];n+=` {"elementName":"${f}",`;let a=r(u,f);if(a&&(n+=`"props":{${a}},`),"/"!==u[u.length-1]){l=" ",o=p;let r=p+1;p=(t=(s=t).substring(0,o)+l+s.substring(o+1)).indexOf(`</${f}>`,p),n+=`"children":[${e(t.substring(r,p))}]`,c=p+1}}else">"===t[c]&&(n+="},",i=c+1);var s,l,o;return i!==t.length&&(n+=`"${t.substring(i)}",`),n}(e=(e=(e=e.replace(new RegExp(/[\n\r\t]/,"g")," ")).replace(new RegExp(/ {2,}/,"g")," ")).replace(new RegExp(/> </,"g"),"><"));return t=t.replace(new RegExp(/(,([\]\}$]))|(,$)/,"g"),"$1"),t=t.replace(new RegExp(/,([\]\}$])/,"g"),"$1"),JSON.parse(t)}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.r(t);let l,o=!1,c=document.querySelectorAll("body")[0],p={};function u(e){let t;if("string"==typeof e)t=e;else if(p[e.elementName]){let n=new p[e.elementName];n.inputs={...e.inputs},n.props={...e.props},t=n}else{let n={...e,children:[]};if(e.children){n.children=[];for(let t of e.children)n.children.push(f(t))}t=n}return t}function f(e){for(let t in e.props)if("*for"===t)return{props:e.props,model:e,children:[]};return u(e)}setTimeout((function e(){o&&(!function(e,t){let n=function e(t){const{elementName:n,props:r,children:i}=t;let s;if(r&&r.hasOwnProperty("*if")&&(!r["*if"]||"function"==typeof r["*if"]&&!r["*if"]()))return null;if(n){if(s=document.createElement(n),r&&Object.keys(r).forEach(e=>{if((e=>e.startsWith("on"))(e)){const t=e.toLowerCase().substring(2);s.addEventListener(t,r[e])}else s[e]=r[e]}),i)for(let t=0;t<i.length;t++){let n=e(i[t]);if(n)if(n.push)for(let e of n)s.appendChild(e);else s.appendChild(n)}}else if(t.model){let n=[];for(let r=0;r<t.children.length;r++){let i=t.children[r];i.proxy.inputs={...i.proxy.inputs,...t.props["*for"][r]};let s=e(i);n.push(s)}s=n}else s=t.template?e(t.proxy.render()):document.createTextNode(t);return s}(t.render());for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(n)}(c,l),o=!1),setTimeout(e,30)}),30);class a{constructor(){s(this,"inputs",{}),s(this,"template",""),this.proxy=new Proxy(this,{set:(e,t,n)=>(e[t]=n,o=!0,!0)});let e=Object.getOwnPropertyNames(Object.getPrototypeOf(this));for(let t of e)"function"==typeof this[t]&&"constructor"!==t&&(this[t]=this[t].bind(this.proxy));return this.proxy}setTemplate(e){this.template=i(e),this.template=f(this.template)}render(){return function e(t,n){if("string"==typeof n)return function(e,t){for(let n=0;n<e.length;n++)if("{"===e[n]){let r=e.substring(n+1,e.indexOf("}",n));e=e.replace(`{${r}}`,t.get(r))}return e}(n,t);let r={...n,props:{},children:[]};for(let e in n.props){let i=e;if("class"===e&&(i="className"),"{"===n.props[e][0]){let s=n.props[e].substring(1,n.props[e].length-1);r.props[i]=t.get(s),r.proxy&&(r.proxy.inputs=r.props)}else r.props[i]=n.props[e]}if(n.children){r.children=[];for(let i of n.children)r.children.push(e(t,i))}if(r.model){let e=r.children.length,t=r.props["*for"],i=t.length;for(let t=0;t<i-e;t++){let e=u({...r.model,inputs:{...r.props}});n.children.push(e),r.children=n.children}for(let e=0;e<i;e++)r.children[e].inputs={...r.children[e].inputs,...t[e]};i<e&&(n.children=n.children.slice(0,i),r.children=r.children.slice(0,i))}return r}(this,this.template)}get(e=""){let t=this,n=e.split(".");for(let e of n)t=t[e];return t}}var d=n(0),h=n.n(d);var m=n(1),g=n.n(m);var b,x=n(2),y=n.n(x);function v(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}class O extends a{constructor(){super(),v(this,"listItems",[]),v(this,"lastIndex",0),v(this,"text",{content:""}),this.setTemplate(y.a)}addIem(){this.listItems=[...this.listItems,{index:this.lastIndex++,content:this.text.content}]}removeItem(e){this.listItems=this.listItems.filter(t=>t.index!==e)}updateText(e){this.text.content=e.target.value}}!function(...e){for(let t of e)p[t.name]=t}(O,class extends a{constructor(){super(),this.setTemplate(g.a)}remove(){this.inputs.remove(this.inputs.index)}},class extends a{constructor(){super(),this.setTemplate(h.a)}toggle(){this.inputs={...this.inputs,checked:!this.inputs.checked}}}),b=new O,l=b,o=!0}]);