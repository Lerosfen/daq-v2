$package("archivedLog");
archivedLog = {
    initArchivedLog: function(){
        this.obj = {
            archivedTable: $("#archivedLogTable"),
            fromTime: $("#fromTime"),
            endTime: $("#endTime"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn")
        };
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        self.obj.archivedTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/logManage/archivedLog',
            //queryParams: "queryParams",
            toolbar: "#toolbar",
            height:$(window).height()-100,
            striped: false, // 是否显示行间隔色
            cache: false,//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            rightFixedColumns:true,
            rightFixedNumber:1,
            /*leftFixedColumns:true,
            leftFixedNumber:2,*/
            uniqueId: "id",
            pageSize: 20,
            pageList: [20],  //pageList: [10, 25, 50, 100],
            pagination: true, // 是否分页
            sortable: false, // 是否启用排序
            sidePagination: "server",
            onlyInfoPagination:false,
            paginationPreText: "上一页",
            paginationNextText: "下一页",
            columns: [{
                field: 'fileName',
                title: '文件名称',
                width: 600
            }, {
                field:"archivedTime",
                title:"归档时间",
                width: 600
            },{
                field: 'id',
                title: '操作',
                width: 50,
                align: 'left',
                formatter: function(id) {
                    return '<a href="#" onclick="archivedLog.downLoadFile(\'' + id + '\')" title="下载"><span class="glyphicon glyphicon-download"></span></a>';
                }
            }]

        })
    },
    initEvent: function(){
        var self = this;
        self.obj.searchBtn.unbind().bind("click", function(){
            var fromTime = self.obj.fromTime.val();
            var endTime = self.obj.endTime.val();
            if(fromTime!=""&&endTime!=""){
                var fromNum = new Date(fromTime).getTime();
                var endNum = new Date(endTime).getTime();
                if(fromNum>endNum){
                    YunpiAlert.warning("请核对起止时间！");
                }else{
                    // TODO 调接口
                    self.obj.archivedTable.bootstrapTable("refresh");
                }
            }else{
                YunpiAlert.warning("请输入正确的时间！");
            }
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.fromTime.val("");
            self.obj.endTime.val("");
            self.obj.archivedTable.bootstrapTable("refresh");
        });
    },
    downLoadFile: function(id){
        YunpiAlert.info("正在下载...请稍候！");
        setTimeout(function(){
            if(Math.random()>0.5){
                YunpiAlert.success("下载成功！");
            }else{
                YunpiAlert.error("下载失败！");
            }
        }, 5500);
    }
}
$(function(){
    archivedLog.initArchivedLog();
})