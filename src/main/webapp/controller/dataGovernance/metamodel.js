/**
 * 元模型管理页面js
 */
$package("metamodel");
metamodel={
	/**
	 * 初始化方法
	 */
    initMetamodel:function() {
		this.obj = {
            addMetamodelBtn : $('#addMetamodelBtn'),
            selectMetamodelBtn : $('#selectMetamodelBtn'),
            resetMetamodelBtn : $('#resetMetamodelBtn'),
            metamodelName : $('#metamodelName'),
            flag : $('#flag'),
            metamodelTable : $('#metamodelTable')
		};
		//定义当前页面的全局数据变量
		this.vars={
            statusArray:[],
            statusDic:[]
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
            url: wwwroot + "/base/api/dictionary/metamodel_status",
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

        /*初始化表格*/
        self.obj.metamodelTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/metamodel',
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
                    field: 'metamodelName',
                    title: '元模型名称',
                    width: 500
                },{
                    field: 'dataType',
                    title: '数据类型',
                    width: 400
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
                        result += '<a href="#" onclick="metamodel.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                        if(row.flag==0){//编辑状态显示启用、编辑、删除按钮
                            result += '<a href="#" onclick="metamodel.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                            result += '<a href="#" onclick="metamodel.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                            result += '<a href="#" onclick="metamodel.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
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
        self.obj.addMetamodelBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"添加元模型",
				url:"metamodelAdd.html",
                sureBtn:true,
                size:680,
                onSureClick:function(){
				    //TODO 提交信息
                    if($('#metamodelAddForm').formVerify()){
                        var data = $('#metamodelAddForm').getform();
                        YunpiAlert.success("元模型添加成功");
                        self.obj.metamodelTable.bootstrapTable('refresh');
                        $('#metamodelAddForm').clearform();
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
        self.obj.selectMetamodelBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            /*dataSourceName
                dataBaseIP
                flag*/
            self.obj.metamodelTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetMetamodelBtn.unbind().bind("click", function () {
            self.obj.metamodelName.val("");
            self.obj.flag.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.metamodelTable.bootstrapTable('refresh');
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
            url: wwwroot + "/dataGovernance/metamodel/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看元模型详情",
                        url:"metamodelView.html",
                        sureBtn:false,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            $.each(self.vars.statusArray,function(i,item){
                                $("#metamodelViewForm select[name='flag']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            $('#metamodelViewForm').setform(responseData.data);
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
            url: wwwroot + "/dataGovernance/metamodel/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑数据源",
                        url:"metamodelEdit.html",
                        sureBtn:true,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            //表单数据初始化
                            $.each(self.vars.statusArray,function(i,item){
                                $("#metamodelEditForm select[name='falg']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            $('#metamodelEditForm').setform(responseData.data);
                        },
                        onSureClick:function(){
                            //TODO 获取修改数据进行验证，验证通过后提交信息，密码需要单独处理，如果密码是有效密码的后端进行保存，否则后端不进行密码修改
                            if($('#metamodelEditForm').formVerify()){
                                var data = $('#metamodelEditForm').getform();
                                YunpiAlert.success("元模型修改成功");
                                self.obj.metamodelTable.bootstrapTable('refresh');
                                $('#metamodelEditForm').clearform();
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
        YunpiConform.open("您确定要删除该元模型吗?",null,function(){
            //TODO 根据ID删除信息，删除完成后刷新列表
            self.obj.metamodelTable.bootstrapTable('refresh');
            YunpiAlert.success("删除成功！");
        });
    },
    /**
     * 根据ID启用
     * @param id
     */
    useById:function(id){
        var self = this;
        YunpiConform.open("您确定要启用该元模型吗?","为保证系统的稳定性，元模型一经启用将不能停用或者删除，也不能做修改！",function(){
            //TODO 根据ID启用数据源信息，完成后刷新列表
            self.obj.metamodelTable.bootstrapTable('refresh');
            YunpiAlert.success("启用成功！");
        });
    }
};

/**
 * 页面加载完成时调用初始化方法，进行页面逻辑初始化
 */
$(function(){
    metamodel.initMetamodel();
});