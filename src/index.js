// let m = require('./q.js');
// require('./index.css');
// require('./index.less');
//import 'bootstrap'
//require('@babel/polyfill')

// expose-loader  暴露全局的 loader  内联的loader
//file-loader 默认会在内部生成一张图片到 build 目录下   ，  把生成的图片的名字返回 回来

import pg from './xiaolai.jpg';
import $ from 'jquery';
//import moment from 'moment';

console.log(pg)
console.log(DEV)
// loader 的类型  -------- pre 前面的执行的loader  normal 普通的loader 内联loader   后置 postloader
//import $ from 'expose-loader?$!jquery'; //相当于 把jquery 暴露在全局中  , 当然也可以在webpack 中配置， 详见webpack 的配置。两种方法二选一
//import $ from 'jquery';
//console.log(window.$);// 上面个的一顿操作，把$挂载到了window上  下面我们考虑把$注入到每个模块中去
console.log($); //引用  webpack 
let fn = (r)=>{
  console.log(r)
}
fn(1)

// let time = moment().endOf('day').fromNow();
// console.log(time)


let image = new Image()
image.src = pg;
document.body.appendChild(image);
// class A{
//   a=1;
// }

'aaa'.includes('a') // 需要更高级的语法来转换， es7


let xhr= new XMLHttpRequest();
xhr.open('GET','/user',true);

xhr.onload = function (params) {
  console.log(xhr.response)
}

xhr.send();