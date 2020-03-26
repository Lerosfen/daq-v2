$package("dataPublish");

dataPublish = {
    initDataPublish: function(){
        this.obj = {
            dataPubLishTable: $("#dataPublishTable"),
            statusSel: $("select[name='statusSel']"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
            addBtn: $("#addBtn")
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
            type: 'GET',
            dataType: 'json',
            url: wwwroot + "/base/api/dictionary/db_source_status",
            async:false,
            success: function(res){
                if(res.code == 'code_200'){
                    self.data.statusDic = res.data.toDict("dicCode", true);
                    var data = res.data;
                    var len = data.length;
                    var html = "";
                    // 状态下拉框
                    for(var i = 0; i<len;i++){
                        html += `<option value=${data[i].dicCode}>${data[i].dicName}</option>`;
                    }
                    self.obj.statusSel.append(html);
                }
            },
            error: function(){
                YunpiAlert.error("状态字典查询失败");
            }
        })
        self.obj.dataPubLishTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/dataPublish',
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
                field: 'taskName',
                title: '任务名称',
                width: 500
            }, {
                field: 'modalName',
                title: '模型名称',
                width: 400
            },{
                field: 'modalTable',
                title: '模型表',
                width: 400,
            },{
                field: 'dataSourceName',
                title: '数据源名称',
                width: 400
            },{
                field: 'publishDataTable',
                title: '发布数据表',
                width: 400
            },{
                field: 'status',
                title: '状态',
                width: 200,
                formatter: function(val) {
                    return self.data.statusDic.getText(val, "dicName");
                }
            },{
                field:"createTime",
                title:"创建时间",
                width: 600
            },{
                field:"modifyTime",
                title:"修改时间",
                width: 600
            },{
                field: 'id',
                title: '操作',
                width: 350,
                align: 'left',
                formatter: function (value, row) {
                    var id = value;
                    var result = "";
                    result += '<a href="#" onclick="dataPublish.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                    if(row.status==1){//启用状态时显示禁用按钮
                        result += '<a href="#" onclick="dataPublish.forbidById(\'' + id + '\')" title="禁用"><span class="glyphicon glyphicon-off"></span></a>';
                    }else{//其它状态显示启用按钮
                        result += '<a href="#" onclick="dataPublish.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                    }
                    if(row.status==0){//编辑状态显示删除按钮
                        result += '<a href="#" onclick="dataPublish.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
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
                title: "",
                url: "",
                size: 600,
                sureBtn: true
            })
        })
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.dataPubLishTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.statusSel.val("");
            // TODO 调接口
            self.obj.dataPubLishTable.bootstrapTable("refresh");
        })
    },
    viewById: function(id){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + '/dataGovernance/dataPublish/' + id,
            success: function(res){
                if(res.code == "code_200"){
                    YunpiDialog.open({});
                }
            },
            error: function(){
                YunpiAlert.error(res.msg);
            }
        })
    },
    forbidById: function(id){
        var self = this;
        // TODO 调接口
        if(Math.random()>0.5){
            YunpiAlert.success("禁用成功！");
            self.obj.dataPubLishTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("禁用失败！");
        }
    },
    useById: function(id){
        var self = this;
        // TODO 调接口
        if(Math.random()>0.5){
            YunpiAlert.success("启用成功！");
            self.obj.dataPubLishTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("启用失败！");
        }
    },
    deleteById: function(id){
        var self = this;
        YunpiConform.open("您确定要删除该条任务吗?", null, function(){
            // TODO 调接口
            self.obj.dataPubLishTable.bootstrapTable("refresh");
            YunpiAlert.success("删除成功！");
        })
    }
};

$(function(){
    dataPublish.initDataPublish();
})