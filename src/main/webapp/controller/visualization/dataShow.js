/**
 * 元数据管理页面js
 */
$package("dataVisualizationShow");
dataVisualizationShow={
    /**
     * 初始化方法
     */
    initMetadata:function() {
        this.obj = {
            dataShowBtn : $('#dataShowBtn'),
            dataVisualizaType : $('#dataVisualizaType'),
            dataVisualizaName : $('#dataVisualizaName'),
            dataShowRight:$("#dataShowRight"),
            dataShowContent:$("#dataShowContent"),
            dataShowPush:$("#dataShowPush")
        };
        //定义当前页面的全局数据变量
        this.vars={
            ContPage : 1
        };
        // this.init()
        // this.dataVisualization(this.vars.ContPage)
        this.initEvent();//index页面事件初始化
    },
    dataVisualization:function(page){
        var self = this;
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/DataSearch/dept/?page="+page,
            success: function (res) {
                var trs = "";
                res.forEach(function (intem,index) {
                    trs += `
                    <div class="intem">
                        <div class="title">${intem.modelName}</div>
                        <div class="content" title = '${JSON.stringify(intem.data).substring(1,JSON.stringify(intem.data).length-1)}'>${JSON.stringify(intem.data).substring(1,JSON.stringify(intem.data).length-1)}</div>
                    </div>
                    `
                })
                $("#dataShowChants").html(trs);
                self.setPage()
            },
            error: function () {
                YunpiAlert.error('部门列表查询失败！');
            }
        });
    },
    setPage() {
        var self = this;
        $("#bp-3-element-test").bootstrapPaginator({
            //设置版本号
            bootstrapMajorVersion: 3,
            // 显示第几页
            currentPage: 1,
            // 总页数
            totalPages: 5,
            //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
            onPageClicked: function (event,originalEvent,type,page) {
                // 把当前点击的页码赋值给currentPage, 调用ajax,渲染页面
                self.dataVisualization(page)
            }
        })
    },
    /**
     * 页面事件绑定
     */
    initEvent:function() {
        var self = this;
        /**
         * 查询按钮
         */
        self.obj.dataShowBtn.unbind().bind("click", function () {
            $("#toRight").fadeOut();
            $("#searchFace").fadeOut();
            $("#DataLookImg").fadeOut();
            self.obj.dataShowContent.val(self.obj.dataShowRight.val())
            $(".honer-right").fadeIn();
            $("#toContent").fadeIn();
            self.dataVisualization(self.vars.ContPage)
        });
        /**
         *查询
         */
        self.obj.dataShowPush.unbind().bind("click", function () {
            self.obj.dataShowRight.val(self.obj.dataShowContent.val())
            self.dataVisualization(self.vars.ContPage)
        });

    },
};
$(function(){
    dataVisualizationShow.initMetadata();
});