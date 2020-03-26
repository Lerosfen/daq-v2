/**
 * 元数据管理页面js
 */
$package("metadataCheck");
metadataCheck={
    /**
     * 初始化方法
     */
    initMetadata:function() {
        this.obj = {
            selectCheckBtn : $('#selectCheckBtn'),
            resetCheckBtn : $('#resetCheckBtn'),
            CheckName : $('#CheckName'),
            CheckType : $('#CheckType'),
            tradeType : $('#tradeType'),
            metadataCheckTable : $('#metadataCheckTable')
        };
        //定义当前页面的全局数据变量
        this.vars={
            rorName :"",
            CheckTypeArray:[],
            CheckTypeDic:[],
            tradeTypeArray:[],
            tradeTypeDic:[],
            deptArray:[],
            deptDic:[]
        };
        this.initDom();
        this.initEvent();//index页面事件初始化
    },
    /**
     * 页面初始化
     */
    initDom:function(){
        var self = this;
        YunpiLight.open();
        /*获取来源编码字典*/
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/metadataCheck",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.CheckTypeArray = responseData.data;
                    self.vars.CheckTypeDic = responseData.data.toDict("dicCode",true);
                    //查询条件中的数据源来源选择初始化
                    $.each(self.vars.CheckTypeArray,function(i,item){
                        self.obj.CheckType.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('元数据来源字典查询失败！');
            }
        });
        /*获取领域编码字典*/
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/base/api/dictionary/trade_type",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.tradeTypeArray = responseData.data;
                    self.vars.tradeTypeDic = responseData.data.toDict("dicCode",true);
                    //查询条件中的数据源来源选择初始化
                    $.each(self.vars.tradeTypeArray,function(i,item){
                        self.obj.tradeType.append('<option value="'+item.dicCode+'" >'+item.dicName+'</option>');
                    });
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('领域字典查询失败！');
            }
        });
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/basicManage/dept",
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    self.vars.deptArray = responseData.data;
                    self.vars.deptDic = responseData.data.toDict("id",true);
                }else{
                    YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('部门列表查询失败！');
            }
        });

        /*初始化表格*/
        self.obj.metadataCheckTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/metadata',
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
                field: 'metadataName',
                title: '元数据名称',
                width: 500
            }, {
                field: 'metaType',
                title: '来源',
                width: 200,
                formatter: function(value) {
                    return self.vars.CheckTypeDic.getText(value,"dicName");
                }
            },{
                field: 'deptId',
                title: '提供部门',
                width: 400,
                formatter: function(value) {
                    return self.vars.deptDic.getText(value,"deptName");
                }
            },{
                field: 'tradeType',
                title: '所属领域',
                width: 400,
                formatter: function(value) {
                    return self.vars.tradeTypeDic.getText(value,"dicName");
                }
            },{
                field: 'version',
                title: '版本',
                width: 200,
                formatter: function(value) {
                    return ("V"+value);
                }
            },{
                field: 'desc',
                title: '描述',
                width: 500
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
                width: 350,
                align: 'left',
                formatter: function (value, row, index) {
                    var id = value;
                    var result = "";
                    result += '<a href="#" onclick="metadataCheck.marker(\'' + row.metadataName + '\')" title="定位"><span class="glyphicon glyphicon-map-marker"></span></a>';
                    return result;
                }
            }]
        });
        YunpiLight.close();
    },
    /**
     * 页面事件绑定
     */
    initEvent:function() {
        var self = this;
        /**
         * 查询按钮
         */
        self.obj.selectCheckBtn.unbind().bind("click", function () {
            //TODO 获取添加参数传递给服务端
            /*metadataName
                CheckType*/
            self.obj.metadataCheckTable.bootstrapTable('refresh');
        });
        /**
         * 重置按钮
         */
        self.obj.resetCheckBtn.unbind().bind("click", function () {
            self.obj.CheckName.val("");
            self.obj.CheckType.val("");
            self.obj.tradeType.val("");
            //TODO 清空查询参数传递给服务端
            self.obj.metadataCheckTable.bootstrapTable('refresh');
        });
    },
    /**
     * 定位
     * @param id
     */
    marker:function(row){
        var self = this;
        YunpiDialog.open({
            title:"元数据定位",
            url:"metadataMarker.html",
            sureBtn:false,
            size:950,
            afterWinOpen:function(){//打开页面时赋值
                console.log("this is row",row)
                self.vars.rorName = row
                self.Traceability(self.vars.rorName)
            },
            beforeWinClose:function(){//关闭时清空form
            }
        });
    },
    /**
     *定位关系图
     */
    Traceability:function (name) {
        var self = this;
        var width = 948;
        var height = 600;
        var radius = 30;    //圆形半径
        var img_w = 77;
        var img_h = 80;
        var flag = true;
        var nodeSub = []
        document.querySelector("#metadataMarker").innerHTML ='';
        var colors = d3.scaleOrdinal(d3.schemeCategory10);
        var svg = d3.select("#metadataMarker").append("svg")
            .on('contextmenu', () => { d3.event.preventDefault(); })
            .attr('width', width)
            .attr('height', height);
        var nodes = [
            { "id": `${name}` , "image" : "/resources/img/Forced/radio.png","num":"0"},
            { "id": "表1" , "image" : "/resources/img/Forced/2.png","num":"1" },
            { "id": "表2", "image" : "/resources/img/Forced/2.png","num":"2" },
            { "id": "表3", "image" : "/resources/img/Forced/2.png","num":"3" },
            { "id": "表4" , "image" : "/resources/img/Forced/2.png","num":"4" },
            { "id": "表5" , "image" : "/resources/img/Forced/2.png","num":"5" }

        ];
        var links = [  { "source": nodes[0] , "target": nodes[1] , "relation":"挚友" },
            { "source": nodes[0] , "target": nodes[2] , "relation":"挚友" },
            { "source": nodes[0] , "target": nodes[3] , "relation":"挚友" },
            { "source": nodes[0] , "target": nodes[4] , "relation":"父子" },
            { "source": nodes[0] , "target": nodes[5] , "relation":"母子" },
        ];
        var force = d3.forceSimulation()
            .force('link', d3.forceLink().id((d) => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-1500))
            .force('x', d3.forceX(width / 2))
            .force('y', d3.forceY(height / 2))
            .on('tick', tick)
        svg.append('svg:defs').append('svg:marker')
            .attr("id", "start-arrow")
            .attr("markerUnits","userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10")//坐标系的区域
            .attr("refX",32)//箭头坐标
            .attr("refY", 0)
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
                    svg.classed('active', true);
                    console.log("circle",circle)
                    if (d3.event.ctrlKey || mousedownNode || mousedownLink) return;
                    if(circle.id != self.vars.rorName){
                        if(nodeSub.length == 0){
                            nodeSub.push(circle.id)
                            nodes.push({id:`${circle.id}字段1`,"image" : "/resources/img/Forced/3.png"},{id: `${circle.id}字段2`,"image" : "/resources/img/Forced/3.png"});
                            links.push({ source : nodes[nodes.length-2], target: nodes[circle.num] },{ source : nodes[nodes.length-1]  , target: nodes[circle.num] });
                            restart();
                        }else{
                            nodes.splice(nodes.length-2, nodes.length);
                            links.splice(links.length-2, links.length);
                            nodes.push({id: `${circle.id}字段1`,"image" : "/resources/img/Forced/3.png"},{id: `${circle.id}字段2`,"image" : "/resources/img/Forced/3.png"});
                            links.push({ source : nodes[nodes.length-2], target: nodes[circle.num] },{ source : nodes[nodes.length-1]  , target: nodes[circle.num] });
                            restart();
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
    metadataCheck.initMetadata();
});