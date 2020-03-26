/**
 * 元数据管理页面js
 */
$package("dataVisualizationShow");
dataVisualizationShow={
    /**
     * 初始化方法
     */
    initMetadata:function() {
        this.obj = {
            dataVisualizaBtn : $('#dataVisualizaBtn'),
            dataVisualizaType : $('#dataVisualizaType'),
            dataVisualizaName : $('#dataVisualizaName'),
            fadeOutright:$(".right")
        };
        this.initEvent();//index页面事件初始化
    },
    visualization:function(dataVisualizaVal,page){
        var self = this;
        $.ajax({
            type: 'get',
            dataType: 'json',
            async:false,//同步获取，确保在表格数据加载的时候字典信息可用
            url: wwwroot + "/DataSearch/visualization/?visualization="+1,
            success: function (res) {
                var resArry = [];
                resArry.push(res)
                self.initChart(dataVisualizaVal,resArry)
            },
            error: function () {
                YunpiAlert.error('部门列表查询失败！');
            }
        });
    },
    initChart(search,data){
        var self=this;
        var Other =  document.getElementById('dataVisualizaChants');
        var charts = echarts.init(Other);
        var colors = ['#72d3f9', '#4185f7', '#62abe1', '#3060ba', '#0057a6', '#00a3d0', '#03a7dc', '#16dcdc', '#2976b2', '#2976b2'];
        var planePath = 'circle';
        var node=[];
        var link=[];
        var cate=[];
        node.push({
            name:search,
            symbolSize:20,
            draggable:true
        })
        for(var i=0;i<data.length;i++){
            cate.push({
                name:data[i].modelName,
                "itemStyle": {
                    "normal": {
                        "color": colors[i],
                    }
                }
            })
            link.push({
                source:search ,
                target:data[i].id,
                lineStyle: {
                    normal: {
                        color: colors[0]
                    }
                }
            })
            node.push({
                name:data[i].modelName,
                detail:data[i].data,
                id:data[i].id,
                category:i,
                draggable:true,
                symbolSize:15,
                value: 200,
                label: {
                    normal: {
                        textStyle: {
                            color: colors[0]
                        }
                    }
                }
            })
            console.log('cate',cate)
            for(var j=0;j<data[i].relationModels.length;j++){
                if(data[i].relationModels.length>0){
                    node.push({
                        name:data[i].relationModels[j].modelName,
                        detail:data[i].relationModels[j].data,
                        id:data[i].relationModels[j].id,
                        category:i,
                        draggable:true,
                        symbolSize:10,
                        value:80,
                        label: {
                            normal: {
                                //   "show": true,
                                textStyle: {
                                    color: colors[1]
                                }
                            }
                        }
                    })
                    link.push({
                        source:data[i].id ,
                        target: data[i].relationModels[j].id,
                        lineStyle: {
                            normal: {
                                color: colors[1]
                            }
                        }
                    })
                    for(var k=0;k<data[i].relationModels[j].relationModels.length;k++){
                        if(data[i].relationModels[j].relationModels.length>0){
                            node.push({
                                name:data[i].relationModels[j].relationModels[k].modelName,
                                detail:data[i].relationModels[j].relationModels[k].data,
                                id:data[i].relationModels[j].relationModels[k].id,
                                category:i,
                                draggable:true,
                                symbolSize:9,
                                value: 20,
                                label: {
                                    normal: {
                                        //   "show": true,
                                        textStyle: {
                                            color: colors[2]
                                        }
                                    }
                                }
                            })
                            link.push({
                                source:data[i].relationModels[j].id ,
                                target:data[i].relationModels[j].relationModels[k].id,
                                lineStyle: {
                                    normal: {
                                        color: colors[2]
                                    }
                                }
                            })
                        }
                    }
                }
            }
        }
        var option1 = {
            backgroundColor: '#fff',
            legend: {
                show:false,
                textStyle: {
                    color: '#fff'
                },
                icon: 'circle',
                type: 'scroll',
                orient: 'vertical',
                left: 10,
                top: 20,
                bottom: 20,
                itemWidth: 10,
                itemHeight: 10
            },
            tooltip: {
                formatter: function(parmes) {
                    if (parmes.data.name) {
                        return  parmes.name;
                    }
                }
            },
            animationDurationUpdate: 300,
            animationEasingUpdate: 'quinticInOut',
            series: [{
                type: 'graph',
                layout: 'force',
                symbol: planePath,
                symbolSize: 5,
                roam: true,
                focusNodeAdjacency: true,
                legendHoverLink: true,
                draggable: true,
                force: {
                    repulsion: 400,
                    gravity: 0.01,
                    edgeLength: 5,
                    layoutAnimation: true
                },
                categories: cate,
                data: node,
                links: link,
                label: {
                    normal: {

                        show: true,
                        position: 'top',

                    }
                },
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        width: 1.5,
                        curveness: 0
                    }
                }
            }]
        };
        charts.setOption(option1)
        charts.on('click', function (params) {
            $("#result-box").fadeIn()
            var detailArry = [];
            detailArry.push(params.data.detail)
            var DataBox = "";
            detailArry.forEach(function (intem,index) {
                DataBox += `
                   <li class="result-list">
                         <div>${intem.ROWKEY}</div>
                    </li>
                    <li class="result-list">
                        <div>${intem.Attending_doctor}</div>
                    </li>
                    <li class="result-list">
                        <div>${intem.Diseases}</div>
                    </li>
                    <li class="result-list">
                        <div>${intem.Name_of_patient}</div>
                    </li>
                    <li class="result-list">
                        <div>${intem.Patient_age}</div>
                    </li>
                    <li class="result-list">
                        <div>${intem.Ving_number}</div>
                    </li>
                    <li class="result-list">
                        <div>${intem.Visiting_Department}</div>
                    </li>
                    <li class="result-list">
                        <div>${intem.Visiting_time}</div>
                    </li>
                    `
            })
            $("#DataBox").html(DataBox);
        })

    },
    /**
     * 页面事件绑定
     */
    initEvent:function() {
        var self = this;
        /**
         * 查询按钮
         */
        self.obj.dataVisualizaBtn.unbind().bind("click", function () {
            var dataVisualizaVal =  self.obj.dataVisualizaName.val();
            if (dataVisualizaVal == ""){
                YunpiAlert.warning('请输入检索内容！');
            }else{
                self.visualization(dataVisualizaVal,1);
            }

        });
        self.obj.fadeOutright.unbind().bind("click", function () {
            $("#result-box").fadeOut()
        });

    },
};
$(function(){
    dataVisualizationShow.initMetadata();
});