/**
 * 配置管理页面js
 */
$package("configuration");
configuration={
	/**
	 * 初始化方法
	 */
    initConfiguration:function() {
		this.obj = {
            addConfigBtn : $('#addConfigBtn'),
            selectConfigBtn : $('#selectConfigBtn'),
            resetConfigBtn : $('#resetConfigBtn'),
            configName : $('#configName'),
            configurationTable : $('#configurationTable')
		};
		this.initDom();
        this.initEvent();//index页面事件初始化
	},
    /**
     * 页面初始化
     */
    initDom:function(){
        var self = this;
        self.obj.configurationTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/basic/configuration',
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
                    field: 'confName',
                    title: '配置名称',
                    width: 500
                }, {
                    field: 'confCode',
                    title: '配置编码',
                    width: 900
                },{
                    field: 'confValue',
                    title: '配置值',
                    width: 900
                },{
                    field: 'confDesc',
                    title: '配置描述',
                    width: 900
                },{
                    field:"createTime",
                    title:"创建时间",
                    width: 950
                },{
                    field:"modifyTime",
                    title:"修改时间",
                    width: 950
                },{
                    field: 'id',
                    title: '操作',
                    width: 350,
                    align: 'left',
                    formatter: function(value, row, index) {
                        var id = value;
                        var result = "";
                        result += '<a href="#" onclick="configuration.viewById(\'' + id + '\')" title="查看"><span class="glyphicon glyphicon-search"></span></a>';
                        result += '<a href="#" onclick="configuration.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                        result += '<a href="#" onclick="configuration.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                        return result;
                    }
                }]
        });
    },
	/**
	* 页面事件绑定
	*/
	initEvent:function() {
        var self = this;
        /**
         * 添加按钮
         */
        self.obj.addConfigBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"添加配置",
				url:"configurationAdd.html",
                sureBtn:true,
                size:680,
                onSureClick:function(){
				    //TODO 提交信息
                    if($('#confAddForm').formVerify()){
                        var data = $('#confAddForm').getform();
                        YunpiAlert.success("配置添加成功");
                        self.obj.configurationTable.bootstrapTable('refresh');
                        $('#confAddForm').clearform();
                        YunpiDialog.close();
                    }else{
                        YunpiAlert.warning("提交失败，参数校验不通过");
                    }
                }
			});
        });
        /**
         * 查询按钮
         */
        self.obj.selectConfigBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            self.obj.configurationTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetConfigBtn.unbind().bind("click", function () {
            self.obj.configName.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.configurationTable.bootstrapTable('refresh');
        });
    },
    /**
     * 查看详情
     * @param id
     */
    viewById:function(id){
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + "/basic/configuration/"+id,
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看配置详情",
                        url:"configurationView.html",
                        sureBtn:false,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            $('#confViewForm').setform(responseData.data);
                        },
                        beforeWinClose:function(){//关闭时清空form
                            $('#confViewForm').clearform();
                        }
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('查询失败，请重试！');
            }
        });
    },
    /**
     * 编辑
     * @param id
     */
    editById:function(id){
        var self = this;
        //根据ID查询要修改的数据
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + "/basic/configuration/"+id,
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑配置",
                        url:"configurationEdit.html",
                        sureBtn:true,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            $('#confEditForm').setform(responseData.data);
                        },
                        onSureClick:function(){
                            //TODO 获取修改数据进行验证，验证通过后提交信息
                            if($('#confEditForm').formVerify()){
                                var data = $('#confEditForm').getform();
                                YunpiAlert.success("配置修改成功");
                                self.obj.configurationTable.bootstrapTable('refresh');
                                $('#confEditForm').clearform();
                                YunpiDialog.close();
                            }else{
                                YunpiAlert.warning("提交失败，参数校验不通过");
                            }
                        }
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('查询失败，请重试！');
            }
        });
    },
    /**
     * 删除
     * @param id
     */
    deleteById:function(id){
        var self = this;
        YunpiConform.open("您确定要删除该配置吗?","删除该配置后，系统将使用默认配置值运行，可能导致系统不稳定！",function(){
            //TODO 根据ID删除配置信息，删除完成后刷新列表
            self.obj.configurationTable.bootstrapTable('refresh');
            YunpiAlert.success("删除成功！");
        });
    }
};
$(function(){
    configuration.initConfiguration();
});