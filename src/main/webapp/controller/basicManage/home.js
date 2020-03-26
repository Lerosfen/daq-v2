/**
 * 基础管理首页面js
 */
$package("basicManageHome");
basicManageHome={
	/**
	 * 初始化方法
	 */
    initHomePage:function() {
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
        //获取菜单数据
        var menuData = [{
            name:"基础管理",
            url:"#",
            chidren:[{
                name:"字典管理",
                url:"/tpl/basicManage/dictionary.html"
            },{
                name:"配置管理",
                url:"/tpl/basicManage/configuration.html"
            }]
        }];
        //生成菜单
        var yunpiMenu = new YunpiMenu({
            data:menuData,
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
        yunpiMenu.selectMenu(0,0);//默认打开第一个菜单
    }
};
$(function(){
    basicManageHome.initHomePage();
});