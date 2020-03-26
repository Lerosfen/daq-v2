/**
 * 质量管理系统主页面js
 */
$package("qc");
qc={
	/**
	 * 初始化方法
	 */
    initQcPage:function() {
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
                name:"数据质量管理",
                url:"#",
                chidren:[{
                    name:"数据质量检测",
                    url:"/tpl/qc/dataQuality.html"
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
        yunpiMenu.selectMenu(0,0);//默认打开第一个菜单
    }
}
$(function(){
    qc.initQcPage();
});