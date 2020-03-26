/**
 * 数据元管理页面js
 */
$package("dataElement");
dataElement={
	/**
	 * 初始化方法
	 */
    initDataElement:function() {
		this.obj = {
            addDataElementBtn : $('#addDataElementBtn'),
            selectDataElementBtn : $('#selectDataElementBtn'),
            resetDataElementBtn : $('#resetDataElementBtn'),
            dataElementName : $('#dataElementName'),
            flag : $('#flag'),
            level : $('#level'),
            dataElementTable : $('#dataElementTable')
		};
		//定义当前页面的全局数据变量
		this.vars={
            flagArray:[],
            flagDic:[],
            levelArray:[],
            levelDic:[],
            metamodelArray:[],
            metamodelDic:[],
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
        /*获取状态编码字典*/
        YunpiLight.open();
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/data_element_status",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.flagArray = responseData.data;
                    self.vars.flagDic = responseData.data.toDict("dicCode",true);
                    //查询条件中的规则类型选择初始化
                    $.each(self.vars.flagArray,function(i,item){
                        self.obj.flag.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                }else{
                    YunpiAlert.error('状态字典查询失败！');
                }
            },
            error: function () {
                YunpiAlert.error('状态字典查询失败！');
            }
        });
        //获取标准级别分类字典
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/data_element_level",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.levelArray = responseData.data;
                    self.vars.levelDic = responseData.data.toDict("dicCode",true);
                    //查询条件中的规则类型选择初始化
                    $.each(self.vars.levelArray,function(i,item){
                        self.obj.level.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                }else{
                    YunpiAlert.error('数据元级别字典查询失败！');
                }
            },
            error: function () {
                YunpiAlert.error('数据元级别字典查询失败！');
            }
        });
        /**
         * 获取规则分类字典
         */
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/data_element_rule_type",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.ruleTypeArray = responseData.data;
                    self.vars.ruleTypeDic = responseData.data.toDict("dicCode",true);
                }else{
                    YunpiAlert.error('规则分类字典查询失败！');
                }
            },
            error: function () {
                YunpiAlert.error('规则分类字典查询失败！');
            }
        });
        /**
         * 获取数据类型信息
         */
        $.ajax({
            type: 'post',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot+'/dataGovernance/metamodel',
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.metamodelArray = responseData.data;
                    self.vars.metamodelDic = responseData.data.toDict("id",true);
                }else{
                    YunpiAlert.error('元模型查询失败！');
                }
            },
            error: function () {
                YunpiAlert.error('元模型查询失败！');
            }
        });
        /*初始化表格*/
        self.obj.dataElementTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/dataElement',
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
                    field: 'dataElementName',
                    title: '数据元名称',
                    width: 500
                },{
                    field: 'dataElementCode',
                    title: '标识符',
                    width: 500
                },{
                    field: 'level',
                    title: '级别',
                    width: 200,
                    formatter: function(value) {
                        return self.vars.levelDic.getText(value,"dicName");
                    }
                },{
                    field: 'metamodelId',
                    title: '数据类型',
                    width: 200,
                    formatter: function(value) {
                        return self.vars.metamodelDic.getText(value,"metamodelName");
                    }
                },{
                    field: 'dataFormat',
                    title: '数据格式',
                    width: 400
                },{
                    field: 'valueDesc',
                    title: '值域描述',
                    width: 800
                },{
                    field: 'flag',
                    title: '状态',
                    width: 200,
                    formatter: function(value) {
                        return self.vars.flagDic.getText(value,"dicName");
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
                        result += '<a href="#" onclick="dataElement.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                        if(row.flag == "0"){//编辑状态下可修改和删除
                            result += '<a href="#" onclick="dataElement.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                            result += '<a href="#" onclick="dataElement.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                            result += '<a href="#" onclick="dataElement.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                        }else if(row.flag == "1"){//启用状态下可禁用
                            result += '<a href="#" onclick="dataElement.forbidById(\'' + id + '\')" title="禁用"><span class="glyphicon glyphicon-ban-circle"></span></a>';
                        }else if(row.flag == "2"){//禁用状态下可启用
                            result += '<a href="#" onclick="dataElement.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                        }else{
                            //删除状态的数据不展示
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
        self.obj.addDataElementBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"添加数据元",
				url:"dataElementAdd.html",
                sureBtn:true,
                size:1200,
                afterWinOpen:function(){//打开页面时赋值
				    //初始化数据类型选择框
                    $.each(self.vars.metamodelArray,function(i,item){
                        $("#dataElementAddForm select[name='metamodelId']").append('<option value="'+item.id+'" >'+item.metamodelName+'</option>')
                    });
                    //初始化标准级别选择框
                    $.each(self.vars.levelArray,function(i,item){
                        $("#dataElementAddForm select[name='level']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                    //初始化规则选择框
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        async:false,//同步获取
                        url: wwwroot+'/dataGovernance/dataElementRule',
                        success: function (responseData) {
                            if (responseData.code == "code_200") {
                                $.each(responseData.data,function(i,item){
                                    $("#dataElemrntRuls").append('<option value="'+item.id+'">'+item.ruleName+'【'+item.ruleRegex+'】</option>');
                                });
                            }
                        },
                        error: function () {
                            YunpiAlert.error('数据元规则查询失败！');
                        }
                    });
                    /**
                     * 当改变所选项的时候，更新选择列表
                     */
                    $("#dataElemrntRuls").selectpicker({
                        noneSelectedText : "--请选择--",//默认显示内容
                        actionsBox:true,
                        selectedTextFormat:"count>1",
                        maxOptions:5,//最多选5个
                        size:10
                    }).on("changed.bs.select", function (e, clickedIndex, isSelected, previousValue) {
                        $("#selectedRuleList").empty();
                        $(this).find("option:selected").each(function(i,item){
                            $("#selectedRuleList").append('<li class="list-group-item" value="'+$(item).val()+'">'+$(item).html()+'<span class="glyphicon glyphicon-remove removeItem" aria-hidden="true"></span></li>');
                        });
                        //点击移除按钮的时候移除所选规则，规则列表与选择框中的所选项都要移除
                        $("#selectedRuleList>li>span").unbind().bind("click",function(){
                            $(this).closest("li").remove();
                            var valuesArray = [];
                            $("#selectedRuleList>li").each(function(i,item){
                                valuesArray.push($(item).attr("value"));
                            });
                            $("#dataElemrntRuls").selectpicker("val",valuesArray);
                        });
                    });
                },
                beforeWinClose:function(){
                    $("#dataElemrntRuls").selectpicker("destroy");
                },
                onSureClick:function(){
                    if($('#dataElementAddForm').formVerify()){
                        var data = $('#dataElementAddForm').getform();
                        var rules = [];
                        $("#dataElemrntRuls>option:selected").each(function(){
                            rules.push($(this).val());
                        });
                        data.rules = rules;//TODO 提交信息
                        YunpiAlert.success("数据元添加成功");
                        self.obj.dataElementTable.bootstrapTable('refresh');
                        $('#dataElementAddForm').clearform();
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
        self.obj.selectDataElementBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            /*dataSourceName
                dataBaseIP
                flag*/
            self.obj.dataElementTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetDataElementBtn.unbind().bind("click", function () {
            self.obj.dataElementName.val("");
            self.obj.flag.val("");
            self.obj.level.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.dataElementTable.bootstrapTable('refresh');
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
            url: wwwroot + "/dataGovernance/dataElement/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看数据元详情",
                        url:"dataElementView.html",
                        sureBtn:false,
                        size:1200,
                        afterWinOpen:function(){//打开页面时赋值
                            //初始化数据类型选择框
                            $.each(self.vars.metamodelArray,function(i,item){
                                $("#dataSourceViewForm select[name='metamodelId']").append('<option value="'+item.id+'" >'+item.metamodelName+'</option>');
                            });
                            //初始化标准级别选择框
                            $.each(self.vars.levelArray,function(i,item){
                                $("#dataSourceViewForm select[name='level']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                            });

                            //编辑数据设置到表单
                            $('#dataSourceViewForm').setform(responseData.data);
                            if(responseData.data.rules){
                                $.each(responseData.data.rules,function(i,item){
                                        $("#selectedRuleList").append('<li class="list-group-item">'+item.ruleName+'【'+item.ruleRegex+'】</li>');
                                });
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
            url: wwwroot + "/dataGovernance/dataElement/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑数据元",
                        url:"dataElementEdit.html",
                        sureBtn:true,
                        size:1200,
                        afterWinOpen:function(){//打开页面时赋值
                            //初始化数据类型选择框
                            $.each(self.vars.metamodelArray,function(i,item){
                                $("#dataElementEditForm select[name='metamodelId']").append('<option value="'+item.id+'" >'+item.metamodelName+'</option>');
                            });
                            //初始化标准级别选择框
                            $.each(self.vars.levelArray,function(i,item){
                                $("#dataElementEditForm select[name='level']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                            });
                            //初始化规则选择框
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                async:false,//同步获取
                                url: wwwroot+'/dataGovernance/dataElementRule',
                                success: function (responseData) {
                                    if (responseData.code == "code_200") {
                                        $.each(responseData.data,function(i,item){
                                            $("#dataElemrntRuls").append('<option value="'+item.id+'">'+item.ruleName+'【'+item.ruleRegex+'】</option>');
                                        });
                                    }
                                },
                                error: function () {
                                    YunpiAlert.error('数据元规则查询失败！');
                                }
                            });
                            /**
                             * 当改变所选项的时候，更新选择列表
                             */
                            $("#dataElemrntRuls").selectpicker({
                                noneSelectedText : "--请选择--",//默认显示内容
                                actionsBox:true,
                                selectedTextFormat:"count>1",
                                maxOptions:5,//最多选5个
                                size:10
                            }).on("changed.bs.select", function (e, clickedIndex, isSelected, previousValue) {
                                $("#selectedRuleList").empty();
                                $(this).find("option:selected").each(function(i,item){
                                    $("#selectedRuleList").append('<li class="list-group-item" value="'+$(item).val()+'">'+$(item).html()+'<span class="glyphicon glyphicon-remove removeItem" aria-hidden="true"></span></li>');
                                });
                                //点击移除按钮的时候移除所选规则，规则列表与选择框中的所选项都要移除
                                $("#selectedRuleList>li>span").unbind().bind("click",function(){
                                    $(this).closest("li").remove();
                                    var valuesArray = [];
                                    $("#selectedRuleList>li").each(function(i,item){
                                        valuesArray.push($(item).attr("value"));
                                    });
                                    $("#dataElemrntRuls").selectpicker("val",valuesArray);
                                });
                            });
                            //编辑数据设置到表单
                            $('#dataElementEditForm').setform(responseData.data);
                            if(responseData.data.rules){
                                var values = [];
                                $.each(responseData.data.rules,function(i,item){
                                    values.push(item.id);
                                });
                                $("#dataElemrntRuls").selectpicker("val",values);
                            }
                        },
                        onSureClick:function(){
                            //TODO 获取修改数据进行验证，验证通过后提交信息
                            if($('#dataElementEditForm').formVerify()){
                                var data = $('#dataElementEditForm').getform();
                                YunpiAlert.success("数据元修改成功");
                                self.obj.dataElementTable.bootstrapTable('refresh');
                                YunpiDialog.close();
                            }else{
                                YunpiAlert.warning("提交失败，参数校验不通过");
                            }
                        },
                        beforeWinClose:function(){
                            $('#dataElementEditForm').clearform();
                            $("#dataElemrntRuls").selectpicker("destroy");
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
        YunpiConform.open("您确定要删除该数据元吗?",null,function(){
            //TODO 根据ID删除信息，删除完成后刷新列表
            self.obj.dataElementTable.bootstrapTable('refresh');
            YunpiAlert.success("删除成功！");
        });
    },
    /**
     * 根据ID禁用
     * @param id
     */
    forbidById:function(id){
        var self = this;
        YunpiConform.open("您确定要禁用该数据元吗?","禁用该数据元后，数据元将不可用，引用该数据元的元数据将失去规则约束。",function(){
            //TODO 根据ID禁用信息，完成后刷新列表
            self.obj.dataElementTable.bootstrapTable('refresh');
            YunpiAlert.success("禁用成功！");
        });
    },
    /**
     * 根据ID启用
     * @param id
     */
    useById:function(id){
        var self = this;
        //TODO 根据ID启用数据元
        self.obj.dataElementTable.bootstrapTable('refresh');
        YunpiAlert.success("启用成功！");
    }
};

/**
 * 页面加载完成时调用初始化方法，进行页面逻辑初始化
 */
$(function(){
    dataElement.initDataElement();
});