$package("entityModel");
entityModel = {
    initEntityModel: function(){
        this.obj = {
            entityModelTable: $("#entityModelTable"),
            addBtn: $("#addBtn"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
            themeSel: $("#themeSel"),
            modelName: $("#modelName")
        };
        this.data = {
            statusDict: [],
            themeDict: [],
            fieldArr: []
        }
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + '/base/api/dictionary/pc_status',
            async: false,
            success: function(res){
                if(res.code == "code_200"){
                    self.data.statusDict = res.data.toDict("dicCode", true);
                }
            },
            error: function(){
                YunpiAlert.error("状态查询失败");
            }
        });
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + '/base/api/dictionary/theme_status',
            async: false,
            success: function(res){
                if(res.code == "code_200"){
                    self.data.themeDict = res.data;
                    $.each(res.data,function(i,item){
                        self.obj.themeSel.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                }
            }
        })
        self.obj.entityModelTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/entityModel',
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
                title: '名称',
                width: 500
            }, {
                field: 'modelCode',
                title: '编码',
                width: 400
            },{
                field: 'themeType',
                title: '主题分类',
                width: 400
            },{
                field: 'status',
                title: '物化状态',
                width: 200,
                formatter: function(val) {
                    return self.data.statusDict.getText(val,"dicName");
                }
            },{
                field:"pcTime",
                title:"物化时间",
                width: 350
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
                    result += '<a href="#" onclick="entityModel.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                    result += '<a href="#" onclick="entityModel.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                    if(row.status==0){
                        result += '<a href="#" onclick="entityModel.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                        result += '<a href="#" onclick="entityModel.pcTable(\'' + id + '\')" title="物化表"><span class="glyphicon pcTable"></span></a>';
                    }else{
                        result += '<a href="#" onclick="entityModel.rePcTable(\'' + id + '\')" title="重新物化表"><span class="glyphicon rePcTable"></span></a>';
                        result += '<a href="#" onclick="entityModel.publishModel(\'' + id + '\')" title="发布"><span class="glyphicon glyphicon-inbox"></span></a>';
                        result += '<a href="#" onclick="entityModel.fillModel(\'' + id + '\')" title="数据填充设置"><span class="glyphicon glyphicon-tint"></span></a>';
                    }
                    return result;
                }
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.addBtn.unbind().bind("click", function(){
            YunpiDialog.open({
                title: "添加实体模型",
                url: "addEntityModel.html",
                size: 680,
                sureBtn: true,
                afterWinOpen: function(){
                    $.each(self.data.themeDict,function(i,item){
                        $("select[name='themeType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                    });
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: wwwroot+'/dataGovernance/selMedaData',
                        success: function(res){
                            var data = res.rows;
                            var html = "";
                            for(var i = 0; i < data.length; i++){
                                html += '<tr><td><input type="checkbox"></td><td>'+data[i].dataName+'</td><td>'+data[i].dataDesc+'</td><td>'+data[i].dataType+'</td></tr>';
                            }
                            $(html).appendTo($("#addColsTable"));
                        }
                    });
                    // 全选
                    $("input[name='checkedAll']").change(function () {
                        var checkList = $(this).parent().parent().parent().siblings().find("input[type='checkbox']");
                        if($(this).prop("checked")){
                            checkList.prop("checked", true);
                        }else{
                            checkList.prop("checked", false);
                        }
                    });
                    // 点击行选中checkbox
                    $("#addColsTable").on("click", "tr", function(){
                        var currentCkbox = $(this).children(":first").children();
                        if(currentCkbox.prop("checked")){
                            currentCkbox.prop("checked", false);
                        }else{
                            currentCkbox.prop("checked", true);
                        }
                    })
                },
                onSureClick: function(){
                    if($("#addEntityModelForm").formVerify()){
                        YunpiAlert.success("模型添加成功！");
                        self.obj.entityModelTable.bootstrapTable("refresh");
                        $("#addEntityModelForm").clearform();
                        YunpiDialog.close();
                    }else{
                        YunpiAlert.warning("提交失败，参数校验不通过！");
                    }
                }
            })
        });
        self.obj.searchBtn.unbind().bind("click", function(){
            self.obj.entityModelTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.themeSel.val("");
            self.obj.modelName.val("");
            self.obj.entityModelTable.bootstrapTable("refresh");
        });
    },
    viewById: function(id){
        var self = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + '/dataGovernance/entityModel/' + id,
            success: function(res){
                if(res.code == "code_200"){
                    YunpiDialog.open({
                        title: "查看实体模型",
                        url: "viewEntityModel.html",
                        size: 680,
                        sureBtn: false,
                        afterWinOpen: function(){
                            $("#viewEntityModelForm").setform(res.data);
                            var tblData = res.data.cols;
                            var html = "";
                            for(var i = 0; i < tblData.length; i++){
                                html += '<tr><td>'+ tblData[i].dataName +'</td><td>'+ tblData[i].dataDesc +'</td><td>'+ tblData[i].dataType +'</td></tr>';
                            }
                            $(html).appendTo($("#viewColsTable"));
                        }
                    })
                }
            }
        })
    },
    editById: function(id){
        var self = this;
        YunpiDialog.open({
            /* 复用添加模型页面 */
            title: "修改实体模型",
            url: "addEntityModel.html",
            size: 680,
            sureBtn: true,
            afterWinOpen: function(){
                $.each(self.data.themeDict,function(i,item){
                    $("select[name='themeType']").append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>')
                });
                $("#addEntityModelForm").setform({modelName: "模型XXX", modelCode: "XXX"});
                $("select[name='themeType']").children().eq(3).attr("selected", true);
                $("select[name='metaDataUnit']").children().eq(2).attr("selected", true);
                $("select[name='belongDomain']").children().eq(1).attr("selected", true);
                $("select[name='metaData']").children().eq(2).attr("selected", true);
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: wwwroot+'/dataGovernance/selMedaData',
                    success: function(res){
                        var data = res.rows;
                        var html = "";
                        for(var i = 0; i < data.length; i++){
                            html += '<tr><td><input type="checkbox"></td><td>'+data[i].dataName+'</td><td>'+data[i].dataDesc+'</td><td>'+data[i].dataType+'</td></tr>';
                        }
                        $(html).appendTo($("#addColsTable"));
                        // 默认前两个选中
                        $("#addColsTable").children(":first").children(":first").children().attr("checked", true);
                        $("#addColsTable").children().eq(1).children(":first").children().attr("checked", true);
                    }
                });
            },
            beforeWinClose: function(){
                $('#addEntityModelForm').clearform();
            },
            onSureClick: function(){
                if($("#addEntityModelForm").formVerify()){
                    YunpiAlert.success("修改实体模型成功！");
                    self.obj.entityModelTable.bootstrapTable("refresh");
                    $("#addEntityModelForm").clearform();
                    YunpiDialog.close();
                }else{
                    YunpiAlert.warning("提交失败，参数校验不通过！");
                }
            }
        })
    },
    pcTable: function(id){
        var self = this;
        if(Math.random()>0.5){
            YunpiAlert.success("物化表成功！");
            self.obj.entityModelTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("物化表失败！");
        }
    },
    rePcTable: function(id){
        var self = this;
        if(Math.random()>0.5){
            YunpiAlert.success("重新物化表成功！");
            self.obj.entityModelTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("重新物化表失败！");
        }
    },
    deleteById: function(id){
        var self = this;
        YunpiConform.open("您确定删除该实体模型吗?", null, function(){
            YunpiAlert.success("删除成功！");
            self.obj.entityModelTable.bootstrapTable("refresh");
        })
    },
    publishModel: function(id){
        var self = this;
        YunpiAlert.success("发布成功！");
        self.obj.entityModelTable.bootstrapTable("refresh");
    },

    fillModel: function(id){
        var self = this;
        YunpiDialog.open({
            title: "数据填充设置",
            url: "entityModelDataFill.html",
            size: 1200,
            sureBtn: true,
            afterWinOpen: function(){
                $("select[name='selMainKey']").multipleSelect({
                    width:"220px",
                    placeholder: "请选择",
                    selectAll:false,
                    /*onCheckAll: function () {

                    },*/
                });
                $("select[name='tableTypeSel']").change(function(){
                    var val = parseInt($(this).val());
                    switch (val) {
                        case 1:
                            $(".daqTbl").show();
                            $(".cleanTbl").hide();
                            $(".fuseTbl").hide();
                            break;
                        case 2:
                            $(".daqTbl").hide();
                            $(".cleanTbl").show();
                            $(".fuseTbl").hide();
                            break;
                        case 3:
                            $(".daqTbl").hide();
                            $(".cleanTbl").hide();
                            $(".fuseTbl").show();
                            break;
                    }
                })
                $.ajax({
                    type: "GET",
                    dataType: "JSON",
                    url: wwwroot + '/dataGovernance/entityModel/'+ id,
                    success: function(res){
                        self.data.fieldArr = res.data.cols;
                    }
                })
                var graph = new joint.dia.Graph();
                var paper = new joint.dia.Paper({
                    // 挂载的dom元素
                    el: $('#paint'),
                    // 关联声明的graph
                    model: graph,
                    width: 694.8,
                    height: 600,
                    gridSize: 1
                });
                $(".model").draggable({
                    helper: "clone",
                    scope: "drop"
                });
                $("#paint").droppable({
                    scope: "drop",
                    drop: function(e, ui){
                        var allEle = graph.getCells();
                        var name = $(ui.draggable).html();
                        var eleArr = [];
                        $.each(allEle, function(index, item){
                            eleArr.push(item.attributes.attrs.label.text);
                        });
                        if(eleArr.indexOf(name) < 0){
                            var positionX = e.clientX - $(this).offset().left - e.offsetX;
                            var positionY = e.clientY - $(this).offset().top - e.offsetY;
                            var tblEllipse = new joint.shapes.standard.Rectangle();
                            tblEllipse.resize(100, 40);
                            tblEllipse.position(positionX, positionY);
                            tblEllipse.attr({
                                body: {
                                    fill: "#fff"
                                },
                                label: {
                                    text: name,
                                    fill: "#000"
                                }
                            });
                            tblEllipse.addTo(graph);
                        }else{
                            YunpiAlert.error("请勿重复拖拽！");
                        }
                    }
                });
                paper.on('cell:pointerclick',function(e, d) {
                    var tblName = $(e.$el).children(":last").children().html();
                    $('#tblFieldTable').empty();
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: wwwroot + '/dataGovernance/metaDataFromTbl/' + 123,
                        success: function(res){
                            if(res.code == "code_200"){
                                $(".nodata").hide();
                                var opt = "<option>请选择</option>";
                                $.each(self.data.fieldArr, function(index, item){
                                    opt += '<option value="'+ item.dataName +'">'+ item.dataName +'</option>';
                                });
                                var html = "";
                                var opts = "";
                                $.each(res.data, function(index, item){
                                    html += '<tr><td>'+item.fieldName+'</td><td>'+item.fieldDesc+'</td><td><select class="form-control">'+ opt +'</select></td></tr>';
                                 /*   opts += `<li class=" ">
                                                    <label class="">
                                                        <input type="checkbox" value="" data-key="option_${index}" data-name="selectItemselMainKey">
                                                        <span>${item.fieldName}</span>
                                                    </label>
                                                 </li>`*/
                                });
                                $("#tblFieldTable").append($(html));
                                // 多选下拉框
                                /*$("div.ms-drop").children(":first").append($(opts));*/
                                $.each($("#tblFieldTable").children(), function(index, item){
                                    var currentField = $(item).children(":first").html();
                                    var opt = $(item).children(":last").children().children();
                                    for(var i = 0; i < opt.length ; i++){
                                        if($(opt[i]).val() == currentField){
                                            $(opt[i]).prop("selected", true);
                                        }
                                    }
                                });
                            }
                        }
                    })
                });
            },
            onSureClick: function(){
                YunpiAlert.success("配置成功！");
                YunpiDialog.close();
            }
        })
    }
};
$(function(){
    entityModel.initEntityModel()
})