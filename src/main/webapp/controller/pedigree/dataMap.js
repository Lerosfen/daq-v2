$package("entityModel");

entityModel = {
    dataMap: function(){
        this.MapRelationship()
    },
    /**
     *溯源结果展示
     */
    MapRelationship:function () {
        var width = 1558;
        var height = $("#MapData").height()-4;
        var radius = 30;    //圆形半径
        var img_w = 77;
        var img_h = 80;
        var flag = true;
        var nodeSub = []
        var colors = d3.scaleOrdinal(d3.schemeCategory10);
        var svg = d3.select("#MapData").append("svg")
            .on('contextmenu', () => { d3.event.preventDefault(); })
            .attr('width', width)
            .attr('height', height);
        var nodes = [
            { "id": "A库" , "image" : "/resources/img/Forced/radio.png","num":"0"},
            { "id": "B库" , "image" : "/resources/img/Forced/radio.png","num":"1" },
            { "id": "A表" , "image" : "/resources/img/Forced/green.png","num":"2" },
            { "id": "B表", "image" : "/resources/img/Forced/green.png","num":"3" },
            { "id": "C表", "image" : "/resources/img/Forced/green.png","num":"4" },
            { "id": "D表" , "image" : "/resources/img/Forced/green.png","num":"5" },
            { "id": "clear-A表" , "image" : "/resources/img/Forced/green.png","num":"6" },
            { "id": "B-d" , "image" : "/resources/img/Forced/green.png","num":"7" },
            { "id": "C-d" , "image" : "/resources/img/Forced/green.png","num":"8" },
            { "id": "D-d" , "image" : "/resources/img/Forced/green.png","num":"9" },
            { "id": "A融合表" , "image" : "/resources/img/Forced/green.png","num":"10" },
            { "id": "B融合表","image" : "/resources/img/Forced/green.png","num":"11" },
            { "id": "C融合表","image" : "/resources/img/Forced/green.png","num":"12" },
            { "id": "模型表A","image" : "/resources/img/Forced/green.png","num":"13" },
            { "id": "模型表B","image" : "/resources/img/Forced/green.png","num":"14" },
            { "id": "A接口","image" : "/resources/img/Forced/radio.png","num":"15" },
            { "id": "B接口","image" : "/resources/img/Forced/radio.png","num":"16" },
            { "id": "F表","image" : "/resources/img/Forced/green.png","num":"17" },
            { "id": "G表","image" : "/resources/img/Forced/green.png","num":"18" },
            { "id": "clear-f表","image" : "/resources/img/Forced/green.png","num":"19" },
            { "id": "clear-g表","image" : "/resources/img/Forced/green.png","num":"20" },
            { "id": "XX数据目录","image" : "/resources/img/Forced/radio.png","num":"21" },
            { "id": "XX目录","image" : "/resources/img/Forced/green.png","num":"22" },
            { "id": "YY数据目录","image" : "/resources/img/Forced/radio.png","num":"23" },
            { "id": "YY目录","image" : "/resources/img/Forced/green.png","num":"24" },
        ];
        var links = [  { "source": nodes[0] , "target": nodes[2] , "relation":"关系" },
            { "source": nodes[0] , "target": nodes[3] , "relation":"关系" },
            { "source": nodes[0] , "target": nodes[4] , "relation":"关系" },
            { "source": nodes[1] , "target": nodes[5] , "relation":"关系" },
            { "source": nodes[2] , "target": nodes[6] , "relation":"关系" },
            { "source": nodes[3] , "target": nodes[7] , "relation":"关系" },
            { "source": nodes[4] , "target": nodes[8], "relation":"关系" },
            { "source": nodes[5] , "target": nodes[9] , "relation":"关系" },
            { "source": nodes[6] , "target": nodes[10] , "relation":"关系" },
            { "source": nodes[7] , "target": nodes[10], "relation":"关系" },
            { "source": nodes[8] , "target": nodes[11], "relation":"关系" },
            { "source": nodes[9] , "target": nodes[11], "relation":"关系" },
            { "source": nodes[20] , "target": nodes[12], "relation":"关系" },
            { "source": nodes[10] , "target": nodes[13], "relation":"关系" },
            {"source": nodes[11] , "target": nodes[14], "relation":"关系"},
            {"source": nodes[12] , "target": nodes[14], "relation":"关系"},
            {"source": nodes[15] , "target": nodes[17], "relation":"关系"},
            {"source": nodes[19] , "target": nodes[11], "relation":"关系"},
            {"source": nodes[17] , "target": nodes[19], "relation":"关系"},
            {"source": nodes[16] , "target": nodes[18], "relation":"关系"},
            {"source": nodes[18] , "target": nodes[20], "relation":"关系"},
            {"source": nodes[12] , "target": nodes[14], "relation":"关系"},
            {"source": nodes[21] , "target": nodes[22], "relation":"关系"},
            {"source": nodes[23] , "target": nodes[24], "relation":"关系"}
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

            circle.attr('transform', (d) => `translate(${(d.x-50)},${(d.y-39)})`);
        }
        function restart() {
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
            g.append('svg:rect')
                .attr('class', 'node')
                .attr("width",100)
                .attr("height",78)
                .attr("fill", function(d, i){
                    var defs = svg.append("defs").attr("id", "imgdefs")
                    var catpattern = defs.append("pattern")
                        .attr("id", "catpattern" + i)
                        .attr("height", 1)
                        .attr("width", 1)
                    catpattern.append("image")
                        .attr("x", - (100 / 2 - 50))
                        .attr("y", - (78 / 2 - 39))
                        .attr("width", 100)
                        .attr("height", 78)
                        .attr("xlink:href", d.image)
                    return "url(#catpattern" + i + ")";
                })
                // .style('stroke', (d) => d3.rgb(colors(d.id)).darker().toString())
                .classed('reflexive', (d) => d.reflexive)
                .on('click', function (circle) {
                    console.log("this is circle",circle)
                    svg.classed('active', true);
                    if (d3.event.ctrlKey || mousedownNode || mousedownLink) return;
                    if(nodeSub.length == 0){
                        nodeSub.push(circle.id)
                        nodes.push({id:`${circle.id}字段1`,"image" : "/resources/img/Forced/rect.png"},{id: `${circle.id}字段2`,"image" : "/resources/img/Forced/rect.png"});
                        links.push({ source : nodes[nodes.length-2], target: nodes[circle.num] },{ source : nodes[nodes.length-1]  , target: nodes[circle.num] });
                        restart();
                    }else{
                        nodes.splice(nodes.length-2, nodes.length);
                        links.splice(links.length-2, links.length);
                        nodes.push({id: `${circle.id}字段1`,"image" : "/resources/img/Forced/rect.png"},{id: `${circle.id}字段2`,"image" : "/resources/img/Forced/rect.png"});
                        links.push({ source : nodes[nodes.length-2], target: nodes[circle.num] },{ source : nodes[nodes.length-1]  , target: nodes[circle.num] });
                        restart();
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
                .attr('x',50)
                .attr('y', 43)
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
    entityModel.dataMap();
})