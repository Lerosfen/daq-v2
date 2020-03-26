/**
 * 血统分析系统主页面js
 */
$package("pedigree");
pedigree={
    /**
     * 初始化方法
     */
    initPedigreePage:function() {
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
                name:"数据溯源",
                url:"#",
                chidren:[{
                    name:"元数据溯源",
                    url:"/tpl/pedigree/metadataTraceToSource.html"
                },{
                    name:"实体模型数据溯源",
                    url:"/tpl/pedigree/entityModelTraceToSource.html"
                }]
            },{
                name:"数据流向分析",
                url:"#",
                chidren:[{
                    name:"数据地图",
                    url:"/tpl/pedigree/dataMap.html"
                },{
                    name:"数据演变分析",
                    url:"/tpl/pedigree/dataEvolve.html"
                },{
                    name:"数据源影响分析",
                    url:"/tpl/pedigree/dataSourceInfluence.html"
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
    pedigree.initPedigreePage();
});