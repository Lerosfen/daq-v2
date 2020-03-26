$package("systemJoins");
systemJoins = {
    initsystemJoins: function(){
        var self = this;
        self.obj = {
            addBtn: $('#addBtn'),
            sysTable: $('#sysTable'),
            statusSel: $("#statusSel"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
            sysName: $("#sysName")
        };
        self.data = {
            statusDic: []
        }
        self.initDom();
        self.initEvent();
    },
    initDom: function(){
        var self = this;
        $.ajax({
            type: 'get',
            dataType: 'json',
            async: false,
            url: wwwroot + "/base/api/dictionary/db_source_status",
            success: function(res){
                if(res.code == 'code_200'){
                    self.data.statusDic = res.data.toDict('dicCode', true);
                    var data = res.data;
                    var len = data.length;
                    var html = "";
                    // 状态下拉框
                    for(var i = 0; i<len;i++){
                        html += `<option value=${data[i].dicCode}>${data[i].dicName}</option>`;
                    }
                    self.obj.statusSel.append(html);
                }else{
                    YunpiAlert.error(res.msg);
                }
            },
            error: function(){
                YunpiAlert.error("状态字典查询失败")
            }
        })
        self.obj.sysTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/logManage/systemJoins',
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
                field: 'sysName',
                title: '系统名称',
                width: 300
            }, {
                field: 'sysCode',
                title: '系统编码',
                width: 300
            },{
                field: 'status',
                title: '状态',
                width: 300,
                formatter: function(val){
                    return self.data.statusDic.getText(val, 'dicName');
                }
            },{
                field: 'desc',
                title: '描述',
                width: 800
            },{
                field:"createTime",
                title:"创建时间",
                width: 400
            },{
                field:"modifyTime",
                title:"修改时间",
                width: 400
            },{
                field: 'id',
                title: '操作',
                width: 250,
                align: 'left',
                formatter: function(value, row, index) {
                    var id = value;
                    var result = "";
                    result += '<a href="#" onclick="systemJoins.viewById(\'' + id + '\')" title="查看"><span class="glyphicon glyphicon-search"></span></a>';
                    result += '<a href="#" onclick="systemJoins.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                    if(row.status == 1){ // 启用状态
                        result += '<a href="#" onclick="systemJoins.endById(\'' + id + '\' )" title="禁用"><span class="glyphicon glyphicon-ban-circle"></span></a>';
                    }else{
                        result += '<a href="#" onclick="systemJoins.startById(\'' + id + '\' )" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                    }
                    if(row.status == 0){ // 编辑状态
                        result += '<a href="#" onclick="systemJoins.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                    }
                    return result;
                }
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.addBtn.unbind().bind('click', function(){
            YunpiDialog.open({
                title: '日志系统接入-添加',
                url: 'systemJoinsAdd.html',
                sureBtn: true,
                size: 700,
                onSureClick: function(){
                    if($('#systemAddForm').formVerify()){
                        var data = $('#systemAddForm').getform();
                        YunpiAlert.success('添加成功！');
                        self.obj.sysTable.bootstrapTable("refresh");
                        $('#systemAddForm').clearform();
                        YunpiDialog.close();
                    }else{
                        YunpiAlert.warning("提交失败，参数校验不通过！")
                    }
                }
            })
        });
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
           self.obj.sysTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.sysName.val("");
            self.obj.statusSel.val("");
            self.obj.sysTable.bootstrapTable("refresh");
        })
    },
   // 删除
    deleteById: function(){
        var self = this;
        YunpiConform.open("您确定要删除该系统吗?", "删除系统后会导致系统故障，请谨慎！", function(){
            self.obj.sysTable.bootstrapTable("refresh");
            YunpiAlert.success('删除成功!');
        })
    },
    // 编辑
    editById: function(id){
        var self = this;
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + '/logManage/systemJoins/' + id,
            success: function(res){
                if(res.code == 'code_200'){
                    YunpiDialog.open({
                        title: '日志系统接入-编辑',
                        url: 'systemJoinsEdit.html',
                        size: 700,
                        sureBtn: true,
                        afterWinOpen: function(){
                            $('#systemEditForm').setform(res.data);
                        },
                        onSureClick: function(){
                            if($("#systemEditForm").formVerify()){
                                var data = $("#systemEditForm").getform();
                                YunpiAlert.success("修改成功");
                                self.obj.sysTable.bootstrapTable("refresh");
                                $("#systemEditForm").clearform();
                                YunpiDialog.close();
                            }else{
                                YunpiAlert.warning("提交失败，参数校验不通过！")
                            }
                        }
                    })
                }
            }
        })
    },
    // 查看
    viewById: function(id){
        var self = this;
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + '/logManage/systemJoins/' + id,
            success: function(res){
                if(res.code == 'code_200'){
                    YunpiDialog.open({
                        title: '日志系统接入-查看',
                        url: 'systemJoinsView.html',
                        size: 700,
                        afterWinOpen: function(){
                            $('#systemViewForm').setform(res.data);
                        },
                        beforeWinClose: function(){
                            $('#systemViewForm').clearform();
                        }
                    });
                }
            }
        })
    },
    startById: function(){
        var self = this;
        if(Math.random()>0.5){
            YunpiAlert.success('启用成功');
            self.obj.sysTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("启用失败");
        }
    },
    endById: function(){
        var self = this;
        if(Math.random()>0.5){
            YunpiAlert.success('禁用成功');
            self.obj.sysTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("禁用失败");
        }
    }
}
$(function(){
    systemJoins.initsystemJoins();
})