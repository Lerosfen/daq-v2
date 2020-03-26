$package("yunpi-base");
function $package(ns) {
    base_finalLinkObj = ns;
     var a = arguments, o = null, i, j, d;
     for (i = 0; i < a.length; i = i + 1) {
          d = ("" + a[i]).split(".");
          o = window;
          for (j = 0; j < d.length; j = j + 1) {
               o[d[j]] = o[d[j]] || {};
               o = o[d[j]];
          }
     }
     return o;
}

/**
 * 解决冒泡问题的方法
 * @param method
 * @param scope
 */
function $binding(method,scope){
    return (function(method,scope){
        return function(){
            return method.apply(scope || window,arguments);
        };
    })(method,scope);
}
/**
 * 获取项目根路径
 */
/*function getRootPath(){
     var pathName = window.location.pathname.substring(1); 
     var webName = pathName == '' ? '/' : '/'+pathName.substring(0, pathName.indexOf('/'))+'/';
     return window.location.protocol + '//' + window.location.host + webName;
}
var wwwroot=getRootPath();		// 全局根路径*/

function getRootPath(){
    return window.location.protocol + '//' + window.location.host;
}
var wwwroot=getRootPath();		// 全局根路径


/**
 * 数组转成字典
 * keyField : 设置字典keyField对应的字段名，或获取keyField的方法
 */
Array.prototype.toDict = function(keyField, copy) {
    var data=new Array();
    var copyData = this;
    if(copy == undefined || copy == true){
        copyData = $.extend(true, [],  this);
    }

    if (typeof keyField === 'string'){
        var  len = copyData.length;
        for (var i = 0; i < len; i++) {
            data[copyData[i][keyField]] = copyData[i];
        }
    }else if(typeof keyField === 'function'){
        var len = copyData.length;
        for (var i = 0; i < len; i++) {
            data[keyField.call(copyData, copyData[i], i)] = copyData[i];
        }
    }else{
        return undefind;
    }
    return data;
};
/**
 * 从字典中获取值
 * key : 设置字典key对应的字段名，或获取key的方法
 */
Array.prototype.getText = function(key,valueField) {
     var value = '';
     var valueObj = this[key];
     if(valueObj){
          value = valueObj[valueField];
     }else{
          value = 'error';
     }
     return value;
};

/**
 * 数组转成树型结构
 *  {
 * 		parentField : "pid",
 * 		textField : "name",
 * 		idField : "key",
 * 		childrenField:"children"
 * 	}
 * parentField : "pid",
 * textField : "name",
 * idField : "key"
 * textName: 可不设置，设置后会为每个对象增加一个对应设置的属性，并存textField设置的值
 */
Array.prototype.toTree = function(opt) {
    if(!opt){
        opt = {parentField : "pid",textField : "name",idField : "key",childrenField:"children"}
    }
    var data = [];
    var i, l, treeData = [], tmpMap = [];

    for (i = 0, l = this.length; i < l; i++) {
        data[i] = this[i];
        if (opt.textName) {
            data[i][opt.textName] = data[i][opt.textField];
        }
        //data[i]["type"] = "file";
        tmpMap[data[i][opt.idField]] = data[i];
    }

    for (i = 0, l = data.length; i < l; i++) {
        if (tmpMap[data[i][opt.parentField]] && data[i][opt.idField] != data[i][opt.parentField]) {
            if (!tmpMap[data[i][opt.parentField]][opt.childrenField])
                tmpMap[data[i][opt.parentField]][opt.childrenField] = [];
            tmpMap[data[i][opt.parentField]][opt.childrenField].push(data[i]);
        } else {
            treeData.push(data[i]);
        }
    }
    return treeData;
};


/**
 * 从数据表格字段中获取选中字段
 */
Array.prototype.removeBykey = function(keyField, value) {
     var data=[];
     var objData = this;
     var len = objData.length;
     for(var i = 0 ; i < len ; i++){
          if(objData[i][keyField] != value){
               data.push(objData[i]);
          }
     }
     return data;
};

Array.prototype.removeByArray = function(srcKey,removeKey, removeArr) {
     var data=[];
     var objData = this;
     var len = objData.length;
     var lenR = removeArr.length;
     for(var i = 0 ; i < len ; i++){
          var flag = true;
          for(var j = 0 ; j < lenR ; j++){
               if(objData[i][srcKey] == removeArr[j][removeKey]){
                    flag = false;
               }
          }

          if(flag){
               data.push(objData[i]);
          }
     }
     return data;
};
Array.prototype.addAll = function(key,newArr) {
     var data=[];
     var objData = this;
     var len = objData.length;
     for(var i = 0 ; i < len ; i++){
          data.push(objData[i]);
     }

     var newlen = newArr.length;
     for(var i = 0 ; i < newlen ; i++){
          if(key){
               var value = newArr[i][key];
               var dataLen = data.length;
               var falg = true;
               for(var j = 0 ; j < dataLen ; j++){
                    if(data[j][key] == value){
                         falg = false;
                         break;
                    }
               }
          }else{
               var value = newArr[i];
               var dataLen = data.length;
               var falg = true;
               for(var j = 0 ; j < dataLen ; j++){
                    if(data[j] == value){
                         falg = false;
                         break;
                    }
               }
          }

          if(falg){
               data.push(newArr[i]);
          }
     }
     return data;
};

Array.prototype.getBykey = function(value,key) {
     if(!key || key==''){
          key='id';
     }
     var obj = null;
     var data = this;
     var len = data.length;
     for(var i = 0 ; i < len ; i++){
          if(data[i][key] == value){
               obj = data[i];
               break;
          }
     }
     return obj;
};

Array.prototype.getByValue = function(value,key,childrenkey){
     if(!key || key==''){
          key='id';
     }
     if(!childrenkey || childrenkey==''){
          childrenkey='children';
     }
     var obj = null;
     var data = this;

     var len = data.length;
     for(var i = 0 ; i < len ; i++){
          if(data[i][key] == value){
               obj = data[i];
          }else{
               var a = data[i][childrenkey];
               if(a){
                    obj = a.getByValue(value,key,childrenkey);
               }
          }
          if(obj){
               break;
          }
     }
     return obj;
};

//格式化时间
Date.prototype.format = function (format) {
     if(!format){
          format = "yyyy-MM-dd hh:mm:ss";
     }
     /*
      * format="yyyy-MM-dd hh:mm:ss";
      */
     var o = {
          "M+": this.getMonth() + 1,
          "d+": this.getDate(),
          "h+": this.getHours(),
          "m+": this.getMinutes(),
          "s+": this.getSeconds(),
          "q+": Math.floor((this.getMonth() + 3) / 3),
          "S": this.getMilliseconds()
     };

     if (/(y+)/.test(format)) {
          format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4- RegExp.$1.length));
     }

     for (var k in o) {
          if (new RegExp("(" + k + ")").test(format)) {
               format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]: ("00" + o[k]).substr(("" + o[k]).length));
          }
     }
     return format;
};

/**
 * 空判断
 * @param n
 * @returns {boolean}
 */
function isNull(n){
    if(n != undefined && n != "undefined" && n != null && n != "null" && n!= ""){
        return false;
    }
    else{
        return true;
    }
}

/**
 * 将Ansi编码的字符串进行Base64编码
 */
function encode64(input) {
    if(isNull(input)){
        return;
    }
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
            + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output;
}

/**
 * 编码转换，UTF-16转UTF-8
 * @param str
 * @returns {string}
 */
function utf16to8(str) {
    if(isNull(str)){
        return;
    }
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}


/**
 * 获取扇形360度坐标点的位置
 * x：中心点横轴坐标
 * y：中心点纵轴坐标
 * r：扇形半径（px）
 * n：扇形边缘的点数量
 * @param format
 * @returns {*}
 */
function getCirclePoint(x,y,r,n) {
    var data = [];
    for(var i = 1 ; i <= n ; i++){
        var ytemp = Math.sin(2*Math.PI*(i-1)/n)*r;
        var xtemp = Math.cos(2*Math.PI*(i-1)/n)*r;
        data.push({
            x:x+xtemp,
            y:y-ytemp
        })
    }
    return data;
}


/*
* 获取Mock的post请求中的参数
* */
function getPostParam(options){
    var paramObj = {};
    if(options && options.body && options.body!=""){
        var paramArray = options.body.split("&");
        if(paramArray){
            for(var j = 0 ; j < paramArray.length ; j++){
                var param = paramArray[j].split("=",2);
                paramObj[param[0]] = parseInt(param[1]);
            }
        }
    }
    return paramObj;
}

/**
 * 帮助层的通用方法
 * @param path
 */
function showHelp(path){
    alert(path);
}