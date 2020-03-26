$package("fusionStrategy");

fusionStrategy = {
    initFusionStrategy: function(){
        this.obj = {
            fusionStrategyTable: $("#fusionStrategyTable"),
            addBtn: $("#addBtn"),
            fusionName: $("#fusionName"),
            statusSel: $("#statusSel"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn")
        };
        this.data = {
            statusDic: [],
            fieldArr: [],
            currentEle: ""
        };
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            url: wwwroot + '/base/api/dictionary/db_source_status',
            success: function(res){
                if(res.code == "code_200"){
                    self.data.statusDic = res.data.toDict("dicCode", true);
                    $.each(res.data, function(i, item){
                        self.obj.statusSel.append("<option value="+item.dicCode+">" + item.dicName + "</option>")
                    });
                }
            }
        })
        self.obj.fusionStrategyTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/fusionStrategy',
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
                field: 'fusionName',
                title: '融合名称',
                width: 500
            },{
                field: 'status',
                title: '状态',
                width: 400,
                formatter: function(value) {
                    return self.data.statusDic.getText(value,"dicName");
                }
            },{
                field:"createTime",
                title:"创建时间",
                width: 350
            },{
                field:"createUser",
                title:"创建人",
                width: 350
            },{
                field: 'id',
                title: '操作',
                width: 200,
                align: 'left',
                formatter: function (value, row, index) {
                    var id = value;
                    var result = "";
                    result += `<a href="#" onclick="fusionStrategy.viewById('${id}')" title="查看详情">
                                                <span class="glyphicon glyphicon-search"></span>
                                         </a>`
                    result += `<a href="#" onclick="fusionStrategy.viewData('${id}','${row.fusionName}')" title="查看数据"><span class="glyphicon view-data"></span></a>`;
                    if(row.status == 1){//启用状态时显示禁用按钮
                        result += '<a href="#" onclick="fusionStrategy.forbidById(\'' + id + '\')" title="禁用"><span class="glyphicon glyphicon-off"></span></a>';
                    }
                    if(row.status == 2){
                        result += '<a href="#" onclick="fusionStrategy.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                        result += '<a href="#" onclick="fusionStrategy.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                    }
                    return result;
                }
            }]
        });
    },
    deleteById: function(id){
        var self = this;
        YunpiConform.open("您确定要删除该融合策略吗？", null, function(){
            YunpiAlert.success("删除成功！");
            self.obj.fusionStrategyTable.bootstrapTable("refresh");
        })
    },
    viewData:function(id,dicName){
        $.ajax({
            type: 'get',
            dataType: 'json',
            async: false,
            url: wwwroot + "/Obtain/ObtainHeader/"+id,
            success: function (responseData) {
                console.log("responseData",responseData)
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看融合结果数据",
                        url:"fusionResult.html",
                        sureBtn:false,
                        size:1200,
                        afterWinOpen:function(){//打开页面时赋值
                            $("#FusionResultName").val(dicName);
                            $("#FusionResultTable").bootstrapTable({data:[]});
                            $("#FusionResultTable").bootstrapTable("showLoading");
                            setTimeout(function(){
                                $("#FusionResultTable").bootstrapTable('destroy');
                                $("#FusionResultTable").bootstrapTable({
                                    method: 'POST',
                                    url: wwwroot + '/cleanRule/TableData',
                                    // toolbar: "#toolbar",
                                    height: $(window).height() - 340,
                                    striped: true, // 是否显示行间隔色
                                    uniqueId: "id",
                                    pageSize: 20,
                                    pageList: [20],
                                    pagination: true, // 是否分页
                                    sortable: false, // 是否启用排序
                                    sidePagination: "server",
                                    onlyInfoPagination: false,
                                    paginationPreText: "上一页",
                                    paginationNextText: "下一页",
                                    columns: responseData.columns,
                                    onLoadSuccess:function(data){
                                        //通过对data判断
                                        console.log("this is data",data)
                                        $("#FusionResultTable").bootstrapTable("hideLoading");
                                    }
                                })
                            },1000);
                        },
                        beforeWinClose:function(){//关闭时清空form
                            // $('#dicViewForm').clearform();
                        }
                    });
                }else{
                    // YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('查询失败，请重试！');
            }
        });
    },
    viewById: function(id){
        YunpiDialog.open({
            title: "查看融合策略",
            url: "viewFusionStrategy.html",
            size: 900,
            sureBtn: false,
            afterWinOpen: function(){
                $("input[name='fuseName']").val("融合XXX");
                $("select[name='selMainKey']").multipleSelect({
                    width:"370px",
                    selectAll:false
                });
                $("select[name='selMainKey']").multipleSelect('disable');
                var graph = new joint.dia.Graph();
                var paper = new joint.dia.Paper({
                    // 挂载的dom元素
                    el: $('#paint'),
                    // 关联声明的graph
                    model: graph,
                    width: 449,
                    height: 600,
                    gridSize: 1
                });
                // w: 449-100 = 349  h: 600-40=560
                // Math.ceil(Math.random() * 349);
                // Math.ceil(Math.random() * 560);
                var px = Math.ceil(Math.random() * 349);
                var py = Math.ceil(Math.random() * 560);
                var tbl1 = new joint.shapes.standard.Rectangle();
                tbl1.resize(100, 40);
                tbl1.position(px,  py);
                tbl1.attr({
                    body: {
                        fill: "#fff"
                    },
                    label: {
                        text: "采集表1",
                        fill: "#000"
                    }
                });
                var tbl2 = tbl1.clone();
                tbl2.position(200,300);
                tbl2.attr({
                    body: {
                      fill: "#4C93FB"
                    },
                    label: {
                        text: "清洗表1",
                        fill: "#000"
                    }
                });
                var pxs = Math.ceil(Math.random() * 349);
                var pys = Math.ceil(Math.random() * 560);
                var tbl3 = tbl1.clone();
                tbl3.position(pxs,pys);
                tbl3.attr({
                    label: {
                        text: "融合表1",
                        fill: "#000"
                    }
                });
                tbl1.addTo(graph);
                tbl2.addTo(graph);
                tbl3.addTo(graph);
                paper.on('cell:pointerclick',function(e, d) {
                    var a = Math.floor(Math.random() * 5);
                    var b = Math.floor(Math.random() * 5);
                    var c = Math.floor(Math.random() * 5);
                    $("select[name='selMainKey']").multipleSelect("setSelects", [a, b, c]);
                    var fill = e.$el.children(":first").attr("fill");
                    if(fill == "#fff"){
                        // 辅表
                        $("#fillTbl").show();
                        $("#mainTable").hide();
                        $('#tblFieldTable').empty();
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: wwwroot + '/dataGovernance/metaDataFromTbl/' + 123,
                            success: function(res){
                                if(res.code == "code_200"){
                                    $(".nodata").hide();
                                    var html = "";
                                    $.each(res.data, function(index, item){
                                        html += '<tr><td>'+item.fieldName+'</td><td>'+item.fieldDesc+'</td><td><select class="form-control" disabled="disabled"><<option value="" selected>元数据test</option>></select></td><td><input type="checkbox" disabled="disabled"></td></tr>';
                                    });
                                    $("#tblFieldTable").append($(html));
                                    /*$.each($("#tblFieldTable").children(), function(index, item){
                                        var currentField = $(item).children(":first").html();
                                        var opt = $(item).children().eq(2).children().children();
                                        for(var i = 0; i < opt.length ; i++){
                                            if($(opt[i]).val() == currentField){
                                                $(opt[i]).prop("selected", true);
                                            }
                                        }
                                    });*/
                                }
                            }
                        })
                    }else{
                        $("#fillTbl").hide();
                        $("#mainTable").show();
                        $('#mainTableTbody').empty();
                        // 主表
                        $.ajax({
                            type: "GET",
                            dataType: "JSON",
                            url: wwwroot + '/dataGovernance/metaDataFromTbl/' + 123,
                            success: function(res){
                                if(res.code == "code_200"){
                                    $(".nodata").hide();
                                    var html = "";
                                    $.each(res.data, function(index, item){
                                        html += '<tr><td>'+item.fieldName+'</td><td>'+item.fieldDesc+'</td></tr>';
                                    });
                                    $("#mainTableTbody").append($(html));
                                }
                            }
                        })
                    }
                });
            }
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.fusionStrategyTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.fusionName.val("");
            self.obj.statusSel.val("");
            self.obj.fusionStrategyTable.bootstrapTable("refresh");
        });
        self.obj.addBtn.unbind().bind("click", function(){
            YunpiDialog.open({
                title: "添加融合策略",
                url: "addFusionStrategy.html",
                size: 1200,
                sureBtn: true,
                afterWinOpen: function(){
                    $("select[name='selMainKey']").multipleSelect({
                        width:"280px",
                        placeholder: "请选择",
                        selectAll:false,
                        /*onCheckAll: function () {

                        },*/
                    });
                    $("select[name='selMainKey']").multipleSelect('disable');
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
                    });
                    $(".model").draggable({
                        helper: "clone",
                        scope: "drop"
                    });
                    $.ajax({
                        type: "GET",
                        dataType: "JSON",
                        url: wwwroot + '/dataGovernance/entityModel/'+ 123,
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
                        width: 630,
                        height: 600,
                        gridSize: 1
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
                    var isShow = true;
                    var isMain = true;
                    // 画布右键事件
                    paper.on('cell:contextmenu',function(e, d) {
                        self.data.currentEle = e;
                        var positionX = d.clientX;
                        var positionY = d.clientY;
                        if(isShow){
                            var htmls = document.createElement("div");
                            $(htmls).attr("id", "contextMenu");
                            $(htmls).css({
                                left: positionX,
                                top: positionY
                            });
                            document.body.appendChild(htmls);
                            isShow = false;
                        }else{
                            $("#contextMenu").show();
                            $("#contextMenu").css("left", positionX);
                            $("#contextMenu").css("top", positionY);
                        }
                        $("#contextMenu").html("<ul><li><span class='addIcon'></span><span>设置为主表</span></li><li><span class='delIcon'></span><span>删除</span></li></ul>");
                        $("#contextMenu").on("mouseleave", function(){
                            $(this).hide();
                        });
                    });
                    // 右键菜单点击事件
                    $(document).on("click", "#contextMenu li", function(){
                        var index = $(this).index();
                        var currentClick = self.data.currentEle;
                        var eleArrs = graph.getCells();
                        $("#contextMenu").hide();
                        if(index == 1){
                            // 删除元素
                            var id = currentClick.model.id;
                            for(var i = 0; i < eleArrs.length; i++){
                                if(eleArrs[i].id == id){
                                    graph.removeCells(eleArrs[i]);
                                }
                            }
                        }else{
                            // 选择主表
                            if(isMain){
                                currentClick.$el.children(":first").attr("fill", "#4C93FB");
                                isMain = false;
                            }else{
                                YunpiAlert.error("只能选择一个主表！");
                            }
                        }
                    });
                    // 画布点击事件
                    paper.on('cell:pointerclick',function(e, d) {
                        var fill = e.$el.children(":first").attr("fill");
                        $("select[name='selMainKey']").empty();
                        $("select[name='selMainKey']").multipleSelect('enable');
                        if(fill == "#fff"){
                            // 辅表
                            $("#fillTbl").show();
                            $("#mainTable").hide();
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
                                        $.each(res.data, function(index, item){
                                            html += '<tr><td>'+item.fieldName+'</td><td>'+item.fieldDesc+'</td><td><select class="form-control">'+ opt +'</select></td><td><input type="checkbox"></td></tr>';
                                            var $opt = $('<option />', {
                                                value: item.fieldName,
                                                text: item.fieldName
                                            });
                                            // 多选下拉框
                                            $("select[name='selMainKey']").append($opt).multipleSelect('refresh');
                                        });
                                        $("#tblFieldTable").append($(html));
                                        $.each($("#tblFieldTable").children(), function(index, item){
                                            var currentField = $(item).children(":first").html();
                                            var opt = $(item).children().eq(2).children().children();
                                            for(var i = 0; i < opt.length ; i++){
                                                if($(opt[i]).val() == currentField){
                                                    $(opt[i]).prop("selected", true);
                                                }
                                            }
                                        });
                                    }
                                }
                            })
                        }else{
                            $("#fillTbl").hide();
                            $("#mainTable").show();
                            $('#mainTableTbody').empty();
                            // 主表
                            $.ajax({
                                type: "GET",
                                dataType: "JSON",
                                url: wwwroot + '/dataGovernance/metaDataFromTbl/' + 123,
                                success: function(res){
                                    if(res.code == "code_200"){
                                        $(".nodata").hide();
                                        var html = "";
                                        $.each(res.data, function(index, item){
                                            html += '<tr><td><input type="checkbox"></td></td><td>'+item.fieldName+'</td><td>'+item.fieldDesc+'</td></tr>';
                                            var $opt = $('<option />', {
                                                value: item.fieldName,
                                                text: item.fieldName
                                            });
                                            // 多选下拉框
                                            $("select[name='selMainKey']").append($opt).multipleSelect('refresh');
                                        });
                                        $("#mainTableTbody").append($(html));
                                    }
                                }
                            })
                        }
                    });
                    $("#saveAddBtn").unbind().bind("click", function(){
                        YunpiAlert.success("保存成功！");
                    })
                },
                onSureClick: function(){
                    YunpiAlert.success("融合策略添加成功！");
                    YunpiDialog.close();
                }
            })
        })
    },
    useById: function(){
        var self = this;
        if(Math.random() > 0.5){
            YunpiAlert.success("启用成功！");
            self.obj.fusionStrategyTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("启用失败！");
        }
    },
    forbidById: function(){
        var self = this;
        if(Math.random() > 0.5){
            YunpiAlert.success("禁用失败！");
            self.obj.fusionStrategyTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("启用失败！");
        }
    }
};

$(function(){
    fusionStrategy.initFusionStrategy();
})