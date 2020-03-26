$package("dataModelApply");

dataModelApply = {
    initDataModelApply: function(){
        this.obj = {
            modelApplyTable: $("#modelApplyTable"),
            statusSel: $("#statusSel"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
            addBtn: $("#addBtn")
        };
        this.data = {
            statusDict: [],
            addType: 0
        }
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + '/base/api/dictionary/model_apply_status',
            async:false,
            success: function(res){
                if(res.code == "code_200"){
                    self.data.statusDict = res.data.toDict("dicCode", true);
                    var data = res.data;
                    var len = data.length;
                    var html = "";
                    // 状态下拉框
                    for(var i = 0; i<len;i++){
                        html += `<option value=${data[i].dicCode}>${data[i].dicName}</option>`;
                    }
                    self.obj.statusSel.append(html);
                }
            }
        })
        self.obj.modelApplyTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/dataModelApply',
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
                field: 'applyTitle',
                title: '申请标题',
                width: 200
            }, {
                field: 'desc',
                title: '描述',
                width: 500
            },{
                field: 'status',
                title: '状态',
                width: 200,
                formatter: function(val) {
                    return self.data.statusDict.getText(val,"dicName");
                }
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
                width: 150,
                align: 'left',
                formatter: function (value, row, index) {
                    var id = value;
                    var result = "";
                    result += '<a href="#" onclick="dataModelApply.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                    if(row.status == 0||row.status == 3||row.status == 4){
                        result += '<a href="#" onclick="dataModelApply.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                        result += '<a href="#" onclick="dataModelApply.submitApply(\'' + id + '\')" title="提交申请"><span class="glyphicon glyphicon-open-file"></span></a>';
                    }
                    if(row.status == 1){
                        result += '<a href="#" onclick="dataModelApply.undoApply(\'' + id + '\')" title="撤销"><span class="glyphicon glyphicon-repeat"></span></a>';
                    }
                    if(row.status == 2){
                        result += '<a href="#" onclick="dataModelApply.viewExample(\'' + id + '\')" title="查看调用示例"><span class="glyphicon glyphicon-blackboard"></span></a>';
                    }
                    if(row.status == 0||row.status == 4){
                        result += '<a href="#" onclick="dataModelApply.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                    }
                    return result;
                }
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.modelApplyTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.statusSel.val("");
            self.obj.modelApplyTable.bootstrapTable("refresh");
        });
        self.obj.addBtn.unbind().bind("click", function(){
            self.data.addType = 1;
            YunpiDialog.open({
                title: "数据模型申请",
                url: "addDataModelApply.html",
                size: 1000,
                sureBtn: true,
                afterWinOpen: function(){
                    $.ajax({
                        type:  "GET",
                        dataType: "json",
                        url: wwwroot + '/dataGovernance/addApplyRelation',
                        success: function(res){
                            self.showChart(res);
                        }
                    });
                    $("#saveAddBtn").unbind().bind("click", function(){
                        YunpiAlert.success("保存成功！");
                    });
                    $("input[name='checkedAll']").attr("disabled", true);
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
                    $("#addApplyTable").on("click", "tr", function(){
                        var currentCkbox = $(this).children(":first").children();
                        if(currentCkbox.prop("checked")){
                            currentCkbox.prop("checked", false);
                        }else{
                            currentCkbox.prop("checked", true);
                        }
                    })
                },
                onSureClick: function(){
                    if($("#addDataModelForm").formVerify()){
                        YunpiAlert.success("模型申请成功！");
                        $("#addEntityModelForm").clearform();
                        YunpiDialog.close();
                        self.obj.modelApplyTable.bootstrapTable("refresh");
                    }else{
                        YunpiAlert.warning("提交失败，参数校验不通过！");
                    }
                }
            })
        });
    },
    viewById: function(id){
        var self = this;
        self.data.addType = 2;
        YunpiDialog.open({
            title: "查看数据模型申请",
            url: "viewDataModelApply.html",
            size: 1000,
            sureBtn: false,
            afterWinOpen: function(){
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: wwwroot + '/dataGovernance/modelApply' + id,
                    success: function(res){
                        if(res.code == "code_200"){
                            $("#viewDataModelForm").setform(res.data);
                        }
                    }
                });
                $.ajax({
                    type:  "GET",
                    dataType: "json",
                    url: wwwroot + '/dataGovernance/addApplyRelation',
                    success: function(res){
                        self.showChart(res);
                    }
                });
            }
        })
    },
    editById: function(id){
        var self = this;
        self.data.addType = 3;
        YunpiDialog.open({
            title: "修改数据模型申请",
            url: "addDataModelApply.html",
            size: 1000,
            sureBtn: true,
            afterWinOpen: function(){
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: wwwroot + '/dataGovernance/modelApply' + id,
                    success: function(res){
                        if(res.code == "code_200"){
                            $("#addEntityModelForm").setform(res.data);
                        }
                    }
                });
                $.ajax({
                    type:  "GET",
                    dataType: "json",
                    url: wwwroot + '/dataGovernance/addApplyRelation',
                    success: function(res){
                        self.showChart(res);
                    }
                });
            },
            onSureClick: function(){
                if($("#addDataModelForm").formVerify()){
                    YunpiAlert.success("模型申请修改成功！");
                    $("#addEntityModelForm").clearform();
                    YunpiDialog.close();
                    self.obj.modelApplyTable.bootstrapTable("refresh");
                }else{
                    YunpiAlert.warning("提交失败，参数校验不通过！");
                }
            },
            beforeWinClose: function(){
                $("#addEntityModelForm").clearform();
            }
        })
    },
    submitApply: function(id){
        var self = this;
        YunpiAlert.success("提交成功！");
        self.obj.modelApplyTable.bootstrapTable("refresh");
    },
    undoApply: function(id){
        var self = this;
        YunpiAlert.success("撤销成功！");
        self.obj.modelApplyTable.bootstrapTable("refresh");
    },
    viewExample: function(id){
        var self = this;
        YunpiDialog.open({
            title: "查看调用示例",
            url: "dataApplyViewEx.html",
            size: 1000,
            sureBtn: false,
            afterWinOpen: function(){
                $("#viewExTbl").bootstrapTable({data:[]});
                $("#viewExTbl").bootstrapTable("showLoading");
                setTimeout(function(){
                    $("#viewExTbl").bootstrapTable('destroy');
                    $("#viewExTbl").bootstrapTable({
                        method : 'POST',
                        url: wwwroot+'/dataGovernance/dataModelApplyViewEx',
                        // toolbar: "#toolbar",
                        height:$(window).height()-340,
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
                        columns:[
                            {
                                field: "callTime",
                                title: "调用时间"
                            },
                            {
                                field: "callIP",
                                title: "调用IP"
                            },
                            {
                                field: "callPort",
                                title: "调用接口"
                            },
                            {
                                field: "callData",
                                title: "调用数据量"
                            }
                        ]
                    });
                    $("#viewExTbl").bootstrapTable("hideLoading");
                }, 1000)
            }
        });
    },
    deleteById: function(id){
        var self = this;
        YunpiConform.open("您确定要删除该申请模型吗?", null, function(){
            YunpiAlert.success("删除成功！");
            self.obj.modelApplyTable.bootstrapTable("refresh");
        })
    },

    showChart:function(root){
        var self = this;
        var width = 499,
            height = 450;
        var img_w = 70;
        var img_h = 70;
        var radius = 35;    //圆形半径
        document.querySelector("#paint").innerHTML ='';
        var svg = d3.select("#paint").append("svg")
            .attr("width",width)
            .attr("height",height);
        //D3力导向布局
        var force = d3.layout.force()
            .nodes(root.nodes)
            .links(root.edges)
            .size([width,height])
            .linkDistance(150)
            .charge(-1500)
            .start();
        var marker=
            svg.append("marker")
                .attr("id", "resolved")
                .attr("markerUnits","userSpaceOnUse")
                .attr("viewBox", "0 -5 10 10")//坐标系的区域
                .attr("refX",38)//箭头坐标
                .attr("refY", -1)
                .attr("markerWidth", 12)//标识的大小
                .attr("markerHeight", 12)
                .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
                .attr("stroke-width",2)//箭头宽度
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                .attr('fill','#de7425');//箭头颜色

        //边
        var edges_line = svg.selectAll("line")
            .data(root.edges)
            .enter()
            .append("line")
            .style("stroke","#de7425")
            .style("stroke-width",1)
            .attr("marker-end", "url(#resolved)" );//根据箭头标记的id号标记箭头
        // 圆形图片节点（人物头像）
        var nodes_img = svg.append("g").selectAll("image")
            .data(root.nodes)
            .enter()
            .append("circle")
            .attr("r", radius)
            .style("fill", function(d, i){
                //创建圆形图片
                var defs = svg.append("defs").attr("id", "imgdefs")
                var catpattern = defs.append("pattern")
                    .attr("id", "catpattern" + i)
                    .attr("height", 1)
                    .attr("width", 1)
                catpattern.append("image")
                    .attr("x", - (img_w / 2 - radius))
                    .attr("y", - (img_h / 2 - radius))
                    .attr("width", img_w)
                    .attr("height", img_h)
                    .attr("xlink:href", d.image)
                return "url(#catpattern" + i + ")";
            })
            .style('stroke',function(d){
                var color;//圆圈线条的颜色
                color="#F1F6FD";
                return color;
            })
            .on("click",function(node){
                $('#addApplyTable').empty();
                if(self.data.addType == 1){
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: wwwroot + '/dataGovernance/modelField',
                        success: function(res){
                            $("span.noData").hide();
                            $("input[name='checkedAll']").attr("disabled", false);
                            var data = res.data;
                            var html = "";
                            for(var i = 0; i < data.length; i++){
                                html += '<tr><td><input type="checkbox"></td><td>'+data[i].fieldName+'</td><td>'+data[i].fieldDesc+'</td></tr>';
                            }
                            $('#addApplyTable').append($(html));
                        }
                    })
                }
                if(self.data.addType == 2){
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: wwwroot + '/dataGovernance/modelApply' + 123,
                        success: function(res){
                            if(res.code == "code_200"){
                                var fieldList = res.data.cols;
                                if(fieldList.length!==0){
                                    var html = "";
                                    $.each(fieldList, function(i, item){
                                        html += '<tr><td>' + item.fieldName + '</td><td>' + item.fieldDesc + '</td></tr>';
                                    });
                                    $(html).appendTo($("#addApplyTable"));
                                    $("span.noData").hide();
                                }
                            }
                        }
                    });
                }
                if(self.data.addType == 3){
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: wwwroot + '/dataGovernance/modelApply' + 123,
                        success: function(res){
                            if(res.code == "code_200"){
                                var fieldList = res.data.cols;
                                if(fieldList.length!==0){
                                    var html = "";
                                    $.each(fieldList, function(i, item){
                                        html += '<tr><td><input type="checkbox"></td><td>' + item.fieldName + '</td><td>' + item.fieldDesc + '</td></tr>';
                                    });
                                    $(html).appendTo($("#addApplyTable"));
                                    $("#addApplyTable").children().eq(0).children(":first").children().attr("checked", true);
                                    $("#addApplyTable").children().eq(2).children(":first").children().attr("checked", true);
                                    $("#addApplyTable").children().eq(3).children(":first").children().attr("checked", true);
                                    $("span.noData").hide();
                                }
                            }
                        }
                    });
                }
                /*
                单击时让连接线加粗
                edges_line.style("stroke-width",function(line){
                    if(line.source.name==node.name || line.target.name==node.name){
                        return 2;
                    }else{
                        return 0.5;
                    }
                });
                */
            })
            .call(force.drag);
        var nodes_text = svg.append("g").selectAll("text")
            .data(root.nodes)
            //返回缺失元素的占位对象（placeholder），指向绑定的数据中比选定元素集多出的一部分元素。
            .enter()
            .append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")//在圆圈中加上数据
            .style('fill',function(node){
                var color;//文字颜色
                color="#fff";
                return color;
            }).attr('x',function(d){
                var re_en = /[a-zA-Z]+/g;
                //如果是全英文，不换行
                if(d.name.match(re_en)){
                    d3.select(this).append('tspan')
                        .attr('x',0)
                        .attr('y',2)
                        .text(function(){return d.name;});
                }
                //如果小于四个字符，不换行
                else if(d.name.length<=4){
                    d3.select(this).append('tspan')
                        .attr('x',0)
                        .attr('y',2)
                        .text(function(){return d.name;});
                }else{
                    var top=d.name.substring(0,4);
                    var bot=d.name.substring(4,d.name.length);

                    d3.select(this).text(function(){return '';});

                    d3.select(this).append('tspan')
                        .attr('x',0)
                        .attr('y',-7)
                        .text(function(){return top;});

                    d3.select(this).append('tspan')
                        .attr('x',0)
                        .attr('y',10)
                        .text(function(){return bot;});
                }
            });
        force.on("tick", function(){
            nodes_text.attr("transform", transform2);//顶点文字
            //更新连接线的位置
            edges_line.attr("x1",function(d){ return d.source.x; });
            edges_line.attr("y1",function(d){ return d.source.y; });
            edges_line.attr("x2",function(d){ return d.target.x; });
            edges_line.attr("y2",function(d){ return d.target.y; });
            //更新连接线上文字的位置
            // edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
            // edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });
            //更新结点图片和文字
            nodes_img.attr("cx",function(d){ return d.x });
            nodes_img.attr("cy",function(d){ return d.y });
        });
        function transform2(d) {
            return "translate(" + (d.x) + "," + d.y + ")";
        }
        // });


    },

};

$(function(){
    dataModelApply.initDataModelApply();
})