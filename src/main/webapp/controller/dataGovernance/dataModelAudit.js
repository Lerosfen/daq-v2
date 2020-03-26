$package("dataModelAudit");

dataModelAudit = {
    initDataModelAudit: function(){
        this.obj = {
            modelAuditTable: $("#modelAuditTable"),
            applyTitle: $("#applyTitle"),
            statusSel: $("#statusSel"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
            ApplicationSel:$("#ApplicationSel")
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
            url: wwwroot + '/base/api/dictionary/model_audit_status',
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

        self.obj.modelAuditTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/dataModelAudit',
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
            }, {
                field: 'desc',
                title: '描述',
            },{
                field: 'status',
                title: '状态',
                formatter: function(val) {
                    return self.data.statusDict.getText(val, "dicName");
                }
            },{
                field: 'applyDepartment',
                title: '申请部门',
            },{
                field:"createTime",
                title:"创建时间",
            },{
                field:"modifyTime",
                title:"修改时间",
            },{
                field: 'id',
                title: '操作',
                width: 100,
                align: 'left',
                formatter: function (val, row) {
                    var id = val;
                    if(row.status == 0){
                        return '<a href="#" onclick="dataModelAudit.auditById(\'' + id + '\')" title="审核"><span class="glyphicon glyphicon-pawn"></span></a>';
                    }else if(row.status == 2){
                        return '<a href="#" onclick="dataModelAudit.reauditById(\'' + id + '\')" title="重审"><span class="glyphicon glyphicon-retweet"></span></a>';
                    }
                }
            }]
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.modelAuditTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.applyTitle.val("");
            self.obj.statusSel.val("");
            self.obj.modelAuditTable.bootstrapTable("refresh");
        })
    },
    auditById: function(id){
        var self = this;
        YunpiDialog.open({
            title: "数据模型审核",
            url: 'ModelChecking.html',
            sureBtn:true,
            size:1024,
            sureBtnName:"保存",
            afterWinOpen:function(){//打开页面时赋值
                var TableName = "A实体模型"
                $.ajax({
                    type: "get",
                    dataType: "json",
                    url: wwwroot + "/ForceDiagram/data/?TableName="+TableName,
                    async: false,
                    success: function(res){
                        self.ModelCheckData(res)
                    }
                })
                // $("#ApplicationSel").bind('change', function () {
                //     var ApplicationVal = $('#ApplicationSel option:selected').text()
                //     $.ajax({
                //         type: "get",
                //         dataType: "json",
                //         url: wwwroot + "/ForceDiagram/data/?TableName="+ApplicationVal,
                //         async: false,
                //         success: function(res){
                //             self.ModelCheckData(res)
                //         }
                //     })
                // });
            },
            onSureClick:function () {
                $('#yunpi-window').modal('hide');
            }
        });
    },
    ModelCheckData:function(root){
        var self = this;
        var width = 600,
            height = 375;
        var img_w = 70;
        var img_h = 70;
        var radius = 35;    //圆形半径
        document.querySelector("#relationship").innerHTML ='';
        var svg = d3.select("#relationship").append("svg")
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
            //.attr("id", function(d) { return d; })
                .attr("id", "resolved")
                //.attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
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
                console.log("this is node",node)
                self.gitTable(node)
                //单击时让连接线加粗
                // edges_line.style("stroke-width",function(line){
                //     if(line.source.name==node.name || line.target.name==node.name){
                //         return 2;
                //     }else{
                //         return 0.5;
                //     }
                // });
            })
            .call(force.drag);
        var nodes_text = svg.append("g").selectAll("text")
            .data(root.nodes)
            //返回缺失元素的占位对象（placeholder），指向绑定的数据中比选定元素集多出的一部分元素。
            .enter()
            .append("text")
            .attr("dy", ".35em")
            .attr('class','nodeName')
            .attr("text-anchor", "middle")//在圆圈中加上数据
            .style('fill',function(node){
                var color;//文字颜色
                color="#fff";
                return color;
            }).attr('x',function(d){
                // var re_en = /[a-zA-Z]+/g;
                //如果是全英文，不换行
                console.log("d.name",d.name.length)
                // if(d.name.match(re_en)){
                //     console.log("d.name0000",d.name.length)
                //     d3.select(this).append('tspan')
                //         .attr('x',0)
                //         .attr('y',2)
                //         .text(function(){return d.name;});
                // }
                // //如果小于四个字符，不换行
                // else
                 if(d.name.length<=2){
                    d3.select(this).append('tspan')
                        .attr('x',0)
                        .attr('y',2)
                        .text(function(){return d.name;});
                }else{
                    var top=d.name.substring(0,3);
                    var bot=d.name.substring(3,d.name.length);

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
                //直接显示文字
                /*.text(function(d) {
                return d.name; */
            })
            .on("click",function(node){
                console.log("this is node font-size",node)
                self.gitTable(node)
            })
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
    },
    /**
     *获取表数据（字段，描述）
     */
    gitTable:function(name){
        var TableName =name.name
        $.ajax({
            type: "get",
            dataType: "json",
            url: wwwroot + "/ForceDiagram/gitTable/?TableName="+TableName,
            async: false,
            success: function(res){
               console.log("this is res",res)
                $('#ApplicationTable').html("")
                var ApplicationHrml = ""
                if(res.length == 0){
                   $(".Application ").hide()
                    $(".ApplicationSurface ").hide()
                }else {
                    $(".Application ").show()
                    $(".ApplicationSurface ").show()
                    res.forEach(function (intem) {
                        ApplicationHrml += '<tr><td>'+intem.Fieldname+'</td><td>'+intem.describe+'</td></tr>'
                    })
                    $("#ApplicationSel").html("");
                    $("#ApplicationSel").append('<option value="' + name.name + '" selected>' +name.name + '</option>');
                    $('#ApplicationTable').html(ApplicationHrml);
                }

            }
        })
    },
    reauditById: function(id){
        var self = this;
        YunpiDialog.open({
            title: "数据模型审核",
            url: 'ModelChecking.html',
            sureBtn:true,
            size:1024,
            sureBtnName:"保存",
            afterWinOpen:function(){//打开页面时赋值
                var TableName = "A实体模型"
                $.ajax({
                    type: "get",
                    dataType: "json",
                    url: wwwroot + "/ForceDiagram/data/?TableName="+TableName,
                    async: false,
                    success: function(res){
                        self.ModelCheckData(res)
                    }
                })
                $("#ApplicationSel").bind('change', function () {
                    var ApplicationVal = $('#ApplicationSel option:selected').text()
                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: wwwroot + "/ForceDiagram/data/?TableName="+ApplicationVal,
                        async: false,
                        success: function(res){
                            self.ModelCheckData(res)
                        }
                    })
                });

            },
            onSureClick:function () {
                $('#yunpi-window').modal('hide');
            }
        });
    }
};

$(function(){
    dataModelAudit.initDataModelAudit();
})