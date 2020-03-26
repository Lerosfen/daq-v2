/**
 * 图表管理页面js
 */
$package("chart");
chart={
	/**
	 * 初始化方法
	 */
    initChart:function() {
		this.obj = {
            addChartBtn : $('#addChartBtn'),
            selectChartBtn : $('#selectChartBtn'),
            resetChartBtn : $('#resetChartBtn'),
            chartName : $('#chartName'),
            isShare : $('#isShare'),
            chartTable : $('#chartTable')
		};
		this.vars={
		    isShareDic:[]
        };
		this.initDom();
        this.initEvent();//index页面事件初始化
	},
    /**
     * 页面初始化
     */
    initDom:function(){
        var self = this;
        //获取是否共享的通用状态
        $.ajax({
            type: "GET",
            dataType: 'json',
            url: wwwroot + '/base/api/dictionary/yes_or_no',
            async: false,
            success: function(res){
                if(res.code == "code_200"){
                    $.each(res.data, function(i, item){
                        self.obj.isShare.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                    self.vars.isShareDic = res.data.toDict("dicCode",true);
                }
            }
        });

        self.obj.chartTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/visualization/chartDIY',
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
                    field: 'chartName',
                    title: '图表名称',
                    width: 900
                },{
                    field: 'isShare',
                    title: '是否共享',
                    width: 500,
                    formatter: function(value, row, index) {
                        return self.vars.isShareDic.getText(value,"dicName");
                    }
                },{
                    field: 'chartDesc',
                    title: '图表描述',
                    width: 900
                },{
                    field:"createTime",
                    title:"创建时间",
                    width: 650
                },{
                    field:"modifyTime",
                    title:"修改时间",
                    width: 650
                },{
                    field: 'id',
                    title: '操作',
                    width: 550,
                    align: 'left',
                    formatter: function(value, row, index) {
                        var id = value;
                        var result = "";
                        result += '<a href="#" onclick="chart.viewById(\'' + id + '\')" title="查看"><span class="glyphicon glyphicon-search"></span></a>';
                        result += '<a href="#" onclick="chart.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                        result += '<a href="#" onclick="chart.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
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
        self.obj.addChartBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"添加图表",
				url:"chartDIYAdd.html",
                sureBtn:true,
                size:1100,
                afterWinOpen:function(){
                    $('#chartAddForm select[name="chartType"]').bind("change",function(){
                        var name = $(this).val();
                        if(isNull(name)){
                            name = "show";
                            $('#typeColGroup').hide();
                        }else if(name == "pie" || name == "pieDoughnut" || name == "pieRoseType1" || name == "pieRoseType2"){
                            $('#typeColGroup').hide();
                        }else{
                            $('#typeColGroup').show();
                        }
                        $("#chartShowDiv").attr("src","/resources/img/visualization/"+name+".png");
                    });
                },
                onSureClick:function(){
				    //TODO 提交信息
                    if($('#chartAddForm').formVerify()){
                        var data = $('#chartAddForm').getform();
                        YunpiAlert.success("图表添加成功");
                        self.obj.chartTable.bootstrapTable('refresh');
                        $('#chartAddForm').clearform();
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
        self.obj.selectChartBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            self.obj.chartTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetChartBtn.unbind().bind("click", function () {
            self.obj.chartName.val("");
            self.obj.isShare.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.chartTable.bootstrapTable('refresh');
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
            url: wwwroot + "/visualization/chartDIY/"+id,
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看图表详情",
                        url:"chartDIYView.html",
                        sureBtn:false,
                        size:1100,
                        afterWinOpen:function(){//打开页面时赋值
                            $('#chartViewForm').setform(responseData.data);
                            var name = responseData.data.chartType;
                            if(isNull(name)){
                                name = "show";
                                $('#typeColGroup').hide();
                            }else if(name == "pie" || name == "pieDoughnut" || name == "pieRoseType1" || name == "pieRoseType2"){
                                $('#typeColGroup').hide();
                            }else{
                                $('#typeColGroup').show();
                            }
                            $("#chartShowDiv").attr("src","/resources/img/visualization/"+name+".png");
                        },
                        beforeWinClose:function(){//关闭时清空form
                            $('#chartViewForm').clearform();
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
            url: wwwroot + "/visualization/chartDIY/"+id,
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑图表",
                        url:"chartDIYEdit.html",
                        sureBtn:true,
                        size:1100,
                        afterWinOpen:function(){//打开页面时赋值
                            $('#chartEditForm').setform(responseData.data);
                            var name = responseData.data.chartType;
                            if(isNull(name)){
                                name = "show";
                                $('#typeColGroup').hide();
                            }else if(name == "pie" || name == "pieDoughnut" || name == "pieRoseType1" || name == "pieRoseType2"){
                                $('#typeColGroup').hide();
                            }else{
                                $('#typeColGroup').show();
                            }
                            $("#chartShowDiv").attr("src","/resources/img/visualization/"+name+".png");
                            //添加图表修改事件
                            $('#chartEditForm select[name="chartType"]').bind("change",function(){
                                var name = $(this).val();
                                if(isNull(name)){
                                    name = "show";
                                    $('#typeColGroup').hide();
                                }else if(name == "pie" || name == "pieDoughnut" || name == "pieRoseType1" || name == "pieRoseType2"){
                                    $('#typeColGroup').hide();
                                }else{
                                    $('#typeColGroup').show();
                                }
                                $("#chartShowDiv").attr("src","/resources/img/visualization/"+name+".png");
                            });
                        },
                        onSureClick:function(){
                            //TODO 获取修改数据进行验证，验证通过后提交信息
                            if($('#chartEditForm').formVerify()){
                                var data = $('#chartEditForm').getform();
                                YunpiAlert.success("图表修改成功");
                                self.obj.chartTable.bootstrapTable('refresh');
                                $('#chartEditForm').clearform();
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
        YunpiConform.open("您确定要删除该图表吗?","删除该图表后，系统将使用默认图表值运行，可能导致系统不稳定！",function(){
            //TODO 根据ID删除图表信息，删除完成后刷新列表
            self.obj.chartTable.bootstrapTable('refresh');
            YunpiAlert.success("删除成功！");
        });
    }
};
$(function(){
    chart.initChart();
});