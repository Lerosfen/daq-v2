$package("wsDataDaq");

wsDataDaq = {
    initWsDataDaq: function(){
        this.obj = {
            wsDataDaqTable: $("#wsDataDaqTable"),
            wsName: $("#wsName"),
            ipSel: $("#ipSel"),
            addBtn: $("#addBtn"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn")
        };
        this.data = {
            statusDic: []
        }
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        $.ajax({
            type: "GET",
            dataType: 'json',
            url: wwwroot + '/base/api/dictionary/db_types',
            async: false,
            success: function(res){
                if(res.code == "code_200"){
                    $.each(res.data, function(i, item){
                        self.obj.ipSel.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                }
            }
        });
        $.ajax({
            type: "GET",
            dataType: 'json',
            url: wwwroot + '/base/api/dictionary/db_source_status',
            async: false,
            success: function(res){
                if(res.code == "code_200"){
                    self.data.statusDic = res.data.toDict("dicCode", true);
                }
            }
        });
        self.obj.wsDataDaqTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/wsDataDaq',
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
                field: 'wsName',
                title: '接口名称',
                width: 500
            }, {
                field: 'wsCode',
                title: '接口编码',
                width: 400
            },{
                field: 'wsStatus',
                title: '接口状态',
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
                    result += '<a href="#" onclick="wsDataDaq.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                    result += '<a href="#" onclick="wsDataDaq.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                    if(row.wsStatus==1){//启用状态时显示禁用按钮
                        result += '<a href="#" onclick="wsDataDaq.forbidById(\'' + id + '\')" title="禁用"><span class="glyphicon glyphicon-off"></span></a>';
                    }else{//其它状态显示启用按钮
                        result += '<a href="#" onclick="wsDataDaq.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                    }
                    if(row.wsStatus==0){//编辑状态显示删除按钮
                        result += '<a href="#" onclick="wsDataDaq.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                    }
                    return result;
                }
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.wsDataDaqTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.wsName.val("");
            self.obj.ipSel.val("");
            self.obj.wsDataDaqTable.bootstrapTable("refresh");
        });
        self.obj.addBtn.unbind().bind("click", function(){
            YunpiDialog.open({
                title: "添加接口采集",
                url: "addWebServiceDaq.html",
                size: 600,
                sureBtn: true,
                afterWinOpen: function(){
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: wwwroot+'/dataGovernance/metaData',
                        success: function(res){
                            var data = res.data;
                            var html = "";
                            $.each(data, function(i , item){
                                html += '<tr><td>'+ item.metaDataField + '</td><td>'+item.metaDataDesc+ '</td><td><input type="text" class="form-control"></td></tr>'
                            });
                            $(html).appendTo($("#addDaqTable"));
                        }
                    })
                },
                onSureClick: function(){
                    if($("#addWebServiceDaqFrom").formVerify()){
                        YunpiAlert.success("接口采集添加成功！");
                        $("#addWebServiceDaqFrom").clearform();
                        YunpiDialog.close();
                        self.obj.wsDataDaqTable.bootstrapTable("refresh");
                    }else{
                        YunpiAlert.warning("提交失败，参数校验不通过！");
                    }
                }
            })
        })
    },
    viewById: function(id){
        var self = this;
        YunpiDialog.open({
            title: "查看接口采集",
            url: "viewWebServiceDaq.html",
            size: 600,
            sureBtn: false,
            afterWinOpen: function(){
                $.ajax({
                    type: "GET",
                    dataType: "JSON",
                    url: wwwroot+'/dataGovernance/wsDataDaq/' + id,
                    success: function(res){
                        var cols = res.data.cols;
                        $("#viewWebServiceDaqFrom").setform(res.data);
                        var html = "";
                        $.each(cols, function(i, item){
                            html += '<tr><td>'+ item.metaDataField + '</td><td>'+item.metaDataDesc+ '</td><td><input type="text" readonly="readonly" class="form-control" value="'+ item.mapData +'"></td></tr>'
                        });
                        $(html).appendTo($("#addDaqTable"));
                    }
                })
            }
        })
    },
    editById: function(id){
        var self = this;
        YunpiDialog.open({
            title: "编辑接口采集",
            url: "addWebServiceDaq.html",
            size: 600,
            sureBtn: true,
            afterWinOpen: function(){
                $.ajax({
                    type: "GET",
                    dataType: "JSON",
                    url: wwwroot+'/dataGovernance/wsDataDaq/' + id,
                    success: function(res){
                        var cols = res.data.cols;
                        $("#addWebServiceDaqFrom").setform(res.data);
                        var html = "";
                        $.each(cols, function(i, item){
                            html += '<tr><td>'+ item.metaDataField + '</td><td>'+item.metaDataDesc+ '</td><td><input type="text" class="form-control" value="'+ item.mapData +'"></td></tr>'
                        });
                        $(html).appendTo($("#addDaqTable"));
                    }
                })
            },
            onSureClick: function(){
                if($("#addWebServiceDaqFrom").formVerify()){
                    YunpiAlert.success("接口采集编辑成功！");
                    $("#addWebServiceDaqFrom").clearform();
                    YunpiDialog.close();
                    self.obj.wsDataDaqTable.bootstrapTable("refresh");
                }else{
                    YunpiAlert.warning("提交失败，参数校验不通过！");
                }
            }
        })
    },
    deleteById: function(id){
        var self = this;
        YunpiConform.open("您确定要删除该接口采集信息吗?",null,function(){
            //TODO 根据ID删除信息，删除完成后刷新列表
            self.obj.wsDataDaqTable.bootstrapTable('refresh');
            YunpiAlert.success("删除成功！");
        });
    },
    useById: function(id){
        var self = this;
        self.obj.wsDataDaqTable.bootstrapTable('refresh');
        YunpiAlert.success("启用成功！");
    },
    forbidById: function(id){
        var self = this;
        YunpiConform.open("您确定要禁用该接口采集吗?","禁用该信息后，接口将不可用，可能导致系统数据统计错误！",function(){
            self.obj.wsDataDaqTable.bootstrapTable('refresh');
            YunpiAlert.success("禁用成功！");
        });
    }
};

$(function(){
    wsDataDaq.initWsDataDaq();
})