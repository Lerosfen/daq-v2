$package("loginLog");

loginLog = {
    initloginLog: function(){
        this.obj = {
            loginLogTable: $("#loginLogTable"),
            systemName: $("#systemName"),
            operateUser: $("#operateUser"),
            operateContent: $("#operateContent"),
            operateResult: $("#operateResult"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn")
        };
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        self.obj.loginLogTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/logManage/loginLog',
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
                field: 'operateUser',
                title: '操作人',
                width: 200
            }, {
                field:"systemName",
                title:"系统",
                width: 200
            },{
                field: "operateContent",
                title: "操作内容",
                width: 200
            },{
                field: "operateTime",
                title: "操作时间",
                width: 400
            },
            {
                field: "operateResult",
                title: "操作结果",
                width: 100
            },
            {
                field: "clientIP",
                title: "客户端IP",
                width: 200
            },
            {
                field: "operateDesc",
                title: "操作描述",
                width: 900
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.loginLogTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.systemName.val("");
            self.obj.operateUser.val("");
            self.obj.operateContent.val("");
            self.obj.operateResult.val("");
            self.obj.loginLogTable.bootstrapTable("refresh");
        })
    }
};

$(function(){
    loginLog.initloginLog();
})