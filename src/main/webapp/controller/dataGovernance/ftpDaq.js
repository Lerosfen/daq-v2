$package("ftpDaq");

ftpDaq = {
    initftpDaq: function(){
        this.obj = {
            ftpDaqTable: $("#ftpDaqTable"),
            addBtn: $("#addBtn"),
            strategyName: $("#strategyName"),
            statusSel: $("#statusSel"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
        };
        this.data ={
            statusDic: []
        };
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + '/base/api/dictionary/db_source_status',
            async: false,
            success: function(res){
                if(res.code == "code_200"){
                    self.data.statusDic = res.data.toDict("dicCode", true);
                    $.each(self.data.statusDic, function(i, item){
                        self.obj.statusSel.append('<option value="'+item.dicCode+'">'+item.dicName+'</option>')
                    })
                }
            },

        })
        self.obj.ftpDaqTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/ftpDaq',
            //queryParams: "queryParams",
            toolbar: "#toolbar",
            height:$(window).height()-100,
            striped: false, // 是否显示行间隔色
            cache: false,//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            uniqueId: "id",
            pageSize: 20,
            pageList: [20],  //pageList: [10, 25, 50, 100],
            pagination: true, // 是否分页
            sortable: false, // 是否启用排序
            rightFixedColumns:true,
            rightFixedNumber:1,
            sidePagination: "server",
            onlyInfoPagination:false,
            paginationPreText: "上一页",
            paginationNextText: "下一页",
            columns: [{
                field: 'strategyName',
                title: '策略名称',
                width: 500
            }, {
                field: 'colMethods',
                title: '采集方式',
                width: 400
            },{
                field: 'timeRules',
                title: '定时规则',
                width: 400
            },{
                field: 'taskStatus',
                title: '任务状态',
                width: 400,
                formatter: function(value) {
                    return self.data.statusDic.getText(value,"dicName");
                }
            },{
                field:"createTime",
                title:"创建时间",
                width: 350
            },{
                field:"modifyTime",
                title:"修改时间",
                width: 350
            },{
                field: 'id',
                title: '操作',
                width: 350,
                align: 'left',
                formatter: function (value, row, index) {
                    var id = value;
                    var result = "";
                    result += '<a href="#" onclick="ftpDaq.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                    result += '<a href="#" onclick="ftpDaq.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                    if(row.taskStatus==1){//启用状态时显示禁用按钮
                        result += '<a href="#" onclick="ftpDaq.forbidById(\'' + id + '\')" title="禁用"><span class="glyphicon glyphicon-off"></span></a>';
                        result += '<a href="#" onclick="ftpDaq.execute(\'' + id + '\')" title="执行"><span class="glyphicon execute"></span></a>';
                        result += '<a href="#" onclick="ftpDaq.viewData(\'' + id + '\')" title="查看数据"><span class="glyphicon view-data"></span></a>';
                    }else{//其它状态显示启用按钮
                        result += '<a href="#" onclick="ftpDaq.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                    }
                    if(row.taskStatus==0){//编辑状态显示删除按钮
                        result += '<a href="#" onclick="ftpDaq.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                    }
                    return result;
                }
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.addBtn.unbind().bind("click", function(){
            YunpiDialog.open({
                title: "FTP采集-添加",
                url: "ftpDaqAdd.html",
                sureBtn: true,
                size: 700,
                afterWinOpen: function(){
                    // 加载cron插件
                    $("#cron").cronGen({
                        direction : 'right'
                    });
                    $("#ftpDaqAddForm").children().eq(7).css({
                        marginTop: '-31px',
                        marginLeft: '326px'
                    });
                    $("#ftpDaqAddForm").children().eq(7).children(":first").attr('readonly', true);
                    $("div.popover-inner").mouseleave(function(){
                        $(this).hide();
                    });
                    $("input[name='isInc']").change(function(){
                        if(this.value==1){
                            $("#incMethods").show();
                        }else{
                            $("#incMethods").hide();
                        }
                    });
                    $("input[name='isTimer']").change(function(){
                        if(this.value==0){
                            $("#cron").show();
                            $("#timerRules").show();
                        }else{
                            $("#cron").hide();
                            $("#timerRules").hide();
                        }
                    });
                },
                onSureClick: function(){
                    if($("#ftpDaqAddForm").formVerify()){
                        YunpiAlert.success("添加成功");
                        $("#ftpDaqAddForm").clearform();
                        YunpiDialog.close();
                        self.obj.ftpDaqTable.bootstrapTable("refresh");
                    }else{
                        YunpiAlert.warning("提交失败，参数校验不通过！");
                    }
                },
                beforeWinClose: function(){
                    $("#ftpDaqAddForm").clearform();
                }
            });
        });
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.ftpDaqTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.strategyName.val("");
            self.obj.statusSel.val("");
            self.obj.ftpDaqTable.bootstrapTable("refresh");
        });
    },
    viewById: function(){
        var self = this;
        YunpiDialog.open({
            title: "查看FTP采集策略",
            url: "ftpDaqView.html",
            sureBtn: false,
            size: 700,
            afterWinOpen: function(){
                $("#ftpDaqAddForm").find("input[type='text']").attr("readonly", true);
                $("#ftpDaqAddForm").find("input[type='radio']").attr("disabled", true);
                $("input[name='strategyName']").val("策略XXX");
                $("input[name='catalog']").val("XXX");
                $("input[name='timerRules']").val("0 0 0/5 * * *");
            },
            beforeWinClose: function(){
                $("#ftpDaqAddForm").clearform();
            }
        });
    },
    editById: function(id){
        var self = this;
        YunpiDialog.open({
            title: "编辑FTP采集策略",
            url: "ftpDaqAdd.html",
            sureBtn: true,
            size: 700,
            afterWinOpen: function(){
                console.log($("#ftpDaqAddForm").find('input'));
                $("input[name='strategyName']").val("策略XXX");
                $("input[name='catalog']").val("XXX");
                // 加载cron插件
                $("#cron").cronGen({
                    direction : 'right'
                });
                $("#ftpDaqAddForm").children().eq(7).children(":first").val("0 0 0/5 * * *");
                $("#ftpDaqAddForm").children().eq(7).css({
                    marginTop: '-31px',
                    marginLeft: '326px'
                });
                $("#ftpDaqAddForm").children().eq(7).children(":first").attr('readonly', true);
                $("div.popover-inner").mouseleave(function(){
                    $(this).hide();
                });
                $("input[name='isInc']").change(function(){
                    if(this.value==1){
                        $("#incMethods").show();
                    }else{
                        $("#incMethods").hide();
                    }
                });
                $("input[name='isTimer']").change(function(){
                    if(this.value==0){
                        $("#cron").show();
                        $("#timerRules").show();
                    }else{
                        $("#cron").hide();
                        $("#timerRules").hide();
                    }
                });
            },
            onSureClick: function(){
                if($("#ftpDaqAddForm").formVerify()){
                    YunpiAlert.success("编辑成功");
                    $("#ftpDaqAddForm").clearform();
                    YunpiDialog.close();
                    self.obj.ftpDaqTable.bootstrapTable("refresh");
                }else{
                    YunpiAlert.warning("提交失败，参数校验不通过！");
                }
            },
            beforeWinClose: function(){
                $("#ftpDaqAddForm").clearform();
            }
        });
    },
    viewData: function(id){
        $.ajax({
            type: 'get',
            dataType: 'json',
            async: false,
            url: wwwroot + "/Obtain/ObtainHeader/"+id,
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看ftp采集策略数据",
                        url:"ftpDaqResult.html",
                        sureBtn:false,
                        size:1200,
                        afterWinOpen:function(){//打开页面时赋值
                            $("#CleanResultsName").val("策略XXX");
                            $("#CleaningResultsTable").bootstrapTable({data:[]});
                            $("#CleaningResultsTable").bootstrapTable("showLoading");
                            setTimeout(function(){
                                $("#CleaningResultsTable").bootstrapTable('destroy');
                                $("#CleaningResultsTable").bootstrapTable({
                                    method : 'POST',
                                    url: wwwroot + '/cleanRule/TableData',
                                    // toolbar: "#toolbar",
                                    height:$(window).height()-340,
                                    striped: true, // 是否显示行间隔色
                                    uniqueId: "id",
                                    pageSize: 20,
                                    pageList: [20],
                                    pagination: true, // 是否分页
                                    sortable: false, // 是否启用排序
                                    sidePagination: "server",
                                    onlyInfoPagination:false,
                                    paginationPreText: "上一页",
                                    paginationNextText: "下一页",
                                    columns:responseData.columns
                                });
                                $("#CleaningResultsTable").bootstrapTable("hideLoading");
                            },1000);
                        },
                        beforeWinClose:function(){//关闭时清空form
                            // $('#dicViewForm').clearform();
                        }
                    });
                }else{
                    // YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('查询失败，请重试！');
            }
        });
    },
    forbidById:function(id){
        var self = this;
        YunpiConform.open("您确定要禁用该FTP采集策略吗?",null,function(){
            YunpiAlert.success("禁用成功！");
            self.obj.ftpDaqTable.bootstrapTable("refresh");
        });
    },
    useById:function(id){
        var self = this;
        YunpiAlert.success("启用成功！");
        self.obj.ftpDaqTable.bootstrapTable("refresh");
    },
    execute: function(id){
        var self = this;
        YunpiAlert.success("执行成功！");
        self.obj.ftpDaqTable.bootstrapTable("refresh");
    },
    deleteById:function(id){
        var self = this;
        YunpiConform.open("您确定要删除该FTP采集策略吗??",null,function(){
            YunpiAlert.success("删除成功！");
            self.obj.ftpDaqTable.bootstrapTable("refresh");
        });
    },
};

$(function(){
    ftpDaq.initftpDaq();
})