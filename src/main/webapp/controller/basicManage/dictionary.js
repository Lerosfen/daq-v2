/**
 * 字典管理页面js
 */
$package("dictionary");
dictionary={
	/**
	 * 初始化方法
	 */
    initDictionary:function() {
		this.obj = {
            addDicBtn : $('#addDicBtn'),
            selectDicBtn : $('#selectDicBtn'),
            resetDicBtn : $('#resetDicBtn'),
            dicName : $('#dicName'),
            dictionaryTable : $('#dictionaryTable'),
            addDicIem : $('#addDicIem'),
            addDicIem : $('#addDicIem'),
		};
		this.initDom();
        this.initEvent();//index页面事件初始化
	},
    /**
     * 页面初始化
     */
    initDom:function(){
        var self = this;
        self.obj.dictionaryTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/basic/dictionary',
            //queryParams: "queryParams",
            toolbar: "#toolbar",
            height:$(window).height()-100,
            striped: true, // 是否显示行间隔色
            uniqueId: "id",
            pageSize: 20,
            pageList: [20],
            pagination: true, // 是否分页
            sortable: false, // 是否启用排序
            sidePagination: "server",
            onlyInfoPagination:false,
            paginationPreText: "上一页",
            paginationNextText: "下一页",
            columns: [{
                    field: 'dicName',
                    title: '字典名称',
                    width: 500
                }, {
                    field: 'dicCode',
                    title: '字典编码',
                    width: 400
                },{
                    field: 'dicDesc',
                    title: '字典描述',
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
                    align: 'center',
                    formatter: function (value, row, index) {
                        var id = value;
                        var result = "";
                        result += '<a href="#" onclick="dictionary.viewById(\'' + id + '\')" title="查看"><span class="glyphicon glyphicon-search"></span></a>';
                        result += '<a href="#" onclick="dictionary.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                        result += '<a href="#" onclick="dictionary.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
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
        self.obj.addDicBtn.unbind().bind("click", function () {
        	YunpiDialog.open({
				title:"添加字典",
				url:"dictionaryAdd.html",
                sureBtn:true,
                size:1200,
                afterWinOpen:function(){
                    $(".addDicItem").unbind().bind("click",function(){
                        //声明要加入的对象
                        var $item = $('<tr><td>名称：</td><td><input name="dicName" class="form-control" /></td>' +
                            '<td>编码：</td><td><input name="dicCode" class="form-control" /></td>' +
                            '<td><span class="glyphicon glyphicon-remove removeItem" aria-hidden="true"></span></td>' +
                            '</tr>');
                        //将字典项加入到页面
                        $(this).closest("table").find("tbody").append($item);
                        //为新加入的字典项绑定方法
                        $item.find("span").unbind().bind("click",function(){
                            $(this).closest("tr").remove();
                        });
                    });
                    /**
                     * 为原来的字典项绑定方法点击移除字典项时执行
                     */
                    $(".removeItem").unbind().bind("click",function(){
                        $(this).closest("tr").remove();
                    });
                },
                onSureClick:function(){
                    //1.验证字典项
                    var dataItems = $("#addDicItemsForm").serializeArray();
                    var flag = true;//标识字典项是否验证通过
                    var itemsArray = [];
                    if(dataItems && dataItems.length > 0){
                        for(var i = 0 ; (i < dataItems.length && i < dataItems.length-1) ; i +=2){
                            var dicName = dataItems[i];
                            var dicCode = dataItems[i+1];
                            if(dicName.value && dicName.value!="" && dicCode.value && dicCode.value!=""){
                                itemsArray.push({
                                    "dicName" : dicName.value,
                                    "dicCode" : dicCode.value
                                });
                            }else{
                                flag = false;
                                break;
                            }
                        }
                    }
                    //2.如果字典项和字典值都验证通过，则进行提交
                    if($('#dicAddForm').formVerify() && flag){
                        var data = $('#dicAddForm').getform();
                        data.children = itemsArray;
                        //打印要提交的数据
                        YunpiConsole.log(data);//TODO 提交信息
                        YunpiAlert.success("字典添加成功");
                        self.obj.dictionaryTable.bootstrapTable('refresh');
                        $('#dicAddForm').clearform();
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
        self.obj.selectDicBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            self.obj.dictionaryTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetDicBtn.unbind().bind("click", function () {
            self.obj.dicName.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.dictionaryTable.bootstrapTable('refresh');
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
            url: wwwroot + "/basic/dictionary/"+id,
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看字典详情",
                        url:"dictionaryView.html",
                        sureBtn:false,
                        size:1200,
                        afterWinOpen:function(){//打开页面时赋值
                            $('#dicViewForm').setform(responseData.data);
                            //设置字典项
                            $.each(responseData.data.children,function(i,item){
                                $('#viewDicItems').append('<tr><td>名称：</td><td><input name="dicName" class="form-control" readonly="readonly" value="'+item.dicName+'"/></td>' +
                                    '<td>编码：</td><td><input name="dicCode" class="form-control" readonly="readonly" value="'+item.dicCode+'"/></td></tr>');
                            });
                        },
                        beforeWinClose:function(){//关闭时清空form
                            $('#dicViewForm').clearform();
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
            url: wwwroot + "/basic/dictionary/"+id,
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑字典",
                        url:"dictionaryEdit.html",
                        sureBtn:true,
                        size:1200,
                        afterWinOpen:function(){//打开页面时赋值
                            $('#dicEditForm').setform(responseData.data);
                            //设置字典项
                            $.each(responseData.data.children,function(i,item){
                                $('#editDicItems').append('<tr><td>名称：</td><td><input name="dicName" class="form-control" value="'+item.dicName+'"/></td>' +
                                    '<td>编码：</td><td><input name="dicCode" class="form-control" value="'+item.dicCode+'"/></td>' +
                                    '<td><span class="glyphicon glyphicon-remove removeItem" aria-hidden="true"></span></td></tr>');
                            });
                            /**
                             * 点击添加字典项时执行
                             */
                            $(".addDicItem").unbind().bind("click",function(){
                                //声明要加入的对象
                                var $item = $('<tr><td>名称：</td><td><input name="dicName" class="form-control" /></td>' +
                                    '<td>编码：</td><td><input name="dicCode" class="form-control" /></td>' +
                                    '<td><span class="glyphicon glyphicon-remove removeItem" aria-hidden="true"></span></td>' +
                                    '</tr>');
                                //将字典项加入到页面
                                $(this).closest("table").find("tbody").append($item);
                                //为新加入的字典项绑定方法
                                $item.find("span").unbind().bind("click",function(){
                                    $(this).closest("tr").remove();
                                });
                            });
                            /**
                             * 为原来的字典项绑定方法点击移除字典项时执行
                             */
                            $(".removeItem").unbind().bind("click",function(){
                                $(this).closest("tr").remove();
                            });
                        },
                        onSureClick:function(){
                            //1.验证字典项
                            var dataItems = $("#editDicItemsForm").serializeArray();
                            var flag = true;//标识字典项是否验证通过
                            var itemsArray = [];
                            if(dataItems && dataItems.length > 0){
                                for(var i = 0 ; (i < dataItems.length && i < dataItems.length-1) ; i +=2){
                                    var dicName = dataItems[i];
                                    var dicCode = dataItems[i+1];
                                    if(dicName.value && dicName.value!="" && dicCode.value && dicCode.value!=""){
                                        itemsArray.push({
                                            "dicName" : dicName.value,
                                            "dicCode" : dicCode.value
                                        });
                                    }else{
                                        flag = false;
                                        break;
                                    }
                                }
                            }
                            //2.如果字典项和字典值都验证通过，则进行提交
                            if($('#dicEditForm').formVerify() && flag){
                                var data = $('#dicEditForm').getform();
                                data.children = itemsArray;//TODO 获取修改数据进行验证，验证通过后提交信息
                                YunpiAlert.success("字典修改成功");
                                self.obj.dictionaryTable.bootstrapTable('refresh');
                                $('#dicEditForm').clearform();
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
        YunpiConform.open("您确定要删除该字典吗?","删除字典后，可能导致系统不稳定！",function(){
            //TODO 根据ID删除字典信息，删除完成后刷新列表
            self.obj.dictionaryTable.bootstrapTable('refresh');
            YunpiAlert.success("删除成功！");
        });
    }
};
$(function(){
    dictionary.initDictionary();
});