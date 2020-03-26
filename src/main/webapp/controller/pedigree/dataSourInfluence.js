$package("dataSource");

dataSource = {
    dataMap: function(){
        this.obj = {
            dataSourceType : $('#dataSourceType'),
            dataSourceEvolve:$("#dataSourceEvolve"),
            dataSourSource:$("#dataSourSource"),
            dataEvolveTable:$("#dataEvolve")
        };
        // this.initDom();
        this.initEvent();
    },
    initEvent: function(){
        var self = this;
        $.ajax({
            type: "get",
            dataType: "json",
            url: wwwroot + "/DataTable/type",
            async: false,
            success: function(res){
                console.log("res",res)
                res.data.forEach((item, index, arr) => {
                    self.obj.dataSourceType.append(`<option  value="${index}">${item.selectName}</option>`);
                });
                self.obj.dataSourceEvolve.append(`<option  value="0">请选择</option>`);
            }
        })
        self.obj.dataSourceType.unbind().bind("change", function () {
            var label_id=($(this).val());
            $.ajax({
                type: "get",
                dataType: "json",
                url: wwwroot + "/Data/sheetData",
                async: false,
                success: function(res){
                    var DataSheet = res.data[label_id]
                    self.obj.dataSourceEvolve.empty();
                    DataSheet.forEach((item, index, arr) => {
                        self.obj.dataSourceEvolve.append(`<option  value="${index}">${item}</option>`);
                    });
                }
            })
        });
        self.obj.dataSourSource.unbind().bind("click", function () {
            var TableName = "名称"
            $.ajax({
                type: "get",
                dataType: "json",
                url: wwwroot + "/ForceDiagram/data/?TableName="+TableName,
                async: false,
                success: function(res){
                    console.log("this is log",res)
                    self.dataSourceship()
                }
            })
        });
    },
    /**
     *溯源结果展示
     */
    dataSourceship:function () {
        var width = 1558;
        var height = $("#dataSourceData").height();
        var radius = 30;    //圆形半径
        var img_w = 77;
        var img_h = 80;
        var flag = true;
        var nodeSub = []
        document.querySelector("#dataSourceData").innerHTML ='';
        var colors = d3.scaleOrdinal(d3.schemeCategory10);
        var svg = d3.select("#dataSourceData").append("svg")
            .on('contextmenu', () => { d3.event.preventDefault(); })
            .attr('width', width)
            .attr('height', height);
        var nodes = [
            { "id": "A库" , "image" : "/resources/img/Forced/1.png","num":"0"},
            { "id": "A表" , "image" : "/resources/img/Forced/2.png","num":"1" },
            { "id": "B表", "image" : "/resources/img/Forced/2.png","num":"2" },
            { "id": "C表", "image" : "/resources/img/Forced/2.png","num":"3" },
            { "id": "clear-A表" , "image" : "/resources/img/Forced/3.png","num":"4" },
            { "id": "clear-B-d" , "image" : "/resources/img/Forced/3.png","num":"5" },
            { "id": "clear-C-d" , "image" : "/resources/img/Forced/3.png","num":"6" },
            { "id": "A融合表" , "image" : "/resources/img/Forced/4.png","num":"7" },
            { "id": "模型表A","image" : "/resources/img/Forced/4.png","num":"8" },
            { "id": "B融合表","image" : "/resources/img/Forced/4.png","num":"9" },
        ];
        var links = [  { "source": nodes[0] , "target": nodes[1] , "relation":"classification" },
            { "source": nodes[0] , "target": nodes[2] , "relation":"classification" },
            { "source": nodes[0] , "target": nodes[3] , "relation":"classification" },
            { "source": nodes[1] , "target": nodes[4] , "relation":"Clean" },
            { "source": nodes[2] , "target": nodes[5] , "relation":"Clean" },
            { "source": nodes[3] , "target": nodes[6], "relation":"Clean" },
            { "source": nodes[4] , "target": nodes[7] , "relation":"fuse" },
            { "source": nodes[5] , "target": nodes[7], "relation":"fuse" },
            { "source": nodes[6] , "target": nodes[9], "relation":"fuse" },
            { "source": nodes[7] , "target": nodes[8], "relation":"fuse" },
        ];
        var force = d3.forceSimulation()
            .force('link', d3.forceLink().id((d) => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-2000))
            .force('x', d3.forceX(width / 2))
            .force('y', d3.forceY(height / 2))
            .on('tick', tick)
        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'start-arrow')
            .attr("markerUnits","userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10")//坐标系的区域
            .attr("refX",25)//箭头坐标
            .attr("refY", -1)
            .attr("markerWidth", 12)//标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width",2)//箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")//箭头的路径
            .attr('fill','#de7425');//箭头颜色
        const dragLine = svg.append('svg:path')
            .attr('class', 'link dragline hidden')
            .attr('d', 'M0,0L0,0');
        let path = svg.append('svg:g').selectAll('path');
        let text = svg.append('svg:g').selectAll('text');
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
            text
                .attr("x",function(d){
                    return (d.source.x+d.target.x)/2;
                })
                .attr("y",function(d){
                    return (d.source.y+d.target.y)/2;
                });
            circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
        }
        function restart() {
            text = text.data(links);
            text = text.enter().append('svg:text')
                .text(function(d){
                    console.log("ssssss")
                    return d.relation;
                })
                .merge(text);


            path = path.data(links);
            path = path.enter().append('svg:path')
                .style("stroke","#de7425")
                .style("stroke-width",1)
                .attr("marker-end", "url(#start-arrow)" )//根据箭头标记的id号标记箭头
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
    dataSource.dataMap();
})