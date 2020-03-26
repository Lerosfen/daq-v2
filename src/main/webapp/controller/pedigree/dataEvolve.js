$package("dataEvolve");

dataEvolve = {
    initdataEvolve: function(){
        this.obj = {
            DataEvolveType : $('#DataEvolveType'),
            DataDataEvolve:$("#DataDataEvolve"),
            TracingSource:$("#TracingSource"),
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
                res.data.forEach((item, index, arr) => {
                    self.obj.DataEvolveType.append(`<option  value="${index}">${item.selectName}</option>`);
                });
                self.obj.DataDataEvolve.append(`<option  value="0">请选择</option>`);
            }
        })
        self.obj.DataEvolveType.unbind().bind("change", function () {
            var label_id=($(this).val());
            $.ajax({
                type: "get",
                dataType: "json",
                url: wwwroot + "/Data/sheetData",
                async: false,
                success: function(res){
                    var DataSheet = res.data[label_id]
                    self.obj.DataDataEvolve.empty();
                    DataSheet.forEach((item, index, arr) => {
                        self.obj.DataDataEvolve.append(`<option  value="${index}">${item}</option>`);
                    });
                }
            })
        });
        self.obj.TracingSource.unbind().bind("click", function () {
            var TableName = "名称"
            $.ajax({
                type: "get",
                dataType: "json",
                url: wwwroot + "/ForceDiagram/data/?TableName="+TableName,
                async: false,
                success: function(res){
                    self.initEvolveDom()
                }
            })
        });
    },
    initEvolveDom: function(){
        var self = this;
        self.obj.dataEvolveTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/visualization/chartDIY',
            //queryParams: "queryParams",
            toolbar: "#toolbar",
            height:$(window).height()-100,
            striped: false, // 是否显示行间隔色
            cache: false,//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            rightFixedColumns:true,
            rightFixedNumber:1,
            /*leftFixedColumns:true,
            leftFixedNumber:2,*/
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
                field: 'id',
                title: '操作',
                align: 'left',
                formatter: function(id){
                    return '<a href="#" onclick="dataEvolve.ChangeProcess(\'' + id + '\')" title="查看变更过程"><span class="glyphicon glyphicon-search"></span></a>'
                }
            }]
        })
    },
    ChangeProcess:function(){
        var self = this;
        YunpiDialog.open({
            title: "变更过程",
            url: 'dataEvolvelog.html',
            sureBtn:true,
            size:1024,
            afterWinOpen:function(){//打开页面时赋值
                self.ChangeDetails()
            },
            onSureClick:function(){

            }
        });
    },
    ChangeDetails:function () {
        var width = 1022;
        var height = 600;
        document.querySelector("#dataEvolveLog").innerHTML ='';
        var colors = d3.scaleOrdinal(d3.schemeCategory10);
        var svg = d3.select("#dataEvolveLog").append("svg")
            .on('contextmenu', () => { d3.event.preventDefault(); })
            .attr('width', width)
            .attr('height', height);
        var nodes = [
            { "id": "源" , "image" : "/resources/img/Forced/radio.png","type":"1" },
            { "id": "table_A" , "image" : "/resources/img/Forced/radio.png","type":"1" },
            { "id": "col1 : 1", "image" : "/resources/img/Forced/rect.png","type":"0" },
            { "id": "col2 : x", "image" : "/resources/img/Forced/rect.png","type":"0" },
            { "id": "col3 : z" , "image" : "/resources/img/Forced/rect.png","type":"0" },
            { "id": "class_A" , "image" : "/resources/img/Forced/radio.png","type":"1" },
            { "id": "col1 : 1_a" , "image" : "/resources/img/Forced/rect.png","type":"0" },
            { "id": "col2 : x_00" , "image" : "/resources/img/Forced/rect.png","type":"0" },
            { "id": "col3 : z_01" , "image" : "/resources/img/Forced/rect.png","type":"0" }
        ];
        var links = [{ "source": nodes[0] , "target": nodes[1] , "relation":"挚友" },
            { "source": nodes[1] , "target": nodes[2] , "relation":"挚友" },
            { "source": nodes[1] , "target": nodes[3] , "relation":"挚友" },
            { "source": nodes[1] , "target": nodes[4] , "relation":"父子" },
            { "source": nodes[2] , "target": nodes[5] , "relation":"母子" },
            { "source": nodes[3] , "target": nodes[5] , "relation":"义兄弟" },
            { "source": nodes[4] , "target": nodes[5] , "relation":"挚友" },
            { "source": nodes[5] , "target": nodes[6], "relation":"挚友" },
            { "source": nodes[5] , "target": nodes[7] , "relation":"挚友" },
            { "source": nodes[5] , "target": nodes[8] , "relation":"挚友" }
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
            .attr("viewBox", "0 -5 10 10")//坐标系的区域
            .attr("refX",28)//箭头坐标
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
        let rect = svg.append('svg:g').selectAll('g');

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
            rect.attr('transform', (d) => `translate(${(d.x-50)},${(d.y-39)})`);
        }
        function restart() {
            path = path.data(links);
            path = path.enter().append('svg:path')
                .style("stroke","#de7425")
                .style("stroke-width",1)
                .attr("marker-end", "url(#start-arrow)" )//根据箭头标记的id号标记箭头
                .merge(path);
            rect = rect.data(nodes, (d) => d.id);
            rect.selectAll('rect')
            rect.exit().remove();
            const g = rect.enter().append('svg:g');
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
                .on('click', function (rect) {
                })
                .call(
                    d3.drag()
                        .on('start', (d) => {
                            if (!d3.event.active) force.alphaTarget(0.8).restart();
                            d.fx = d.x;
                            d.fy = d.y;
                        })
                        .on('drag', (d) => {
                            d.fx = d3.event.x;
                            d.fy = d3.event.y;
                        })
                        .on('end', (d) => {
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
            rect = g.merge(rect);
            force
                .nodes(nodes)
                .force('link').links(links);
            // force.alphaTarget(0.3).restart();
            g.attr("cx",function(d){ return d.x });
            g.attr("cy",function(d){ return d.y });
        }
        restart();
    }
}

$(function(){
    dataEvolve.initdataEvolve()
})