/**
 * ObjectName：yunpiConsole
 * Author：Shaok Lei
 * Version：1.0
 * Desc：自定义全局对象类
 */
var YunpiConsole = {
	/**
	 * 错误信息输出到控制台
	 * 防止浏览器不支持error输出，使用log输出做为备选项
	 * @param {Object} msg
	 */
	error: function(msg) {
		if(window.console && msg) {
			if(window.console.error) {
				window.console.error(msg);
			} else if(window.console.log) {
				window.console.log(msg);
			} else {
				//nothing
			}
		}
	},

	/**
	 * 日志输出到控制台
	 * @param {Object} msg
	 */
	log: function(msg) {
		if(window.console && window.console.log && msg) {
			window.console.log(msg);
		} else {
			//nothing
		}
	},

	/**
	 * 警告信息输出到控制台
	 * 防止浏览器不支持warn输出，使用log输出做为备选项
	 * @param {Object} msg
	 */
	warn: function(msg) {
		if(window.console && msg) {
			if(window.console.warn) {
				window.console.warn(msg);
			} else if(window.console.log) {
				window.console.log(msg);
			} else {
				//nothing
			}
		}
	},

	/**
	 * 常规信息输出到控制台
	 * 防止浏览器不支持info输出，使用log输出做为备选项
	 * @param {Object} msg
	 */
	info: function(msg) {
		if(window.console && msg) {
			if(window.console.info) {
				window.console.info(msg);
			} else if(window.console.log) {
				window.console.log(msg);
			} else {
				//nothing
			}
		}
	},

	/**
	 * 调试信息输出到控制台
	 * 防止浏览器不支持debug输出，使用log输出做为备选项
	 * ----谷歌浏览器和opera不支持console.debug()
	 * @param {Object} msg
	 */
	debug: function(msg) {
		if(window.console && msg) {
			if(window.console.debug) {
				window.console.debug(msg);
			} else if(window.console.log) {
				window.console.log(msg);
			} else {
				//nothing
			}
		}
	}
}

/**
 * 获取浏览器类型及版本信息，结构为{type:"类型"，version:"版本"}，获取失败直接返回false
 */
function getBrowserType() {
	var ret = false;
	//1.判断是否是IE或者Edge
	var userAgent = navigator.userAgent;
	var isOpera = (userAgent.toLowerCase().indexOf("opr") > -1) || (userAgent.indexOf("Opera") > -1); //判断是否Opera浏览器
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器 
	var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器 
	//1.1如果是IE，获取版本信息
	if(isIE) {
		ret={type:"ie"};
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if(fIEVersion == 7) {
			ret.version="7";
		}else if(fIEVersion == 8) {
			ret.version="8";
		}else if(fIEVersion == 9) {
			ret.version="9";
		}else if(fIEVersion == 10) {
			ret.version="10";
		}else if(fIEVersion == 11) {
			ret.version="11";
		}else {
			ret.version="6-";//IE版本过低 
		}
		return ret;
	}
	//1.2如果是Edge，获取版本信息
	if(isEdge) {
		ret={type:"edge"};
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		return ret;
	}
	
	//2.判断是否是其它浏览器
	var ua = navigator.userAgent.toLowerCase();
	yunpiConsole.log(ua);
	if(ua.match(/firefox\/([\d.]+)/)){
		var browserMsg = ua.match(/firefox\/([\d.]+)/);
		ret={
			type:"firefox",
			version:browserMsg[1]
		};
	}else if(ua.match(/opr.([\d.]+)/)){
		var browserMsg = ua.match(/opr.([\d.]+)/);
		ret={
			type:"opera",
			version:browserMsg[1]
		};
	}else if(ua.match(/chrome\/([\d.]+)/)){
		var browserMsg = ua.match(/chrome\/([\d.]+)/);
		ret={
			type:"chrome",
			version:browserMsg[1]
		};
	}else if(ua.match(/version\/([\d.]+).*safari/)){
		var browserMsg = ua.match(/version\/([\d.]+).*safari/);
		ret={
			type:"safari",
			version:browserMsg[1]
		};
	}else{
		ret = false;
	}
	return ret;
}

/**
 * 判断是否是IE浏览器
 */
function isIE() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
	var isOpera = (userAgent.toLowerCase().indexOf("opr") > -1) || (userAgent.indexOf("Opera") > -1); //判断是否Opera浏览器
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器 
	if(isIE) {
		return true;
	} else {
		return false;
	}
}

/**
 * 判断是否是Edge浏览器 
 */
function isEdge() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
	var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
	if(isEdge) {
		return true;
	} else {
		return false;
	}
}