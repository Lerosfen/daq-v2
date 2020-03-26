/**
 * 数据源管理页面js
 */
$package("dataSource");
dataSource={
	/**
	 * 初始化方法
	 */
    initDataSource:function() {
		this.obj = {
            addDataSourceBtn : $('#addDataSourceBtn'),
            selectDataSourceBtn : $('#selectDataSourceBtn'),
            resetDataSourceBtn : $('#resetDataSourceBtn'),
            dataSourceName : $('#dataSourceName'),
            dataBaseIP : $('#dataBaseIP'),
            flag : $('#flag'),
            dataSourceTable : $('#dataSourceTable')
		};
		//定义当前页面的全局数据变量
		this.vars={
            statusArray:[],
            statusDic:[],
            dbTypesArray:[],
            dbTypesDic:[]
        };
		this.initDom();
        this.initEvent();//index页面事件初始化
	},
    /**
     * 页面初始化
     */
    initDom:function(){
        var self = this;
        /*获取状态编码字典*/
        YunpiLight.open();
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/db_source_status",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.statusArray = responseData.data;
                    self.vars.statusDic = responseData.data.toDict("dicCode",true);
                    //查询条件中的状态选择初始化
                    $.each(self.vars.statusArray,function(i,item){
                        self.obj.flag.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('状态字典查询失败！');
            }
        });
        /*获取数据库类型编码字典*/
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/db_types",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.dbTypesArray = responseData.data;
                    self.vars.dbTypesDic = responseData.data.toDict("dicCode",true);
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('数据库类型字典查询失败！');
            }
        });

        /*初始化表格*/
        self.obj.dataSourceTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/dataSource',
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
                    field: 'dataSourceName',
                    title: '数据源名称',
                    width: 500
                }, {
                    field: 'dataBaseName',
                    title: '数据库名称',
                    width: 400
                },{
                    field: 'dataBaseType',
                    title: '数据库类型',
                    width: 400,
                    formatter: function(value) {
                        return self.vars.dbTypesDic.getText(value,"dicName");
                    }
                },{
                    field: 'dataBaseIP',
                    title: '数据库IP',
                    width: 400
                },{
                    field: 'dataBasePort',
                    title: '数据库端口号',
                    width: 400
                },{
                    field: 'userName',
                    title: '数据库用户名',
                    width: 300
                },{
                    field: 'tableSpaceName',
                    title: '表空间',
                    width: 300
                },{
                    field: 'flag',
                    title: '状态',
                    width: 200,
                    formatter: function(value) {
                        return self.vars.statusDic.getText(value,"dicName");
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
                        result += '<a href="#" onclick="dataSource.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                        result += '<a href="#" onclick="dataSource.viewPwdById(\'' + id + '\')" title="查看密码"><span class="glyphicon glyphicon-eye-open"></span></a>';
                        result += '<a href="#" onclick="dataSource.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                        if(row.flag==1){//启用状态时显示禁用按钮
                            result += '<a href="#" onclick="dataSource.forbidById(\'' + id + '\')" title="禁用"><span class="glyphicon glyphicon-off"></span></a>';
                        }else{//其它状态显示启用按钮
                            result += '<a href="#" onclick="dataSource.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                        }
                        if(row.flag==0){//编辑状态显示删除按钮
                            result += '<a href="#" onclick="dataSource.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                        }
                        return result;
                    }
                }]
        });
        YunpiLight.close();
    },
	/**
	* 页面事件绑定
	*/
	initEvent:function() {
        var self = this;
        /**
         * 添加按钮
         */
        self.obj.addDataSourceBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"添加数据源",
				url:"dataSourceAdd.html",
                sureBtn:true,
                size:680,
                afterWinOpen:function(){
                    YunpiLight.open();
				    //表单数据初始化
				    $.each(self.vars.dbTypesArray,function(i,item){
                        $("#dataSourceAddForm select[name='dataBaseType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
				    //根据所选数据库的类型变换form内容
                    $("#dataSourceAddForm select[name='dataBaseType']").change(function(){
                        if($(this).val() == "oracle"){
                            $("#dataSourceAddForm input[name='tableSpaceName']").parent().show();
                        }else{
                            $("#dataSourceAddForm input[name='tableSpaceName']").val("");
                            $("#dataSourceAddForm input[name='tableSpaceName']").parent().hide();
                        }
                    });
                    //添加测试链接按钮事件
                    $("#checkDbLinkBtn").unbind().bind("click",function(){
                        var data = $('#dataSourceAddForm').getform();
                        //TODO 验证数据库连接
                        YunpiAlert.info("连接成功");
                    });
                    YunpiLight.close();
                },
                onSureClick:function(){
				    //TODO 提交信息
                    if($('#dataSourceAddForm').formVerify()){
                        var data = $('#dataSourceAddForm').getform();
                        YunpiAlert.success("数据源添加成功");
                        self.obj.dataSourceTable.bootstrapTable('refresh');
                        $('#dataSourceAddForm').clearform();
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
        self.obj.selectDataSourceBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            /*dataSourceName
                dataBaseIP
                flag*/
            self.obj.dataSourceTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetDataSourceBtn.unbind().bind("click", function () {
            self.obj.dataSourceName.val("");
            self.obj.dataBaseIP.val("");
            self.obj.flag.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.dataSourceTable.bootstrapTable('refresh');
        });
    },
    /**
     * 查看详情
     * @param id
     */
    viewById:function(id){
        var self = this;
        YunpiLight.open();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + "/dataGovernance/dataSource/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看数据源详情",
                        url:"dataSourceView.html",
                        sureBtn:false,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            //数据类型选择框初始化
                            $.each(self.vars.dbTypesArray,function(i,item){
                                $("#dataSourceViewForm select[name='dataBaseType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            //状态选择框初始化
                            $.each(self.vars.statusArray,function(i,item){
                                $("#dataSourceViewForm select[name='flag']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            $('#dataSourceViewForm').setform(responseData.data);
                            if(responseData.data.dataBaseType == "oracle"){
                                $("#dataSourceViewForm input[name='tableSpaceName']").parent().show();
                            }
                        },
                        beforeWinClose:function(){//关闭时清空form
                            $('#dataSourceViewForm').clearform();
                        }
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiLight.close();
                YunpiAlert.error('查询失败，请重试！');
            }
        });
    },
    /**
     * 根据ID查看数据源密码
     * @param id
     */
    viewPwdById:function(id){
        var self = this;
        YunpiDialog.open({
            title:"查看数据源密码",
            url:"dataSourceViewPwd.html",
            sureBtn:true,
            size:680,
            sureBtnName:"查看",
            coseleBtnName:"关闭",
            afterWinOpen:function(){//打开页面时赋值
                $('#dataSourceViewPwdForm').setform({id:id});
            },
            onSureClick:function(){
                //TODO 获取用户登录密码进行服务验证，用户密码正确时查询当前的数据源密码并加密返回
                if($('#dataSourceViewPwdForm').formVerify()){
                    var data = $('#dataSourceViewPwdForm').getform();
                    /*TODO
                    YunpiLight.close();
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        url: "",
                        data:data,
                        success: function (responseData) {
                            YunpiLight.close();
                            if (responseData.code == "code_200") {
                                $('#dataSourceViewPwdForm input[name="userPwd"]').val("yjcsxdl");
                            }else{
                                YunpiAlert.error(responseData.msg);
                            }
                        },
                        error: function () {
                            YunpiLight.close();
                            YunpiAlert.error('验证失败，请重试！');
                        }
                    });*/
                    $('#dataSourceViewPwdForm input[name="userPwd"]').val("yjcsxdl");
                }else{
                    YunpiAlert.warning("验证失败");
                }
            },
            beforeWinClose:function(){//关闭时清空form
                $('#dataSourceViewPwdForm').clearform();
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
        YunpiLight.open();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + "/dataGovernance/dataSource/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑数据源",
                        url:"dataSourceEdit.html",
                        sureBtn:true,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            //表单数据初始化
                            $.each(self.vars.dbTypesArray,function(i,item){
                                $("#dataSourceEditForm select[name='dataBaseType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            $('#dataSourceEditForm').setform(responseData.data);
                            if(responseData.data.dataBaseType == "oracle"){
                                $("#dataSourceEditForm input[name='tableSpaceName']").parent().show();
                            }
                            $('#dataSourceEditForm input[name="userPwd"]').val("······");
                            //根据所选数据库的类型变换form内容
                            $("#dataSourceEditForm select[name='dataBaseType']").change(function(){
                                if($(this).val() == "oracle"){
                                    $("#dataSourceEditForm input[name='tableSpaceName']").parent().show();
                                }else{
                                    $("#dataSourceEditForm input[name='tableSpaceName']").val("");
                                    $("#dataSourceEditForm input[name='tableSpaceName']").parent().hide();
                                }
                            });
                            //添加测试链接按钮事件
                            $("#checkDbLinkBtn").unbind().bind("click",function(){
                                var data = $('#dataSourceEditForm').getform();
                                //TODO 验证数据库连接
                                YunpiAlert.info("连接成功");
                            });
                        },
                        onSureClick:function(){
                            //TODO 获取修改数据进行验证，验证通过后提交信息，密码需要单独处理，如果密码是有效密码的后端进行保存，否则后端不进行密码修改
                            if($('#dataSourceEditForm').formVerify()){
                                var data = $('#dataSourceEditForm').getform();
                                YunpiAlert.success("数据源修改成功");
                                self.obj.dataSourceTable.bootstrapTable('refresh');
                                $('#dataSourceEditForm').clearform();
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
                YunpiLight.close();
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
        YunpiConform.open("您确定要删除该数据源吗?",null,function(){
            //TODO 根据ID删除信息，删除完成后刷新列表
            self.obj.dataSourceTable.bootstrapTable('refresh');
            YunpiAlert.success("删除成功！");
        });
    },
    /**
     * 根据ID禁用
     * @param id
     */
    forbidById:function(id){
        var self = this;
        YunpiConform.open("您确定要禁用该数据源吗?","禁用该数据源后，数据源将不可用，可能导致系统数据统计错误！",function(){
            //TODO 根据ID禁用信息，完成后刷新列表
            self.obj.dataSourceTable.bootstrapTable('refresh');
            YunpiAlert.success("禁用成功！");
        });
    },
    /**
     * 根据ID启用
     * @param id
     */
    useById:function(id){
        var self = this;
        //TODO 根据ID启用数据源信息，完成后刷新列表
        self.obj.dataSourceTable.bootstrapTable('refresh');
        YunpiAlert.success("启用成功！");
    }
};
$(function(){
    dataSource.initDataSource();
});