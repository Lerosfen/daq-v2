/**
 * 数据可视化系统主页面js
 */
$package("visualization");
visualization={
    /**
     * 初始化方法
     */
    initVisualizationPage:function() {
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
                name:"DIY图表",
                url:"#",
                chidren:[{
                    name:"图表管理",
                    url:"/tpl/visualization/chartDIY.html"
                },{
                    name:"图表展示编辑",
                    url:"/tpl/visualization/chartShowEdit.html"
                },{
                    name:"可视化",
                    url:"/tpl/visualization/chartShow.html"
                }]
            },{
                name:"数据查询",
                url:"#",
                chidren:[{
                    name:"元数据查询定位",
                    url:"/tpl/visualization/metadataCheck.html"
                },{
                    name:"数据查找",
                    url:"/tpl/visualization/dataShow.html"
                },{
                    name:"数据可视化查询",
                    url:"/tpl/visualization/dataVisualizationShow.html"
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
    visualization.initVisualizationPage();
});