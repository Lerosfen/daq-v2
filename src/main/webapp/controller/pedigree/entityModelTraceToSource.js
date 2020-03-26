$package("entityModel");

entityModel = {
    initEntityModel: function(){
        this.obj = {
            entityModelTable: $("#entityModelTable"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
            themeSel: $("#themeSel"),
            entityModel: $("#entityModel")
        };
        // this.initDom();
        this.ModelTracing()
        this.initEvent();
    },
    /**
     *初始化主题与实体模型
     */
    ModelTracing:function(){
        var self = this;
        $.ajax({
            type: "get",
            dataType: "json",
            url: wwwroot + "/DataTable/type",
            async: false,
            success: function(res){
                res.data.forEach((item, index, arr) => {
                    self.obj.themeSel.append(`<option  value="${item.selectValue}">${item.selectName}</option>`);
                });
                res.entityModel.forEach((item, index, arr) => {
                    self.obj.entityModel.append(`<option  value="${item.entityValue}">${item.entityName}</option>`);
                });
            }
        })
    },
    initDom: function(){
        var self = this;
        self.obj.entityModelTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/pedigree/entityModel',
            //queryParams: "queryParams",
            toolbar: "#toolbar",
            height:$(window).height()-100,
            striped: false, // 是否显示行间隔色
            cache: false,//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            /*leftFixedColumns:true,
            leftFixedNumber:2,*/
            rightFixedColumns: true,
            rightFixedNumber: 1,
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
                field: "columns1",
                title: "columns1",
            }, {
                field:"columns2",
                title:"columns2",
            }, {
                field: "columns3",
                title: "columns3",
            }, {
                field: "columns4",
                title: "columns4",
            }, {
                field: "columns5",
                title: "columns5",
            },{
                field: "id",
                title: "操作",
                formatter: function(id){
                    return '<a href="#" onclick="entityModel.dataSource(\'' + id + '\')" title="数据溯源"><span class="glyphicon glyphicon-zoom-in"></span></a>'
                }
            }]
        })
    },
    initEvent: function(){
        var self =this;
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            var themeName = self.obj.themeSel.val();
            var modelName = self.obj.entityModel.val();
            if (themeName == "0" ){
                YunpiAlert.warning("查询失败，请选择主题模型");
            }else if(modelName == "0"){
                YunpiAlert.warning("查询失败，请选择实体模型");
            }else {
                self.initDom();
            }
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.themeSel.val("");
            self.obj.entityModel.val("");
            self.obj.entityModelTable.bootstrapTable("refresh");
        })
    },
    dataSource: function(id){
        var self = this;
        YunpiDialog.open({
            title: "实体模型数据溯源",
            url: 'dataSourceDialog.html',
            sureBtn:true,
            size:1024,
            afterWinOpen:function(){//打开页面时赋值
                self.Traceability()
            },
            onSureClick:function(){
                // //TODO 提交信息
                // if($('#dataElementRuleAddForm').formVerify()){
                //     var data = $('#dataElementRuleAddForm').getform();
                //     YunpiAlert.success("数据元规则添加成功");
                //     self.obj.dataElementRuleTable.bootstrapTable('refresh');
                //     $('#dataElementRuleAddForm').clearform();
                //     YunpiDialog.close();
                // }else{
                //     YunpiAlert.warning("提交失败，参数校验不通过");
                // }
            }
        });
    },
    /**
     *溯源结果展示
     */
    Traceability:function () {
        var width = 1022;
        var height = 600;
        var radius = 30;    //圆形半径
        var img_w = 77;
        var img_h = 80;
        var flag = true;
        var nodeSub = []
        var colors = d3.scaleOrdinal(d3.schemeCategory10);
        var svg = d3.select("#Traceability").append("svg")
            .on('contextmenu', () => { d3.event.preventDefault(); })
            .attr('width', width)
            .attr('height', height);
        var nodes = [
            { "id": "数据库" , "image" : "/resources/img/Forced/1.png" },
            { "id": "字段1" , "image" : "/resources/img/Forced/2.png" },
            { "id": "字段2", "image" : "/resources/img/Forced/2.png" },
            { "id": "字段3", "image" : "/resources/img/Forced/2.png" },
            { "id": "字段4" , "image" : "/resources/img/Forced/2.png" },
            { "id": "字段5" , "image" : "/resources/img/Forced/2.png" },
            { "id": "清洗表1" , "image" : "/resources/img/Forced/3.png" },
            { "id": "清洗表2" , "image" : "/resources/img/Forced/3.png" },
            { "id": "采集目标表1" , "image" : "/resources/img/Forced/4.png" },
            { "id": "采集表2" , "image" : "/resources/img/Forced/4.png" },
            { "id": "库A","image" : "/resources/img/Forced/4.png" },
            { "id": "库B","image" : "/resources/img/Forced/4.png" }
        ];
        var links = [  { "source": nodes[0] , "target": nodes[1] , "relation":"挚友" },
            { "source": nodes[0] , "target": nodes[2] , "relation":"挚友" },
            { "source": nodes[0] , "target": nodes[3] , "relation":"挚友" },
            { "source": nodes[0] , "target": nodes[4] , "relation":"父子" },
            { "source": nodes[0] , "target": nodes[5] , "relation":"母子" },
            { "source": nodes[1] , "target": nodes[6] , "relation":"义兄弟" },
            { "source": nodes[2] , "target": nodes[6] , "relation":"挚友" },
            { "source": nodes[3] , "target": nodes[7], "relation":"挚友" },
            { "source": nodes[4] , "target": nodes[7] , "relation":"挚友" },
            { "source": nodes[5] , "target": nodes[7] , "relation":"挚友" },
            { "source": nodes[6] , "target": nodes[8], "relation":"挚友" },
            { "source": nodes[7] , "target": nodes[9], "relation":"挚友" },
            { "source": nodes[8] , "target": nodes[10], "relation":"挚友" },
            {"source": nodes[9] , "target": nodes[11], "relation":"挚友"}
        ];
        var force = d3.forceSimulation()
            .force('link', d3.forceLink().id((d) => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-1500))
            .force('x', d3.forceX(width / 2))
            .force('y', d3.forceY(height / 2))
            .on('tick', tick)
        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'start-arrow')
            .attr("markerUnits","userSpaceOnUse")
            .attr("viewBox", "0 0 12 12")//坐标系的区域
            // .attr("refX",130)//箭头坐标
            // .attr("refY", 0)
            .attr("refX",-12)//箭头坐标
            .attr("refY", 5.2)
            .attr("markerWidth", 18)//标识的大小
            .attr("markerHeight", 18)
            .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width",5)//箭头宽度
            .append("path")
            .attr("d", "M8,11 L0,5 L10,2 L6,6 L8,11")//箭头的路径
            .attr('fill','#de7425');//箭头颜色
        const dragLine = svg.append('svg:path')
            .attr('class', 'link dragline hidden')
            .attr('d', 'M0,0L0,0');
        let path = svg.append('svg:g').selectAll('path');
        let circle = svg.append('svg:g').selectAll('g');

        let selectedNode = null;
        let selectedLink = null;
        let mousedownLink = null;
        let mousedownNode = null;
        let mouseupNode = null;
        function resetMouseVars() {
            mousedownNode = null;
            mouseupNode = null;
            mousedownLink = null;
        }

        function tick() {
            path.attr('d', (d) => {
                var deltaX = d.target.x - d.source.x;
                var deltaY = d.target.y - d.source.y;
                var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                var normX = deltaX / dist;
                var normY = deltaY / dist;
                var sourcePadding = d.left ? 17 : 12;
                var targetPadding = d.right ? 17 : 12;
                var sourceX = d.source.x + (sourcePadding * normX);
                var sourceY = d.source.y + (sourcePadding * normY);
                var targetX = d.target.x - (targetPadding * normX);
                var targetY = d.target.y - (targetPadding * normY);
                return `M${sourceX},${sourceY}L${targetX},${targetY}`;
            });

            circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
        }
        function restart() {
            path = path.data(links);
            path = path.enter().append('svg:path')
                .style("stroke","#de7425")
                .style("stroke-width",1)
                .attr("marker-start", "url(#start-arrow)" )//根据箭头标记的id号标记箭头
                .merge(path);
            circle = circle.data(nodes, (d) => d.id);
            circle.selectAll('circle')
                // .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
                // .classed('reflexive', (d) => d.reflexive);
            circle.exit().remove();
            const g = circle.enter().append('svg:g');
            g.append('svg:circle')
                .attr('class', 'node')
                .attr('r', 30)
                .attr("fill", function(d, i){
                    // d === selectedNode ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id)
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
                .style('stroke', (d) => d3.rgb(colors(d.id)).darker().toString())
                .classed('reflexive', (d) => d.reflexive)
                .on('click', function (circle) {
                    if(circle.id == "清洗表1"){
                        nodeSub.forEach(item=>{
                            if("清洗表1"===item){
                                flag = false;
                            }
                        })
                        if(flag){ // 当前添加的值在数组里不存在，就把值添加进去
                            nodeSub.push(circle.id)
                            svg.classed('active', true);
                            if (d3.event.ctrlKey || mousedownNode || mousedownLink) return;
                            nodes.push({id: "字段3","image" : "/resources/img/Forced/2.png"},{id: "字段4","image" : "/resources/img/Forced/2.png"});
                            links.push({ source : nodes[nodes.length-2], target: nodes[6] },{ source : nodes[nodes.length-1]  , target: nodes[6] });
                            restart();
                            flag = true;
                        }else{ // 否则弹出提示信息
                            YunpiAlert.warning("清洗表1已展开");
                        }
                    }else if(circle.id == "清洗表2"){
                        flag = true;
                        nodeSub.forEach(item=>{
                            if("清洗表2"===item){ // 对象里的唯一标识id
                                flag = false;
                            }
                        })
                        if(flag){ // 当前添加的值在数组里不存在，就把值添加进去
                            nodeSub.push(circle.id)
                            svg.classed('active', true);
                            if (d3.event.ctrlKey || mousedownNode || mousedownLink) return;
                            nodes.push({id: "字段1","image" : "/resources/img/Forced/2.png"},{id: "字段2","image" : "/resources/img/Forced/2.png"});
                            links.push({ source : nodes[nodes.length-2], target: nodes[7] },{ source : nodes[nodes.length-1]  , target: nodes[7] });
                            restart();
                            flag = true;
                        }else{ // 否则弹出提示信息
                            YunpiAlert.warning("清洗表2已展开");
                        }
                    }
                })
                .call(
                    d3.drag()
                        .on('start', (d) => {
                            if (!d3.event.active) force.alphaTarget(0.8).restart();
                            d.fx = d.x;
                            d.fy = d.y;
                        })
                        .on('drag', (d) => {
                            console.log("drag")
                            d.fx = d3.event.x;
                            d.fy = d3.event.y;
                        })
                        .on('end', (d) => {
                            console.log("this is jieshu")
                            if (!d3.event.active){
                                force.alphaTarget(0);
                            }
                            d.fx = null;
                            d.fy = null;
                        })
                )
            g.append('svg:text')
                .attr('x', 0)
                .attr('y', 4)
                .attr('class', 'id')
                .text((d) => d.id);
            circle = g.merge(circle);
            force
                .nodes(nodes)
                .force('link').links(links);
            // force.alphaTarget(0.3).restart();
            g.attr("cx",function(d){ return d.x });
            g.attr("cy",function(d){ return d.y });
        }
        restart();
    }
};

$(function(){
    entityModel.initEntityModel();
})