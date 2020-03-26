$package("exceptionLog");

exceptionLog = {
    initExceptionLog: function(){
        this.obj = {
            exceptionTable: $("#exceptionTable"),
            operateUser: $("#operateUser"),
            exceptionContent: $("#exceptionContent"),
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
        self.obj.exceptionTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/logManage/exceptionLog',
            //queryParams: "queryParams",
            toolbar: "#toolbar",
            height:$(window).height()-100,
            striped: false, // 是否显示行间隔色
            cache: false,//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
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
                field: 'operateTime',
                title: '操作时间',
                width: 250
            }, {
                field:"operateUser",
                title:"操作人",
            },{
                field: "exceptionDesc",
                title: "异常描述",
                width: 1500
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.exceptionTable.bootstrapTable("refresh")
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.operateUser.val("");
            self.obj.exceptionContent.val("");
            self.obj.fromTime.val("");
            self.obj.endTime.val("");
            self.obj.exceptionTable.bootstrapTable("refresh")
        });

    }
};

$(function(){
    exceptionLog.initExceptionLog()
})

