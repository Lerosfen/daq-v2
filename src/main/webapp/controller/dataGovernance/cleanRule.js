/**
 * 清洗规则管理页面js
 */
$package("cleanRule");
cleanRule={
    /**
     * 初始化方法
     */
    initDictionary:function() {
        this.obj = {
            cleanAddTo : $('#cleanAddTo'),
            CleanState : $('#CleanState'),
            CleanType : $('#CleanType'),
            cleanSourceBtn : $('#cleanSourceBtn'),
            resetCleanBtn : $('#resetCleanBtn'),
            CleanTable : $('#CleanTable'),
        };
        this.initCleanDom();
        this.initEvent();//index页面事件初始化
    },
    /**
     * 页面初始化
     */
    initCleanDom:function(){
        var self = this;
        //获取状态
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/cleanRule/api/clean_status",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    $.each(responseData.data,function(i,item){
                        self.obj.CleanState.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('状态字典查询失败！');
            }
        });
        //获取类型
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/cleanRule/api/clean_type",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    $.each(responseData.data,function(i,item){
                        self.obj.CleanType.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('状态字典查询失败！');
            }
        });
        self.obj.CleanTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/cleanRule/cleanRuleList',
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
                title: '名称',
                width: 200
            }, {
                field: 'dicCode',
                title: '类型',
                width: 120
            },{
                field: 'dicDesc',
                title: '状态',
                width: 120,
                formatter: function (value, row, index) {
                    return row.dicDesc ==1?"启用":"禁用"
                }
            },{
                field:"createTime",
                title:"描述",
                width: 800
            },{
                field:"modifyTime",
                title:"创建时间",
                width: 350
            },{
                field:"modifyTime",
                title:"修改时间",
                width: 350
            },{
                field: 'id',
                title: '操作',
                width: 250,
                align: 'left',
                formatter: function (value, row, index) {
                    var id = value;
                    var result = "";
                    result += `<a href="#" onclick="cleanRule.viewById('${row.dicName}')" title="查看"><span class="glyphicon glyphicon-search"></span></a>`;
                    result += `<a href="#" onclick="cleanRule.editById('${id}')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>`;
                    result += row.dicDesc == 1?`<a href="#" onclick="cleanRule.forbidById('${ id}')" title="禁用"><span class="glyphicon glyphicon-ban-circle"></span></a>`:`<a href="#" onclick="cleanRule.useById('${ id}')" title="启用"><span class="glyphicon glyphicon-flash"></span></a><a href="#" onclick="cleanRule.deleteById('${id}')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>`
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
        self.obj.cleanAddTo.unbind().bind("click", function () {
            YunpiDialog.open({
                title:"添加清洗规则",
                url:"cleanRuleAdd.html",
                sureBtn:true,
                size:680,
                afterWinOpen:function(){
                    var cleanRuleAddHtml =
                        `
                        <form id="cleanRuleAddAddForm" class="yunpi-form">
                                <div class="input-group">
                                    <label><span>*</span>规则名</label>
                                    <input type="text" class="form-control" name="dataSourceName" placeholder="请输入规则名" required="required" regex="^.{2,20}$">
                                </div>
                                <div class="input-group">
                                    <label><span>*</span>规则类型</label>
                                    <select class="form-control" name="dataBaseType" required="required">
                                        <option selected="selected" value="">--请选择--</option>
                                        <option>shell</option>
                                        <option>jar</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label><span>*</span>规则文件</label>
                                    <input type="text" class="form-control" id="showFileName" name="dataRule"  required="required" readonly="readonly">
                                </div>
                                <div class="input-group">
                                   <div class="file">
                                         <label><span></span></label>
                                         <button id="checkDbLinkBtn" type="button" class="yunpi-btn yunpi-btn-blue">
                                            <span class="glyphicon glyphicon-transfer"></span>选择文件
                                        </button>
                                        <input type="file" name="" id="changepic" onchange="cleanRule.changepic(this)">
                                    </div>
                                </div>
                                <div class="input-group">
                                    <label><span>*</span>描述</label>
                                   <textarea class="form-control" rows="3"></textarea>
                                </div>
                         </form>
                        `
                    $("#cleanRuleAdd").html(cleanRuleAddHtml)
                },
                onSureClick:function(){
                    //TODO 提交信息
                    if($('#cleanRuleAddAddForm').formVerify()){
                        var data = $('#cleanRuleAddAddForm').getform();
                        YunpiAlert.success("数据源添加成功");
                        self.obj.CleanTable.bootstrapTable('refresh');
                        $('#cleanRuleAddAddForm').clearform();
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
        self.obj.cleanSourceBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            self.obj.CleanTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetCleanBtn.unbind().bind("click", function () {
            // 清空查询参数传递给服务端
            self.obj.CleanTable.bootstrapTable('refresh');
        });
    },
    /**
     *上传图片
     */
    changepic:function(a){
        var filePath=$("#changepic").val();
        if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("png")!=-1){
            $(".fileerrorTip").html("").hide();
            var arr=filePath.split('\\');
            var fileName=arr[arr.length-1];
            $("#showFileName").val(fileName);
        }else{
            $("#showFileName").val("");
            return false
        }
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
                console.log("responseData",responseData)
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看清洗规则详情",
                        url:"cleanRuleAdd.html",
                        sureBtn:false,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            var cleanRuleAddHtml =
                                `
                                <form id="cleanRuleAddAddForm" class="yunpi-form">
                                        <div class="input-group">
                                            <label><span>*</span>规则名</label>
                                            <input type="text" class="form-control" name="dataSourceName" placeholder="请输入规则名" value="清洗名称XXX" required="required" regex="^.{2,20}$" readonly="readonly">
                                        </div>
                                        <div class="input-group">
                                            <label><span>*</span>规则类型</label>
                                            <select class="form-control" id="selectName" name="dataBaseType" required="required" disabled="disabled">
                                                <option  value="">--请选择--</option>
                                                <option selected>shell</option>
                                                <option>jar</option>
                                            </select>
                                        </div>
                                        <div class="input-group">
                                            <label><span>*</span>规则文件</label>
                                            <input type="text" class="form-control" id="showFileName" name="dataRule"  required="required" readonly="readonly" value="规则文件XXX" readonly="readonly">
                                        </div>
                                        <div class="input-group">
                                           <div class="file">
                                                 <label><span></span></label>
                                                 <button id="checkDbLinkBtn" type="button"  class="yunpi-btn yunpi-btn-blue" disabled="disabled">
                                                    <span class="glyphicon glyphicon-transfer"></span>选择文件
                                                </button>
                                                <input type="file" name="" id="changepic" onchange="cleanRule.changepic(this)">
                                            </div>
                                        </div>
                                        <div class="input-group">
                                            <label><span>*</span>描述</label>
                                           <textarea class="form-control" rows="3" readonly="readonly">特产流众军听变志领对通习发工。</textarea>
                                        </div>
                                 </form>
                                `
                            $("#cleanRuleAdd").html(cleanRuleAddHtml)
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
            url: wwwroot + "/basic/configuration/"+id,
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    //打开修改窗口展示数据，供用户修改
                    YunpiDialog.open({
                        title:"编辑清洗规则",
                        url:"cleanRuleAdd.html",
                        sureBtn:true,
                        size:680,
                        afterWinOpen:function(){//打开页面时赋值
                            var cleanRuleAddHtml =
                                `
                                <form id="cleanRuleAddAddForm" class="yunpi-form">
                                        <div class="input-group">
                                            <label><span>*</span>规则名</label>
                                            <input type="text" class="form-control" name="dataSourceName" placeholder="请输入规则名" value="清洗名称XXX" required="required" regex="^.{2,20}$">
                                        </div>
                                        <div class="input-group">
                                            <label><span>*</span>规则类型</label>
                                            <select class="form-control" id="selectName" name="dataBaseType" required="required">
                                                <option  value="">--请选择--</option>
                                                <option selected>shell</option>
                                                <option>jar</option>
                                            </select>
                                        </div>
                                        <div class="input-group">
                                            <label><span>*</span>规则文件</label>
                                            <input type="text" class="form-control" id="showFileName" name="dataRule"  required="required"  value="规则文件XXX">
                                        </div>
                                        <div class="input-group">
                                           <div class="file">
                                                 <label><span></span></label>
                                                 <button id="checkDbLinkBtn" type="button" class="yunpi-btn yunpi-btn-blue">
                                                    <span class="glyphicon glyphicon-transfer"></span>选择文件
                                                </button>
                                                <input type="file" name="" id="changepic" onchange="cleanRule.changepic(this)">
                                            </div>
                                        </div>
                                        <div class="input-group">
                                            <label><span>*</span>描述</label>
                                           <textarea class="form-control" rows="3">特产流众军听变志领对通习发工。</textarea>
                                        </div>
                                 </form>
                                `
                            $("#cleanRuleAdd").html(cleanRuleAddHtml)
                        },
                        onSureClick:function(){

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
     * 禁用
     * */
    forbidById:function (id) {
        var self = this;
        YunpiConform.open("您确定要禁用该数据元吗?","禁用该数据元后，数据元将不可用，引用该数据元的元数据将失去规则约束。",function(){
            self.obj.CleanTable.bootstrapTable('refresh');
            YunpiAlert.success("禁用成功！");
        });
    },
    /**
     * 启用
     */
    useById:function (id) {
        var self = this;
        YunpiAlert.success("启用成功！");
        self.obj.CleanTable.bootstrapTable('refresh');
    },
    /**
     *删除 
     */
    deleteById:function (id) {
        var self = this;
        YunpiConform.open("您确定要删除该数据源吗?",function(){
            self.obj.CleanTable.bootstrapTable('refresh');
        });
    }
};
$(function(){
    cleanRule.initDictionary();
});