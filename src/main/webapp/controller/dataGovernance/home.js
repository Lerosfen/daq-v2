/**
 * 登录页面js
 */
$package("dataGovernanceHome");
dataGovernanceHome={
	/**
	 * 初始化方法
	 */
	initLoginPage:function() {
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
                name:"数据源管理",
                url:"#",
                chidren:[{
                    name:"数据源管理",
                    url:"/tpl/dataGovernance/dataSource.html"
                }]
            },{
                name:"元数据管理",
                url:"#",
                chidren:[{
                    name:"元模型管理",
                    url:"/tpl/dataGovernance/metamodel.html"
                },{
                    name:"元数据管理",
                    url:"/tpl/dataGovernance/metadata.html"
                }]
            },{
                name:"数据元管理",
                url:"#",
                chidren:[{
                    name:"数据元管理",
                    url:"/tpl/dataGovernance/dataElement.html"
                },{
                    name:"数据元模板管理",
                    url:"/tpl/dataGovernance/dataElementModel.html"
                },{
                    name:"数据元规则管理",
                    url:"/tpl/dataGovernance/dataElementRule.html"
                }]
            },{
                name:"数据采集",
                url:"#",
                chidren:[{
                    name:"FTP数据源管理",
                    url:"/tpl/dataGovernance/ftpDataSource.html"
                },{
                    name:"FTP采集管理",
                    url:"/tpl/dataGovernance/ftpDaq.html"
                },{
                    name:"接口采集管理",
                    url:"/tpl/dataGovernance/webServiceDataDaq.html"
                },{
                    name:"采集记录查看",
                    url:"/tpl/dataGovernance/daqHistoryLog.html"
                }
                /*,{
                    name:"采集结果预览",
                    url:"/tpl/dataGovernance/daqResultView.html"
                }
                */]
            },{
                name:"数据清洗",
                url:"#",
                chidren:[{
                    name:"清洗规则管理",
                    url:"/tpl/dataGovernance/cleanRule.html"
                },{
                    name:"清洗策略管理",
                    url:"/tpl/dataGovernance/cleanStrategy.html"
                    /*
                    chidren: [{
                        name: "添加清洗策略",
                        url: "/tpl/dataGovernance/AddcleanStrategy.html"
                    }]
                    */
                }]
            },{
                name:"数据融合",
                url:"#",
                chidren:[{
                    name:"融合策略管理",
                    url:"/tpl/dataGovernance/fusionStrategy.html"
                }]
            },{
                name:"数据模型管理",
                url:"#",
                chidren:[{
                    name:"实体模型管理",
                    url:"/tpl/dataGovernance/entityModel.html"
                },{
                    name:"实体模型关系管理",
                    url:"/tpl/dataGovernance/entityModelRelation.html"
                },{
                    name:"数据模型申请",
                    url:"/tpl/dataGovernance/dataModelApply.html"
                },{
                    name:"数据模型审批",
                    url:"/tpl/dataGovernance/dataModelAudit.html"
                },{
                    name:"数据模型服务监控",
                    url:"/tpl/dataGovernance/dataModelMonitor.html"
                }
                /*,{
                    name:"数据发布",
                    url:"/tpl/dataGovernance/dataPublish.html"
                }*/]
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
    dataGovernanceHome.initLoginPage();
});