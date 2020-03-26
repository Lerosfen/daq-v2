$package("daqHistoryLog");

daqHistoryLog = {
    initDaqHistoryLog: function(){
        this.obj = {
            FTPRealTimeTable: $("#FTPRealTimeTable"),
            FTPHistoryTable: $("#FTPHistoryTable"),
            stRealTimeTable: $("#stRealTimeTable"),
            stHistoryTable: $("#stHistoryTable"),
            navTabs: $(".nav-tabs")
        };
        this.initDom();
        this.initEvent();
    },
    initTable: function(tbl, url, columns){
        tbl.bootstrapTable({data: []});
        tbl.bootstrapTable("showLoading");
        setTimeout(function(){
            tbl.bootstrapTable("destroy");
            tbl.bootstrapTable({
                method : 'POST',
                url: wwwroot + url,
                toolbar: "#toolbar",
                height:$(window).height()-135,
                striped: false,
                cache: false,
                uniqueId: "id",
                pageSize: 20,
                pageList: [20],
                pagination: true,
                sortable: false,
                sidePagination: "server",
                onlyInfoPagination:false,
                paginationPreText: "上一页",
                paginationNextText: "下一页",
                columns: columns
            });
            tbl.bootstrapTable("hideLoading");
        }, 0);
    },
    initDom: function(){
        var self = this;
        // FTP实时记录
        self.initTable(self.obj.FTPRealTimeTable, "/dataGoverance/FTPRealTimeLog", [{
            field: 'taskName',
            title: '任务名称',
            width: 200
        }, {
            field:"startTime",
            title:"开始时间",
            width: 400
        },{
            field: "endTime",
            title: "结束时间",
            width: 400
        },{
            field: "expendTime",
            title: "耗时(秒)",
            width: 100
        },{
            field: "progressStatus",
            title: "进度状态",
            width: 300,
            formatter: function(value){
                return `<div class="progress">
                                   <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: ${value}%">                 
                                        <span>${value}%</span>
                                   </div>
                            </div>`;
            }
        },{
            field: "runResult",
            title: "运行结果",
            width: 100
        },{
            field: "daqfileCount",
            title: "本次采集文件数(个)",
            width: 100
        }]);
    },
    initEvent: function(){
        var self =this;
        self.obj.navTabs.on("click", "li", function(){
            var currentTbl = $(this).children().attr('tbl-name');
            switch (currentTbl) {
                case "FTPRealTimeTable":
                    self.initDom();
                    break;
                case "FTPHistoryTable":
                    // FTP历史记录
                    self.initTable(self.obj.FTPHistoryTable, "/dataGoverance/FTPHistoryLog", [{
                        field: 'taskName',
                        title: '任务名称',
                        width: 200
                    }, {
                        field:"startTime",
                        title:"开始时间",
                        width: 400
                    },{
                        field: "endTime",
                        title: "结束时间",
                        width: 400
                    },{
                        field: "expendTime",
                        title: "耗时(秒)",
                        width: 100
                    },{
                        field: "runResult",
                        title: "运行结果",
                        width: 100
                    },{
                        field: "daqfileCount",
                        title: "本次采集文件数(个)",
                        width: 100
                    }])
                    break;
                case "stRealTimeTable":
                    // 库表实时记录
                    self.initTable(self.obj.stRealTimeTable, "/dataGoverance/stRealTimeLog", [{
                        field: 'taskName',
                        title: '任务名称',
                        width: 200
                    }, {
                        field:"startTime",
                        title:"开始时间",
                        width: 400
                    },{
                        field: "endTime",
                        title: "结束时间",
                        width: 400
                    },{
                        field: "expendTime",
                        title: "耗时(秒)",
                        width: 100
                    },{
                        field: "progressStatus",
                        title: "进度状态",
                        width: 300,
                        formatter: function(value){
                            return `<div class="progress">
                                   <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: ${value}%">                 
                                        <span>${value}%</span>
                                   </div>
                            </div>`;

                        }
                    },{
                        field: "runResult",
                        title: "运行结果",
                        width: 100
                    },{
                        field: "daqfileCount",
                        title: "本次采集文件数(个)",
                        width: 100
                    }]);
                    break;
                case "stHistoryTable":
                    // 库表历史记录
                    self.initTable(self.obj.stHistoryTable, "/dataGoverance/stHistoryLog",  [{
                        field: 'taskName',
                        title: '任务名称',
                        width: 200
                    }, {
                        field:"startTime",
                        title:"开始时间",
                        width: 400
                    },{
                        field: "endTime",
                        title: "结束时间",
                        width: 400
                    },{
                        field: "expendTime",
                        title: "耗时(秒)",
                        width: 100
                    },{
                        field: "runResult",
                        title: "运行结果",
                        width: 100
                    },{
                        field: "daqfileCount",
                        title: "本次采集文件数(个)",
                        width: 100
                    }])
                    break;
            }
        })
    }
};

$(function(){
    daqHistoryLog.initDaqHistoryLog();
})