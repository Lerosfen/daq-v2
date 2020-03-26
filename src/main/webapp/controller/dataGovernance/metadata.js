/**
 * 元数据管理页面js
 */
$package("metadata");
metadata={
	/**
	 * 初始化方法
	 */
    initMetadata:function() {
		this.obj = {
            daqMetadataBtn : $('#daqMetadataBtn'),
            addMetadataBtn : $('#addMetadataBtn'),
            selectMetadataBtn : $('#selectMetadataBtn'),
            resetMetadataBtn : $('#resetMetadataBtn'),
            metadataName : $('#metadataName'),
            metaType : $('#metaType'),
            tradeType : $('#tradeType'),
            metadataTable : $('#metadataTable')
		};
		//定义当前页面的全局数据变量
		this.vars={
            metaTypeArray:[],
            metaTypeDic:[],
            tradeTypeArray:[],
            tradeTypeDic:[],
            deptArray:[],
            deptDic:[]
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
        /*获取来源编码字典*/
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/meta_type",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.metaTypeArray = responseData.data;
                    self.vars.metaTypeDic = responseData.data.toDict("dicCode",true);
                    //查询条件中的数据源来源选择初始化
                    $.each(self.vars.metaTypeArray,function(i,item){
                        self.obj.metaType.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('元数据来源字典查询失败！');
            }
        });
        /*获取领域编码字典*/
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/trade_type",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.tradeTypeArray = responseData.data;
                    self.vars.tradeTypeDic = responseData.data.toDict("dicCode",true);
                    //查询条件中的数据源来源选择初始化
                    $.each(self.vars.tradeTypeArray,function(i,item){
                        self.obj.tradeType.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('领域字典查询失败！');
            }
        });
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/basicManage/dept",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.deptArray = responseData.data;
                    self.vars.deptDic = responseData.data.toDict("id",true);
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('部门列表查询失败！');
            }
        });

        /*初始化表格*/
        self.obj.metadataTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/metadata',
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
                    field: 'metadataName',
                    title: '元数据名称',
                    width: 500
                }, {
                    field: 'metaType',
                    title: '来源',
                    width: 200,
                    formatter: function(value) {
                        return self.vars.metaTypeDic.getText(value,"dicName");
                    }
                },{
                    field: 'deptId',
                    title: '提供部门',
                    width: 400,
                    formatter: function(value) {
                        return self.vars.deptDic.getText(value,"deptName");
                    }
                },{
                    field: 'tradeType',
                    title: '所属领域',
                    width: 400,
                    formatter: function(value) {
                        return self.vars.tradeTypeDic.getText(value,"dicName");
                    }
                },{
                    field: 'version',
                    title: '版本',
                    width: 200,
                    formatter: function(value) {
                        return ("V"+value);
                    }
                },{
                    field: 'alarm',
                    title: '告警',
                    width: 200,
                    formatter: function(value,row) {
                        if(row.metaType != "diy"){
                            return value ? '<span style="color: red;" class="glyphicon glyphicon-bell"></span>' : '<span style="color: green;" class="glyphicon glyphicon-bell"></span>';
                        }else {
                            return "";
                        }
                    }
                },{
                    field: 'desc',
                    title: '描述',
                    width: 500
                },{
                    field:"createTime",
                    title:"创建时间",
                    width: 300
                },{
                    field:"modifyTime",
                    title:"修改时间",
                    width: 300
                },{
                    field: 'id',
                    title: '操作',
                    width: 350,
                    align: 'left',
                    formatter: function (value, row, index) {
                        var id = value;
                        var result = "";
                        result += '<a href="#" onclick="metadata.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                        /*result += '<a href="#" onclick="metadata.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';*/
                        result += '<a href="#" onclick="metadata.setupById(\'' + id + '\')" title="设置"><span class="glyphicon glyphicon-cog"></span></a>';
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
         * 采集元数据
         */
        self.obj.daqMetadataBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"采集元数据",
				url:"metadataDaq.html",
                sureBtn:true,
                size:950,
                afterWinOpen:function(){
                    YunpiLight.open();
				    //所属领域初始化
				    $.each(self.vars.tradeTypeArray,function(i,item){
                        $("#metadataDaqForm select[name='tradeType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
				    //提供部门初始化
                    $.each(self.vars.deptArray,function(i,item){
                        $("#metadataDaqForm select[name='deptId']").append('<option value="'+item.id+'" >'+item.deptName+'</option>')
                    });

                    //数据源初始化
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: wwwroot+'/dataGovernance/dataSource',
                        success: function (responseData) {
                            if (responseData.code == "code_200") {
                                $.each(responseData.data,function(i,item){
                                    $("#metadataDaqForm select[name='dataSourceId']").append('<option value="'+item.id+'">'+item.dataSourceName+'</option>');
                                });
                            }else{
                                YunpiAlert.error(responseData.msg);
                            }
                        },
                        error: function () {
                            YunpiAlert.error('部门列表查询失败！');
                        }
                    });

				    //当数据源改变的时候，同步改变数据表为未选择状态
                    $("#metadataDaqForm select[name='dataSourceId']").unbind().bind("change",function(){
                        var value = $(this).val();
                        $("#metadataDaqForm select[name='tableName']").empty();
                        $("#daqColsTable").empty();//清空表格
                        $("#metadataDaqForm select[name='tableName']").append('<option value="" selected>--请选择--</option>');
                        if(value && value!=""){
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: wwwroot + '/dataGovernance/dataSource/getTables',
                                data:{dataSourceId:$(this).val()},
                                success: function (responseData) {
                                    if (responseData.code == "code_200") {
                                        $.each(responseData.data,function(i,item){
                                            console.log(item)
                                            $("select[name='tableName']").append('<option value="'+item.tableName+'">'+item.tableDesc+'</option>');
                                        });
                                    }else{
                                        YunpiAlert.error(responseData.msg);
                                    }
                                },
                                error: function () {
                                    YunpiAlert.error('部门列表查询失败！');
                                }
                            });
                        }
                    });
				    //当数据表改变的时候，同步改变元数据表格
                    $("#metadataDaqForm select[name='tableName']").unbind().bind("change",function(){
                        var value = $(this).val();
                        $("#daqColsTable").empty();//清空表格
                        if(value && value!=""){
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: wwwroot + '/dataGovernance/dataSource/getCols',
                                data:{dataSourceId:$("#metadataDaqForm select[name='dataSourceId']").val(),},
                                success: function (responseData) {
                                    if (responseData.code == "code_200") {
                                        $.each(responseData.data,function(i,item){
                                            $("#daqColsTable").append('<tr><td>'+item.colName+'</td><td>'+item.colDesc+'</td><td>'+item.colType+'</td><td>'+item.colLength+'</td><td>'+item.isKey+'</td></tr>');
                                        });
                                    }else{
                                        YunpiAlert.error(responseData.msg);
                                    }
                                },
                                error: function () {
                                    YunpiAlert.error('部门列表查询失败！');
                                }
                            });
                        }
                    });
                    YunpiLight.close();
                },
                onSureClick:function(){
				    //TODO 提交信息
                    if($('#metadataDaqForm').formVerify()){
                        var data = $('#metadataDaqForm').getform();
                        YunpiAlert.success("元数据添加成功");
                        self.obj.metadataTable.bootstrapTable('refresh');
                        $('#metadataDaqForm').clearform();
                        YunpiDialog.close();
                    }else{
                        YunpiAlert.warning("提交失败，参数校验不通过");
                    }
                }
			});
        });
        /**
         * 自定义元数据
         */
        self.obj.addMetadataBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"添加元数据",
				url:"metadataAdd.html",
                sureBtn:true,
                size:950,
                afterWinOpen:function(){
                    YunpiLight.open();
                    //所属领域初始化
                    $.each(self.vars.tradeTypeArray,function(i,item){
                        $("#metadataAddForm select[name='tradeType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                    //提供部门初始化
                    $.each(self.vars.deptArray,function(i,item){
                        $("#metadataAddForm select[name='deptId']").append('<option value="'+item.id+'" >'+item.deptName+'</option>')
                    });

                    //获取元模型信息
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        async:false,
                        url: wwwroot + '/dataGovernance/metamodel',
                        success: function (responseData) {
                            if (responseData.code == "code_200") {
                                $.each(responseData.data,function(i,item){
                                    $('#insertColForm select[name="colType"]').append('<option value="'+item.dataType+'">'+item.metamodelName+'【'+item.dataType+'】</option>');
                                });
                            }else{
                                YunpiAlert.error(responseData.msg);
                            }
                        },
                        error: function () {
                            YunpiAlert.error('元模型查询失败！');
                        }
                    });

                    //添加元数据项
                    $('#addMetadataColBtn').unbind().bind('click',function(){
                        //获取所有的字段的验证结果并进行验证
                        if($('#insertColForm').formVerify()){
                            var data = $('#insertColForm').getform();

                            //声明要加入的对象
                            var $item = $('<tr><td>'+data.colName+'</td><td>'+data.colDesc+'</td><td>'+data.colType+'</td>' +
                                '<td>'+data.colLength+'</td><td>'+data.isKey+'</td>' +
                                '<td><span class="glyphicon glyphicon-remove removeItem" aria-hidden="true"></span></td></tr>');
                            //加入到页面
                            $('#addColsTable').append($item);
                            //为新加入的项绑定方法
                            $item.find("span").unbind().bind("click",function(){
                                $(this).closest("tr").remove();
                            });
                            document.getElementById("insertColForm").reset();
                        }
                    });
                    YunpiLight.close();
                },
                onSureClick:function(){
				    //TODO 提交信息
                    if($('#metadataAddForm').formVerify()){
                        var data = $('#metadataAddForm').getform();
                        YunpiAlert.success("元数据添加成功");
                        self.obj.metadataTable.bootstrapTable('refresh');
                        $('#metadataAddForm').clearform();
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
        self.obj.selectMetadataBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            /*metadataName
                metaType*/
            self.obj.metadataTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetMetadataBtn.unbind().bind("click", function () {
            self.obj.metadataName.val("");
            self.obj.metaType.val("");
            self.obj.tradeType.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.metadataTable.bootstrapTable('refresh');
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
            url: wwwroot + "/dataGovernance/metadata/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看元数据详情",
                        url:"metadataView.html",
                        sureBtn:false,
                        size:950,
                        afterWinOpen:function(){//打开页面时赋值
                            responseData.data.version = "V"+responseData.data.version;
                            //来源
                            $.each(self.vars.metaTypeArray,function(i,item){
                                $("#metadataViewForm select[name='metaType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            //所属领域初始化
                            $.each(self.vars.tradeTypeArray,function(i,item){
                                $("#metadataViewForm select[name='tradeType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            //提供部门初始化
                            $.each(self.vars.deptArray,function(i,item){
                                $("#metadataViewForm select[name='deptId']").append('<option value="'+item.id+'" >'+item.deptName+'</option>')
                            });

                            //如果是采集的元数据，显示数据源和数据表项
                            if(responseData.data.metaType == "daq"){
                                $(".daq-view").show();
                            }else{
                                $(".daq-view").hide();
                            }

                            //获取数据元级别信息
                            var $level = $("#metadataViewForm select[name='level']");
                            $.ajax({
                                type: 'get',
                                dataType: 'json',
                                async:false,//同步获取，确保在表格数据加载的时候字典信息可用
                                url: wwwroot + "/base/api/dictionary/data_element_level",
                                success: function (responseData) {
                                    if (responseData.code == "code_200") {
                                        //查询条件中的规则类型选择初始化
                                        $.each(responseData.data,function(i,item){
                                            $level.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                                        });
                                    }else{
                                        YunpiAlert.error('数据元级别字典查询失败！');
                                    }
                                },
                                error: function () {
                                    YunpiAlert.error('数据元级别字典查询失败！');
                                }
                            });

                            //设置数据
                            $('#metadataViewForm').setform(responseData.data);
                            //添加列表信息
                            var cols = responseData.data.cols;
                            if(cols && cols.length > 0){
                                for (var i = 0; i < cols.length; i++) {
                                    $('#colsViewTable').append('<tr><td>'+cols[i].colName+'</td><td>'+cols[i].colDesc+'</td><td>'+cols[i].colType +'</td><td>'+cols[i].mapingDataElement+'</td></tr>');
                                }
                            }
                        },
                        beforeWinClose:function(){//关闭时清空form
                            $('#metadataViewForm').clearform();
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
    /*editById:function(id){
        var self = this;
        //根据ID查询要修改的数据
        YunpiLight.open();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + "/dataGovernance/metadata/"+id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑元数据",
                        url:"metadataEdit.html",
                        sureBtn:true,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            //表单数据初始化
                            $.each(self.vars.dbTypesArray,function(i,item){
                                $("#metadataEditForm select[name='dataBaseType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                            });
                            $('#metadataEditForm').setform(responseData.data);
                            if(responseData.data.dataBaseType == "oracle"){
                                $("#metadataEditForm input[name='tableSpaceName']").parent().show();
                            }
                            $('#metadataEditForm input[name="userPwd"]').val("······");
                            //根据所选数据库的类型变换form内容
                            $("#metadataEditForm select[name='dataBaseType']").change(function(){
                                if($(this).val() == "oracle"){
                                    $("#metadataEditForm input[name='tableSpaceName']").parent().show();
                                }else{
                                    $("#metadataEditForm input[name='tableSpaceName']").val("");
                                    $("#metadataEditForm input[name='tableSpaceName']").parent().hide();
                                }
                            });
                            //添加测试链接按钮事件
                            $("#checkDbLinkBtn").unbind().bind("click",function(){
                                var data = $('#metadataEditForm').getform();
                                //TODO 验证数据库连接
                                YunpiAlert.info("连接成功");
                            });
                        },
                        onSureClick:function(){
                            //TODO 获取修改数据进行验证，验证通过后提交信息，密码需要单独处理，如果密码是有效密码的后端进行保存，否则后端不进行密码修改
                            if($('#metadataEditForm').formVerify()){
                                var data = $('#metadataEditForm').getform();
                                YunpiAlert.success("元数据修改成功");
                                self.obj.metadataTable.bootstrapTable('refresh');
                                $('#metadataEditForm').clearform();
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
    },*/
    /**
     * 设置
     * @param id
     */
    setupById:function(id){
        var self = this;
        var self = this;
        //根据ID查询要修改的数据
        YunpiLight.open();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + "/dataGovernance/metadata/" + id,
            success: function (responseData) {
                YunpiLight.close();
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title: "设置元数据的数据元",
                        url: "metadataSetup.html",
                        sureBtn: true,
                        size: 960,
                        afterWinOpen: function () {//打开页面时赋值
                            //设置form值
                            $('#metadataSetupForm').setform(responseData.data);
                            if(responseData.data.cols){
                                var cols = responseData.data.cols;
                                for(var i = 0 ; i < cols.length ; i++){
                                    $('#setupColsTable').append('<tr><td>'+cols[i].colName+'</td><td>'+cols[i].colDesc+'</td><td>'+cols[i].colType +'</td>' +
                                        '<td><input type="hidden" value="'+cols[i].id+'"><select class="dataElementSelect"><option value="" selected="selected">--请选择--</option></select></td></tr>');
                                }
                            }
                            var $level = $('#metadataSetupForm select[name="level"]');
                            var $dataElementModel = $('#metadataSetupForm select[name="dataElementModelId"]');
                            $.ajax({
                                type: 'get',
                                dataType: 'json',
                                async:false,//同步获取，确保在表格数据加载的时候字典信息可用
                                url: wwwroot + "/base/api/dictionary/data_element_level",
                                success: function (responseData) {
                                    if (responseData.code == "code_200") {
                                        //查询条件中的规则类型选择初始化
                                        $.each(responseData.data,function(i,item){
                                            $level.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                                        });
                                    }else{
                                        YunpiAlert.error('数据元级别字典查询失败！');
                                    }
                                },
                                error: function () {
                                    YunpiAlert.error('数据元级别字典查询失败！');
                                }
                            });
                            //级别发生变换的时候重新请求模版信息，并根据模版重新选择映射关系
                            $level.unbind().bind("change",function(){
                                $('.dataElementSelect').empty().append('<option value="" selected>--请选择--</option>');
                                $dataElementModel.empty().append('<option value="" selected>--请选择--</option>');
                                $.ajax({
                                    type: 'get',
                                    dataType: 'json',
                                    async:false,//同步获取，确保在表格数据加载的时候字典信息可用
                                    url: wwwroot+'/dataGovernance/dataElementModel',
                                    success: function (responseData) {
                                        if (responseData.code == "code_200") {
                                            //查询条件中的规则类型选择初始化
                                            $.each(responseData.data,function(i,item){
                                                $dataElementModel.append('<option value="'+item.id+'" >'+item.modelName+'</option>');
                                            });
                                        }else{
                                            YunpiAlert.error('数据元模版查询失败！');
                                        }
                                    },
                                    error: function () {
                                        YunpiAlert.error('数据元模版查询失败！');
                                    }
                                });
                            });
                            //当修改数据元模版的时候，映射关系中的数据元选择框需要重新制定
                            $dataElementModel.unbind().bind("change",function(){
                                $('.dataElementSelect').empty().append('<option value="" selected>--请选择--</option>');
                                $.ajax({
                                    type: 'get',
                                    dataType: 'json',
                                    async:false,//同步获取，确保在表格数据加载的时候字典信息可用
                                    url: wwwroot+'/dataGovernance/dataElementModel/'+$dataElementModel.val(),
                                    success: function (responseData) {
                                        if (responseData.code == "code_200") {
                                            //查询条件中的规则类型选择初始化
                                            $.each(responseData.data.dataElements,function(i,item){//TODO
                                                $('.dataElementSelect').append('<option value="'+item.id+'" >'+item.dataElementName+'</option>');
                                            });
                                        }else{
                                            YunpiAlert.error('数据元模版查询失败！');
                                        }
                                    },
                                    error: function () {
                                        YunpiAlert.error('数据元模版查询失败！');
                                    }
                                });
                            });
                        },
                        onSureClick: function () {
                            //TODO 获取修改数据进行验证，验证通过后提交信息，密码需要单独处理，如果密码是有效密码的后端进行保存，否则后端不进行密码修改
                            if ($('#metadataSetupForm').formVerify()) {
                                var data = $('#metadataSetupForm').getform();
                                YunpiAlert.success("元数据映射成功");
                                self.obj.metadataTable.bootstrapTable('refresh');
                                $('#metadataSetupForm').clearform();
                                YunpiDialog.close();
                            } else {
                                YunpiAlert.warning("提交失败，参数校验不通过");
                            }
                        }
                    });
                } else {
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiLight.close();
                YunpiAlert.error('查询失败，请重试！');
            }
        });
    }
};
$(function(){
    metadata.initMetadata();
});