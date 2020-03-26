/**
 * 运行监控系统主页面js
 */
$package("monitor");
monitor={
	/**
	 * 初始化方法
	 */
	initMonitorPage:function() {
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
                name:"平台监控",
                url:"#",
                chidren:[{
                    name:"平台运行监控",
                    url:"/tpl/monitor/OperationMonitor.html"
                }]
            },{
                name:"业务监控",
                url:"#",
                chidren:[{
                    name:"数据质量监控",
                    url:"/tpl/monitor/dataQcMonitor.html"
                },{
                    name:"数据治理监控",
                    url:"/tpl/monitor/dataGovernanceMonitor.html"
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
    monitor.initMonitorPage();
});