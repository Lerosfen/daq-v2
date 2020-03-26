/**
 * 数据元规则管理页面js
 */
$package("dataElementRule");
dataElementRule={
	/**
	 * 初始化方法
	 */
    initDataElementRule:function() {
		this.obj = {
            addDataElementRuleBtn : $('#addDataElementRuleBtn'),
            selectDataElementRuleBtn : $('#selectDataElementRuleBtn'),
            resetDataElementRuleBtn : $('#resetDataElementRuleBtn'),
            ruleName : $('#ruleName'),
            ruleType : $('#ruleType'),
            dataElementRuleTable : $('#dataElementRuleTable')
		};
		//定义当前页面的全局数据变量
		this.vars={
            ruleTypeArray:[],
            ruleTypeDic:[]
        };
		this.initDom();
        this.initEvent();//index页面事件初始化
	},
    /**
     * 页面初始化
     */
    initDom:function(){
        var self = this;
        YunpiLight.open();
        /*获取规则分类字典*/
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/data_element_rule_type",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.ruleTypeArray = responseData.data;
                    self.vars.ruleTypeDic = responseData.data.toDict("dicCode",true);
                    //查询条件中的规则类型选择初始化
                    $.each(self.vars.ruleTypeArray,function(i,item){
                        self.obj.ruleType.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('规则分类字典查询失败！');
            }
        });

        /*初始化表格*/
        self.obj.dataElementRuleTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/dataElementRule',
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
                    field: 'ruleName',
                    title: '规则名称',
                    width: 500
                },{
                    field: 'ruleType',
                    title: '规则分类',
                    width: 200,
                    formatter: function(value) {
                        return self.vars.ruleTypeDic.getText(value,"dicName");
                    }
                },{
                    field: 'ruleRegex',
                    title: '规则正则表达式',
                    width: 500
                },{
                    field: 'ruleDesc',
                    title: '描述',
                    width: 800
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
                        result += '<a href="#" onclick="dataElementRule.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                        result += '<a href="#" onclick="dataElementRule.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                        result += '<a href="#" onclick="dataElementRule.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
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
        self.obj.addDataElementRuleBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"添加数据元规则",
				url:"dataElementRuleAdd.html",
                sureBtn:true,
                size:680,
                afterWinOpen:function(){//打开页面时赋值
                    $.each(self.vars.ruleTypeArray,function(i,item){
                        $("#dataElementRuleAddForm select[name='ruleType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                },
                onSureClick:function(){
				    //TODO 提交信息
                    if($('#dataElementRuleAddForm').formVerify()){
                        var data = $('#dataElementRuleAddForm').getform();
                        YunpiAlert.success("数据元规则添加成功");
                        self.obj.dataElementRuleTable.bootstrapTable('refresh');
                        $('#dataElementRuleAddForm').clearform();
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
        self.obj.selectDataElementRuleBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            /*dataSourceName
                dataBaseIP
                flag*/
            self.obj.dataElementRuleTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetDataElementRuleBtn.unbind().bind("click", function () {
            self.obj.ruleName.val("");
            self.obj.ruleType.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.dataElementRuleTable.bootstrapTable('refresh');
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
            url: wwwroot + "/dataGovernance/dataElementRule/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看数据元规则详情",
                        url:"dataElementRuleView.html",
                        sureBtn:false,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            $.each(self.vars.ruleTypeArray,function(i,item){
                                $("#dataElementRuleViewForm select[name='ruleType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            $('#dataElementRuleViewForm').setform(responseData.data);
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
            url: wwwroot + "/dataGovernance/dataElementRule/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑数据元规则",
                        url:"dataElementRuleEdit.html",
                        sureBtn:true,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            //表单数据初始化
                            $.each(self.vars.ruleTypeArray,function(i,item){
                                $("#dataElementRuleEditForm select[name='ruleType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            $('#dataElementRuleEditForm').setform(responseData.data);
                        },
                        onSureClick:function(){
                            //TODO 获取修改数据进行验证，验证通过后提交信息，密码需要单独处理，如果密码是有效密码的后端进行保存，否则后端不进行密码修改
                            if($('#dataElementRuleEditForm').formVerify()){
                                var data = $('#dataElementRuleEditForm').getform();
                                YunpiAlert.success("数据元规则修改成功");
                                self.obj.dataElementRuleTable.bootstrapTable('refresh');
                                $('#dataElementRuleEditForm').clearform();
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
        YunpiConform.open("您确定要删除该数据元规则吗?","规则删除后，该规则的限制将失效。",function(){
            //TODO 根据ID删除信息，删除完成后刷新列表
            self.obj.dataElementRuleTable.bootstrapTable('refresh');
            YunpiAlert.success("删除成功！");
        });
    }
};

/**
 * 页面加载完成时调用初始化方法，进行页面逻辑初始化
 */
$(function(){
    dataElementRule.initDataElementRule();
});