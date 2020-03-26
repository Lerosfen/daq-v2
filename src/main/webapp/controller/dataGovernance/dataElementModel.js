/**
 * 数据元模版管理页面js
 */
$package("dataElementModel");
dataElementModel={
	/**
	 * 初始化方法
	 */
    initDataElementModel:function() {
		this.obj = {
            addDataElementModelBtn : $('#addDataElementModelBtn'),
            selectDataElementModelBtn : $('#selectDataElementModelBtn'),
            resetDataElementModelBtn : $('#resetDataElementModelBtn'),
            modelName : $('#modelName'),
            level : $('#level'),
            dataElementModelTable : $('#dataElementModelTable')
		};
		//定义当前页面的全局数据变量
		this.vars={
            levelArray:[],
            levelDic:[],
            metamodelArray:[],
            metamodelDic:[]
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
         * 获取数据类型信息
         */
        $.ajax({
            type: 'get',
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
        self.obj.dataElementModelTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/dataElementModel',
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
                    field: 'modelName',
                    title: '模版名称',
                    width: 500
                },{
                    field: 'level',
                    title: '级别',
                    width: 200,
                    formatter: function(value) {
                        return self.vars.levelDic.getText(value,"dicName");
                    }
                },{
                    field: 'modelDesc',
                    title: '模版描述',
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
                        result += '<a href="#" onclick="dataElementModel.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                        result += '<a href="#" onclick="dataElementModel.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                        result += '<a href="#" onclick="dataElementModel.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
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
        self.obj.addDataElementModelBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"添加数据元模版",
				url:"dataElementModelAdd.html",
                sureBtn:true,
                size:1200,
                afterWinOpen:function(){//打开页面时赋值
                    //初始化标准级别选择框
                    $.each(self.vars.levelArray,function(i,item){
                        $("#dataElementModelAddForm select[name='level']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });

                    //初始化规则选择框
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        async:false,//同步获取
                        url: wwwroot+'/dataGovernance/dataElement',
                        success: function (responseData) {
                            if (responseData.code == "code_200") {
                                $.each(responseData.data,function(i,item){
                                    $("#dataElemrnts").append('<option value="'+item.id+'">'+item.dataElementName+'【'+item.dataElementCode+'】</option>');
                                });
                            }
                        },
                        error: function () {
                            YunpiAlert.error('数据元查询失败！');
                        }
                    });
                    /**
                     * 当改变所选项的时候，更新选择列表
                     */
                    $("#dataElemrnts").selectpicker({
                        noneSelectedText : "--请选择--",//默认显示内容
                        actionsBox:true,
                        selectedTextFormat:"count>1",
                        maxOptions:100,//最多选5个
                        size:15
                    }).on("changed.bs.select", function (e, clickedIndex, isSelected, previousValue) {
                        $("#selectedDataElementList").empty();
                        $(this).find("option:selected").each(function(i,item){
                            $("#selectedDataElementList").append('<li class="list-group-item" value="'+$(item).val()+'">'+$(item).html()+'<span class="glyphicon glyphicon-remove removeItem" aria-hidden="true"></span></li>');
                        });
                        //点击移除按钮的时候移除所选规则，规则列表与选择框中的所选项都要移除
                        $("#selectedDataElementList>li>span").unbind().bind("click",function(){
                            $(this).closest("li").remove();
                            var valuesArray = [];
                            $("#selectedDataElementList>li").each(function(i,item){
                                valuesArray.push($(item).attr("value"));
                            });
                            $("#dataElemrnts").selectpicker("val",valuesArray);
                        });
                    });
                },
                onSureClick:function(){
                    if($('#dataElementModelAddForm').formVerify()){
                        var data = $('#dataElementModelAddForm').getform();
                        var dataElements = [];

                        data.dataElements = dataElements;
                        //TODO 提交数据元模板信息
                        YunpiAlert.success("数据元模版添加成功");
                        self.obj.dataElementModelTable.bootstrapTable('refresh');
                        $('#dataElementModelAddForm').clearform();
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
        self.obj.selectDataElementModelBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            /*modelName
                level*/
            self.obj.dataElementModelTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetDataElementModelBtn.unbind().bind("click", function () {
            self.obj.modelName.val("");
            self.obj.level.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.dataElementModelTable.bootstrapTable('refresh');
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
            url: wwwroot + "/dataGovernance/dataElementModel/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看数据元模版详情",
                        url:"dataElementModelView.html",
                        sureBtn:false,
                        size:1200,
                        afterWinOpen:function(){//打开页面时赋值
                            //初始化标准级别选择框
                            $.each(self.vars.levelArray,function(i,item){
                                $("#dataElementModelViewForm select[name='level']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                            });
                            //编辑数据设置到表单
                            $('#dataElementModelViewForm').setform(responseData.data);
                            if(responseData.data.dataElements){
                                $.each(responseData.data.dataElements,function(i,item){
                                    $("#selectedDataElementList").append('<li class="list-group-item">'+item.dataElementName+'【'+item.dataElementCode+'】</li>');
                                });
                            }
                        },
                        beforeWinClose:function(){//关闭时清空form
                            $('#dataElementModelViewForm').clearform();
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
            url: wwwroot + "/dataGovernance/dataElementModel/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑数据元模板",
                        url:"dataElementModelEdit.html",
                        sureBtn:true,
                        size:1200,
                        afterWinOpen:function(){//打开页面时赋值
                            //初始化标准级别选择框
                            $.each(self.vars.levelArray,function(i,item){
                                $("#dataElementModelEditForm select[name='level']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                            });

                            //初始化规则选择框
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                async:false,//同步获取
                                url: wwwroot+'/dataGovernance/dataElement',
                                success: function (responseData) {
                                    if (responseData.code == "code_200") {
                                        $.each(responseData.data,function(i,item){
                                            $("#dataElemrnts").append('<option value="'+item.id+'">'+item.dataElementName+'【'+item.dataElementCode+'】</option>');
                                        });
                                    }
                                },
                                error: function () {
                                    YunpiAlert.error('数据元查询失败！');
                                }
                            });
                            /**
                             * 当改变所选项的时候，更新选择列表
                             */
                            $("#dataElemrnts").selectpicker({
                                noneSelectedText : "--请选择--",//默认显示内容
                                actionsBox:true,
                                selectedTextFormat:"count>1",
                                maxOptions:5,//最多选5个
                                size:10
                            }).on("changed.bs.select", function (e, clickedIndex, isSelected, previousValue) {
                                $("#selectedDataElementList").empty();
                                $(this).find("option:selected").each(function(i,item){
                                    $("#selectedDataElementList").append('<li class="list-group-item" value="'+$(item).val()+'">'+$(item).html()+'<span class="glyphicon glyphicon-remove removeItem" aria-hidden="true"></span></li>');
                                });
                                //点击移除按钮的时候移除所选规则，规则列表与选择框中的所选项都要移除
                                $("#selectedDataElementList>li>span").unbind().bind("click",function(){
                                    $(this).closest("li").remove();
                                    var valuesArray = [];
                                    $("#selectedDataElementList>li").each(function(i,item){
                                        valuesArray.push($(item).attr("value"));
                                    });
                                    $("#dataElemrnts").selectpicker("val",valuesArray);
                                });
                            });
                            //编辑数据设置到表单
                            $('#dataElementModelEditForm').setform(responseData.data);
                            if(responseData.data.rules){
                                var values = [];
                                $.each(responseData.data.rules,function(i,item){
                                    values.push(item.id);
                                });
                                $("#dataElemrnts").selectpicker("val",values);
                            }
                        },
                        onSureClick:function(){
                            //TODO 获取修改数据进行验证，验证通过后提交信息
                            if($('#dataElementModelEditForm').formVerify()){
                                var data = $('#dataElementModelEditForm').getform();
                                YunpiAlert.success("数据元模板修改成功");
                                self.obj.dataElementModelTable.bootstrapTable('refresh');
                                YunpiDialog.close();
                            }else{
                                YunpiAlert.warning("提交失败，参数校验不通过");
                            }
                        },
                        beforeWinClose:function(){
                            $('#dataElementModelEditForm').clearform();
                            $("#dataElemrnts").selectpicker("destroy");
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
    deleteById:function(id) {
        var self = this;
        YunpiConform.open("您确定要删除该数据元模版吗?", null, function () {
            //TODO 根据ID删除信息，删除完成后刷新列表
            self.obj.dataElementModelTable.bootstrapTable('refresh');
            YunpiAlert.success("删除成功！");
        });
    }
};

/**
 * 页面加载完成时调用初始化方法，进行页面逻辑初始化
 */
$(function(){
    dataElementModel.initDataElementModel();
});