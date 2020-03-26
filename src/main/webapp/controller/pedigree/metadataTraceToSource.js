$package("metadataTraceToSource");

metadataTraceToSource = {
    initMDTraceToSource: function(){
        this.obj = {
            DataTableType : $('#DataTableType'),
            DataSheet:$("#DataSheet"),
            TracingSource:$("#TracingSource")
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
                    self.obj.DataTableType.append(`<option  value="${index}">${item}</option>`);
                });
                self.obj.DataSheet.append(`<option  value="0">请选择</option>`);
            }
        })
        self.obj.DataTableType.unbind().bind("change", function () {
            var label_id=($(this).val());
            $.ajax({
                type: "get",
                dataType: "json",
                url: wwwroot + "/Data/sheet",
                async: false,
                success: function(res){
                    var DataSheet = res.data[label_id]
                    self.obj.DataSheet.empty();
                    DataSheet.forEach((item, index, arr) => {
                        self.obj.DataSheet.append(`<option  value="${index}">${item}</option>`);
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
                    console.log("this is log",res)
                    self.showChart(res)
                }
            })
        });
    },
    showChart:function(root){
        var width = 1560,
            height = $("#architecture_chart").height();
        var img_w = 84;
        var img_h = 84;
        var radius = 42;    //圆形半径
        document.querySelector("#architecture_chart").innerHTML ='';
        var svg = d3.select("#architecture_chart").append("svg")
            .attr("width",width)
            .attr("height",height);
            //D3力导向布局
            var force = d3.layout.force()
                .nodes(root.nodes)
                .links(root.edges)
                .size([width,height])
                .linkDistance(200)
                .charge(-1500)
                .start();
                svg.append("marker")
                //.attr("id", function(d) { return d; })
                    .attr("id", "resolved")
                    //.attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
                    .attr("markerUnits","userSpaceOnUse")
                    .attr("viewBox", "0 0 12 12")//坐标系的区域
                    // .attr("refX",130)//箭头坐标
                    // .attr("refY", 0)
                    .attr("refX",-28)//箭头坐标
                    .attr("refY", 5.2)
                    .attr("markerWidth", 18)//标识的大小
                    .attr("markerHeight", 18)
                    .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
                    .attr("stroke-width",5)//箭头宽度
                    .append("path")
                    .attr("d", "M8,11 L0,5 L10,2 L6,6 L8,11")//箭头的路径
                    .attr('fill','#de7425');//箭头颜色

            //边
            var edges_line = svg.selectAll("line")
                .data(root.edges)
                .enter()
                .append("line")
                .style("stroke","#de7425")
                .style("stroke-width",1)
                .attr("marker-start", "url(#resolved)" );//根据箭头标记的id号标记箭头
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
                    //单击时让连接线加粗
                    edges_line.style("stroke-width",function(line){
                        if(line.source.name==node.name || line.target.name==node.name){
                            return 2;
                        }else{
                            return 0.5;
                        }
                    });
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
                    color="#B43232";
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
                //更新结点图片和文字
                nodes_img.attr("cx",function(d){ return d.x });
                nodes_img.attr("cy",function(d){ return d.y });
            });
            function transform2(d) {
                return "translate(" + (d.x) + "," + d.y + ")";
            }
    },
}

$(function(){
    metadataTraceToSource.initMDTraceToSource()
})