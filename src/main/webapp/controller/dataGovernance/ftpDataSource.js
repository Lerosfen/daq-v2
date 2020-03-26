$package("ftpDataSource");

ftpDataSource = {
    initFtpDataSource: function(){
        this.obj = {
            ftpDataSourceTable: $("#ftpDataSourceTable"),
            addBtn: $("#addBtn"),
            ftpDataSourceName: $("#ftpDateSourceName"),
            IPAddressSel: $("#IPAddressSel"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn")
        };
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + '/base/api/dictionary/db_types',
            async: false,
            success: function(res){
                if(res.code == "code_200"){
                    $.each(res.data, function(i, item){
                        self.obj.IPAddressSel.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                    })
                }
            }
        })
        self.obj.ftpDataSourceTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/ftpDataSource',
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
                field: 'ftpDataSourceName',
                title: '名称',
                width: 500
            }, {
                field: 'IPAddress',
                title: 'IP地址',
                width: 400
            },{
                field: 'port',
                title: '端口号',
                width: 400
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
                width: 200,
                align: 'left',
                formatter: function (id) {
                    var result = "";
                    result += '<a href="#" onclick="ftpDataSource.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                    result += '<a href="#" onclick="ftpDataSource.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                    result += '<a href="#" onclick="ftpDataSource.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                    return result;
                }
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.addBtn.unbind().bind("click", function(){
            YunpiDialog.open({
                title: "FTP数据源-添加",
                url: "ftpDataSourceAdd.html",
                sureBtn: true,
                size: 700,
                onSureClick: function(){
                    if($("#ftpDataSourceForm").formVerify()){
                        YunpiAlert.success("添加成功！");
                        $("#ftpDataSourceForm").clearform();
                        YunpiDialog.close();
                        self.obj.ftpDataSourceTable.bootstrapTable("refresh");
                    }else{
                        YunpiAlert.warning("提交失败, 参数校验不通过！");
                    }
                }
            })
        });
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.ftpDataSourceTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.ftpDataSourceName.val("");
            self.obj.IPAddressSel.val("");
            self.obj.ftpDataSourceTable.bootstrapTable("refresh");
        })
    },
    viewById: function(id){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + "/dataGovernance/ftpDataSource/" + id,
            success: function(res){
                if(res.code == "code_200"){
                    YunpiDialog.open({
                        title: "FTP数据源-查看详情",
                        url: "ftpDataSourceView.html",
                        size: 700,
                        sureBtn: false,
                        afterWinOpen: function(){
                            $('#dataSourceViewForm').setform(res.data);
                            $("input[name='passWord']").val("");
                            $("#showPwd").unbind().bind("click", function(){
                                $('#dataSourceViewForm').setform(res.data);
                            })
                        },
                        beforeWinClose: function(){
                            $('#dataSourceViewForm').clearform();
                        }
                    })
                }
            }
        })
    },
    deleteById: function(id){
        var self = this;
        YunpiConform.open("您确定要删除该FTP数据源吗？", null, function(){
            // TODO 接口
            YunpiAlert.success("删除成功！");
            self.obj.ftpDataSourceTable.bootstrapTable("refresh");
        })
    },
    editById: function(id){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + "/dataGovernance/ftpDataSource/" + id,
            success: function(res){
                YunpiDialog.open({
                    title: "FTP数据源-编辑",
                    url: "ftpDataSourceAdd.html",
                    size: 700,
                    sureBtn: true,
                    afterWinOpen: function(){
                        $('#dataSourceAddForm').setform(res.data);
                    },
                    onSureClick: function(){
                        if($('#dataSourceAddForm').formVerify()){
                            YunpiAlert.success("编辑成功！");
                            $('#dataSourceAddForm').clearform();
                            YunpiDialog.close();
                            self.obj.ftpDataSourceTable.bootstrapTable("refresh");
                        }else{
                            YunpiAlert.warning("提交失败, 参数校验不通过！");
                        }
                    }
                })
            }
        })
    }
};

$(function(){
    ftpDataSource.initFtpDataSource();
})