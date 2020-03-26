$package("entityModelRelation");

entityModelRelation = {
    initModelRelation: function(){
        this.obj = {
            modelRelationTable: $("#modelRelationTable"),
            statusSel: $("#statusSel"),
            addBtn: $("#addBtn"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
        };
        this.data = {
            statusDict: []
        }
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + '/base/api/dictionary/db_source_status',
            async: false,
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
            },
            error: function(){
                YunpiAlert.error(res.msg);
            }
        })
        self.obj.modelRelationTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/modelRelation',
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
                field: 'mainTable',
                title: '主表',
                width: 500
            }, {
                field: 'assistTable',
                title: '辅表',
                width: 400
            }, {
                field: 'status',
                title: '状态',
                width: 200,
                formatter: function(val) {
                    return self.data.statusDict.getText(val,"dicName");
                }
            }, {
                field:"createTime",
                title:"创建时间",
                width: 350
            }, {
                field:"modifyTime",
                title:"修改时间",
                width: 350
            }, {
                field: 'id',
                title: '操作',
                width: 200,
                align: 'left',
                formatter: function (value, row, index) {
                    var id = value;
                    var result = "";
                    result += '<a href="#" onclick="entityModelRelation.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                    result += '<a href="#" onclick="entityModelRelation.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                    if(row.status==1){//启用状态时显示禁用按钮
                        result += '<a href="#" onclick="entityModelRelation.forbidById(\'' + id + '\')" title="禁用"><span class="glyphicon glyphicon-off"></span></a>';
                    }else{//其它状态显示启用按钮
                        result += '<a href="#" onclick="entityModelRelation.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                    }
                    if(row.status==0){//编辑状态显示删除按钮
                        result += '<a href="#" onclick="entityModelRelation.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                    }
                    return result;
                }
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.searchBtn.unbind().bind("click", function(){
            self.obj.modelRelationTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.statusSel.val("");
            self.obj.modelRelationTable.bootstrapTable("refresh");
        });
        self.obj.addBtn.unbind().bind("click", function(){
            YunpiDialog.open({
                title: "添加实体模型关系",
                url: "addEntityModelRelation.html",
                size: 800,
                sureBtn: true,
                afterWinOpen: function(){
                    self.handleCharts($("#entityModelRelationAddForm"));
                },
                onSureClick: function(){
                    if($("#entityModelRelationAddForm").formVerify()){
                        YunpiAlert.success("实体模型关系添加成功！");
                        $("#entityModelRelationAddForm").clearform();
                        YunpiDialog.close();
                        self.obj.modelRelationTable.bootstrapTable("refresh");
                    }else{
                        YunpiAlert.warning("提交失败，参数校验不通过！");
                    }
                }
            })
        })
    },
    viewById: function(id){
        var self = this;
        YunpiDialog.open({
            title: "查看实体模型关系",
            url: "addEntityModelRelation.html",
            size: 800,
            sureBtn: false,
            afterWinOpen: function(){
                self.handleCharts($("#entityModelRelationAddForm"));
                $("#entityModelRelationAddForm").find("select").attr("disabled", true);
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: wwwroot + '/dataGovernance/modelRelation/' + id,
                    success: function(res){
                        if(res.code == "code_200"){
                            $("#entityModelRelationAddForm").setform(res.data);
                        }
                    }
                })
            }
        })
    },
    editById: function(id){
        var self = this;
        YunpiDialog.open({
            title: "修改实体模型关系",
            url: "addEntityModelRelation.html",
            size: 800,
            sureBtn: true,
            afterWinOpen: function(){
                self.handleCharts($("#entityModelRelationAddForm"));
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: wwwroot + '/dataGovernance/modelRelation/' + id,
                    success: function(res){
                        if(res.code == "code_200"){
                            $("#entityModelRelationAddForm").setform(res.data);
                        }
                    }
                })
            },
            onSureClick: function(){
                if($("#entityModelRelationAddForm").formVerify()){
                    YunpiAlert.success("实体模型关系修改成功！");
                    $("#entityModelRelationAddForm").clearform();
                    YunpiDialog.close();
                    self.obj.modelRelationTable.bootstrapTable("refresh");
                }else{
                    YunpiAlert.warning("提交失败，参数校验不通过！");
                }
            }
        })
    },
    forbidById: function(id){
        var self = this;
        if(Math.random()>0.5){
            YunpiAlert.success("禁用成功！");
            self.obj.modelRelationTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("禁用失败！");
        }
    },
    useById: function(id){
        var self = this;
        if(Math.random()>0.5){
            YunpiAlert.success("启用成功！");
            self.obj.modelRelationTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("启用失败！");
        }
    },
    deleteById: function(id){
        var self = this;
        YunpiConform.open("您确定删除该模型关系吗?", null, function(){
            YunpiAlert.success("删除成功！");
            self.obj.modelRelationTable.bootstrapTable("refresh");
        })
    },
    showChart:function(root, formDom){
        var width = 394,
            height = 500;
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
            .style("stroke-width",2)
            .attr("marker-end", "url(#resolved)" ).on("click", function(){
                formDom.children().eq(0).hide();
                formDom.children().eq(1).hide();
                formDom.children().eq(2).show();
                formDom.children().eq(3).show();
                formDom.children().eq(4).hide();
                formDom.children().eq(5).hide();
            });//根据箭头标记的id号标记箭头
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
                /*单击时让连接线加粗
                edges_line.style("stroke-width",function(line){
                    if(line.source.name==node.name || line.target.name==node.name){
                        return 2;
                    }else{
                        return 0.5;
                    }
                });
                */
                /*console.log(node, formDom.html());*/
                if(node.name == "主实体模型"){
                    /*console.log(formDom.children().find("div").attr("mainModel").html());*/
                    formDom.children().eq(0).show();
                    formDom.children().eq(1).show();
                    formDom.children().eq(2).hide();
                    formDom.children().eq(3).hide();
                    formDom.children().eq(4).hide();
                    formDom.children().eq(5).hide();
                }
                if(node.name == "辅实体模型"){
                    formDom.children().eq(0).hide();
                    formDom.children().eq(1).hide();
                    formDom.children().eq(2).hide();
                    formDom.children().eq(3).hide();
                    formDom.children().eq(4).show();
                    formDom.children().eq(5).show();
                }
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
                color="#000";
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
                else if(d.name.length<=5){
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
            //更新结点图片和文字
            nodes_img.attr("cx",function(d){ return d.x });
            nodes_img.attr("cy",function(d){ return d.y });
        });
        function transform2(d) {
            return "translate(" + (d.x) + "," + d.y + ")";
        }
    },
    handleCharts: function(formDom){
        var self = this;
        formDom.children().eq(2).hide();
        formDom.children().eq(3).hide();
        formDom.children().eq(4).hide();
        formDom.children().eq(5).hide();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + '/dataGovernance/modelRelationMap',
            success: function(res){
                self.showChart(res, formDom);
            }
        });
    }
};
$(function(){
    entityModelRelation.initModelRelation();
})