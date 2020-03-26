/**
 * 日志管理系统主页面js
 */
$package("logManage");
logManage={
	/**
	 * 初始化方法
	 */
    initLogManagePage:function() {
		this.obj = {
            basicMenu:$('#basicMenu'),
            menuName:$('.menu-name'),
            menuItem:$('.menu-item'),
            homeContent:$('#homeContent')
		};
        this.initDom();//初始化页面
    },
    /**
     * 页面初始化
     */
    initDom:function(){
        var self = this;
        var yunpiMenu = new YunpiMenu({
            data:[{
                name:"日志管理",
                url:"#",
                chidren:[{
                    name:"日志接入",
                    url:"/tpl/logManage/systemJoins.html"
                }]
            },{
                name:"日志查询",
                url:"#",
                chidren:[{
                    name:"操作日志查询",
                    url:"/tpl/logManage/operationLog.html"
                },{
                    name:"归档日志查询",
                    url:"/tpl/logManage/archivedLog.html"
                },{
                    name:"实时日志查询",
                    url:"/tpl/logManage/realTimeLog.html"
                },{
                    name:"登录日志查询",
                    url:"/tpl/logManage/loginLog.html"
                },{
                    name:"异常日志查询",
                    url:"/tpl/logManage/exceptionLog.html"
                },{
                    name:"调试日志查询",
                    url:"/tpl/logManage/debugLog.html"
                }]
            }],
            url:'url',
            name:'name',
            onClickMenu:function(targetNode){
                if(yunpiMenu.isLeaf(targetNode)){
                    var url = yunpiMenu.getMenuUrl(targetNode);
                    var name = yunpiMenu.getMenuName(targetNode);
                    var pname = yunpiMenu.getParentMenuName(targetNode);
                    self.obj.menuName.html('\\' + pname);
                    self.obj.menuItem.html('\\' + name);
                    self.obj.homeContent.load(url);
                }
            },
            id:"basicMenu"
        });
        yunpiMenu.selectMenu(0,0);
    }
}
$(function(){
    logManage.initLogManagePage();
});