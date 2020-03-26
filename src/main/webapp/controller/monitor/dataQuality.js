$package("CpuOperation");

CpuOperation = {
    initCpuOperation: function(){
        this.obj = {
            ChangeChoice : $('#ChangeChoice')
        };
        this.data = {
            data: [],
        }
        this.DataInit();
        this.fusionMonitoring();
        this.Refresh()
        this.taskMonitor();
        this.DataMonitoring()
        this.VolumeMonitoring();
        this.OverallMonitoring();
        this.Monitor()
    },
    /**
     *初始化事件
     */
    DataInit(){
        var self = this;
        /**
         * 数据质量变更监控 下拉框
         */
        self.obj.ChangeChoice.unbind().bind("change", function () {
            var label_id=($(this).val());
            self.fusionMonitoring();
        });
    },
    /**
     *定时更新函数
     */
    Refresh:function(){
        var self = this;
        clearInterval(window.ChangeMonitoring);
        window.ChangeMonitoring = setInterval(function () {
            self.taskMonitor();
        },5000)
    },
    /**
     *数据总量监控
     */
    DataMonitoring:function(){
        var self = this;
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/TotalData/Monitoring",
            async: false,
            success: function(res){
                var TotalDataHtml = ""
                for(var j=0;j<res[0].TotalDataName.length;j++){
                    var q = res[0].TotalDataName.substring(j,j+1);
                    TotalDataHtml +=`<b>${q}</b>`
                }
                $("#TotalDataName p").html(TotalDataHtml)

                var AcquisitionNameHtml = ""
                for(var j=0;j<res[0].AcquisitionName.length;j++){
                    var q = res[0].AcquisitionName.substring(j,j+1);
                    AcquisitionNameHtml +=`<b>${q}</b>`
                }
                $("#AcquisitionName p").html(AcquisitionNameHtml)

                var InterfaceNameHtml = ""
                for(var j=0;j<res[0].InterfaceName.length;j++){
                    var q = res[0].InterfaceName.substring(j,j+1);
                    InterfaceNameHtml +=`<b>${q}</b>`
                }
                $("#InterfaceName p").html(InterfaceNameHtml)

                var ModelNameHtml = ""
                for(var j=0;j<res[0].ModelName.length;j++){
                    var q = res[0].ModelName.substring(j,j+1);
                    ModelNameHtml +=`<b>${q}</b>`
                }
                $("#ModelName p").html(ModelNameHtml)
            }
        })
    },
    /**
     *数据量变更监控
     */
    VolumeMonitoring:function(){
        var self = this;
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/DataVolume/ChangeMonitoring",
            async: false,
            success: function(res){
                $("#DaliyTotal b").html(`${res[0].TargetsStatisticsName}个`)
                $("#ModelQuantityTotal b").html(`${res[0].SituationStatisticsName}个`)
                // $("#ModelQuantityNum b").html(res[0].ModelQuantityName)
                // $("#DailyStatisticsNum b").html(res[0].DailyStatisticsName)
            }
        })
    },
    /**
     *数据质量变更监控
     */
    Monitor:function(){
        var self = this;
        var dayNumber = -30;
        $.ajax({
            type: "get",
            dataType: "json",
            url: wwwroot + "/TimeSet/time/?lime="+dayNumber,
            async: false,
            success: function(res) {
                console.log("this is res",res)
                var MonitorTime = [];
                var MonitorValue = []
                res.forEach((item, index, arr) => {
                    MonitorTime.unshift(item.PointTime)
                    MonitorValue.unshift(item.dataValue)
                })
                self.MonitorBrokenLine(MonitorTime,MonitorValue)
                self.changedata(MonitorTime,MonitorValue)
            }
        })
    },
    /**
     * 数据质量变更监控折线图
     */
    MonitorBrokenLine:function(MonitorTime,MonitorValue){
        var containers =  document.getElementById('TargetsStatisticsNum');
        var myChart = echarts.init(containers);
        var option = {
            dataZoom: [{
                type: 'slider',
                show: true, //flase直接隐藏图形
                zoomLock:true,
                // backgroundColor:"rgba(207,235,255,0.5)", //组件的背景颜色
                fillerColor:"rgba(207,235,255,0.5)",
                xAxisIndex: [0],
                left: '10%', //滚动条靠左侧的百分比
                bottom: -5,
                start: 0,//滚动条的起始位置
                end: 40 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
            }],
            // title: {
            //     left:'center',
            //     text: '30天内日总量',
            //     textStyle:{
            //         fontSize:14
            //         ,fontWeight:'normal'
            //         ,color:'#2c82fe'
            //     },
            //     top:"12",
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: MonitorTime
            },
            grid: {
                top:"5%",
                left: '10%',
            },
            yAxis: {
                // name:"(条)",
                type: 'value',
                axisLabel:{formatter:'{value}'}
            },
            series: [{
                name: '情报量',
                type: 'line',
                stack: '总量',
                smooth: true,    //曲线平滑
                itemStyle: {
                    normal: {
                        borderColor: '#2aa7ff',
                        areaStyle: {
                            type: 'default',
                            //渐变色实现
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1,//变化度
                                //三种由深及浅的颜色
                                [{
                                    offset: 0,
                                    color: '#b0d2eb'
                                }, {
                                    offset: 0.5,
                                    color: '#bcdef6'
                                }, {
                                    offset: 1,
                                    color: '#cfebff'
                                }]),
                        },
                        lineStyle: {  //线的颜色
                            color: '#9ed7ff'
                        },
                        //以及在折线图每个日期点顶端显示数字
                        label: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: '#333'
                            }
                        }
                    },
                },
                areaStyle: {},
                data:MonitorValue,
            }],
        };
        myChart.setOption(option);
    },
    /**
     *模型表数据量变更监控
     */
    changedata:function(MonitorTime,MonitorValue){
        var containers =  document.getElementById('DailyStatisticsName');
        var myChart = echarts.init(containers);
        var option = {
            dataZoom: [{
                type: 'slider',
                show: true, //flase直接隐藏图形
                zoomLock:true,
                // backgroundColor:"rgba(207,235,255,0.5)", //组件的背景颜色
                fillerColor:"rgba(207,235,255,0.5)",
                xAxisIndex: [0],
                left: '10%', //滚动条靠左侧的百分比
                bottom: -5,
                start: 0,//滚动条的起始位置
                end: 40 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
            }],
            // title: {
            //     left:'center',
            //     text: '30天内日总量',
            //     textStyle:{
            //         fontSize:14
            //         ,fontWeight:'normal'
            //         ,color:'#2c82fe'
            //     },
            //     top:"12",
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: MonitorTime
            },
            grid: {
                top:"5%",
                left: '10%',
            },
            yAxis: {
                // name:"(条)",
                type: 'value',
                axisLabel:{formatter:'{value}'}
            },
            series: [{
                name: '情报量',
                type: 'line',
                stack: '总量',
                smooth: true,    //曲线平滑
                itemStyle: {
                    normal: {
                        borderColor: '#dcf8eb',
                        areaStyle: {
                            type: 'default',
                            //渐变色实现
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1,//变化度
                                //三种由深及浅的颜色
                                [{
                                    offset: 0,
                                    color: '#dcf8eb'
                                }, {
                                    offset: 0.5,
                                    color: '#9ee0c2'
                                }, {
                                    offset: 1,
                                    color: '#b5decb'
                                }]),
                        },
                        lineStyle: {  //线的颜色
                            color: '#4fda9d'
                        },
                        //以及在折线图每个日期点顶端显示数字
                        label: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: '#333'
                            }
                        }
                    },
                },
                areaStyle: {},
                data:MonitorValue,
            }],
        };
        myChart.setOption(option);
    },
    /**
     *数据质量（总体）监控
     */
    OverallMonitoring:function(){
        var self = this;
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/Overall/Monitoring",
            async: false,
            success: function(res){
                $("#ConformityConstraintsNum b").html(res[0].ConformityConstraintsName)
                $("#NotConformityNum b").html(res[0].NotConformityName)
            }
        })
    },
    /**
     *数据采集任务量变更监控
     */
    taskMonitor:function(){
        var self = this;
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/cleanRule/CPUList",
            async: false,
            success: function(res){
                var taskNumber = (res.SpeedNum*10/3690)*100;
                var  taskCont =  res.SpeedNum*10
                self.TasksOperation(taskNumber,taskCont)
            }
        })
    },
    /**
     *运行中任务量
     */
    TasksOperation:function(SpeedNum,taskCont){
        var TasksOther =document.getElementById('NotConformityThanNum');
        var TasksOtherChart = echarts.init(TasksOther);
        var  SpeedNum = parseInt(SpeedNum);
        var labelTop = {//上层样式
            // x, y, x2, y2：向量坐标，即渐变开始的起点坐标 (x, y)，与结束坐标 (x2, y2) 需要注意的是值的范围在 0 ～ 1 之间
            normal : {
                color: '#4fda9d',
                label : {
                    show : false,
                    position : 'center',
                    formatter : '{b}',
                    textStyle: {
                        baseline : 'bottom',
                        fontSize:26
                    }
                },
                labelLine : {
                    show : false
                }
            }
        };
        var labelBottom = {//底层样式
            normal : {
                color:"#eef4f6",
                label : {
                    show : true,
                    position : 'center',
                    fontSize:20,
                    color:'#000000',
                    fontWeight:'bold',
                },
                labelLine : {
                    show : false
                }
            },
            emphasis: {//悬浮式样式
                color: 'rgba( 0,0,0,0)'
            }
        };
        var radius = [50,70];// 半径[内半径，外半径]

        var pieChartOption = {
            animation:false,
            title:{
                text:"不符合规则约束占比",
                left:"center",
                bottom:"2%",
                textStyle:{
                    //文字颜色
                    color:'#4c4b4b',
                    //字体风格,'normal','italic','oblique'
                    fontStyle:'normal',
                    //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                    fontWeight:'normal',
                    //字体大小
                    fontSize:14
                }
            },
            tooltip : {
                trigger: 'axis',
                show: false,   //default true
                showDelay: 0,
                hideDelay: 50,
                transitionDuration:0,
                borderRadius : 8,
                borderWidth: 2,
                padding: 10,    // [5, 10, 15, 20]
            },
            series : [
                {
                    type : 'pie',
                    silent:true,
                    center: ['50%', '40%'],
                    radius : radius,//半径
                    x: '0%',
                    itemStyle : labelTop,
                    data : [
                        {name:'', value:SpeedNum,itemStyle : labelTop},
                        {name:`${SpeedNum}%`, value:100-SpeedNum, itemStyle : labelBottom}
                    ],
                }
            ]
        };
        TasksOtherChart.setOption(pieChartOption);
    },
    /**
     *数据质量变更监控
     */
    fusionMonitoring:function(){
        var self = this;
        var dayNumber = -100;
        $.ajax({
            type: "get",
            dataType: "json",
            url: wwwroot + "/TimeSet/time/?lime="+dayNumber,
            async: false,
            success: function(res) {
                var PointTime = [];
                var dataValue = []
                var  Proportion = []
                res.forEach((item, index, arr) => {
                    PointTime.unshift(item.PointTime)
                    dataValue.unshift(item.dataValue)
                    Proportion.unshift(item.Proportion)
                })
                self.CpuOperationCategory(PointTime,dataValue,Proportion)
            }
        })
    },
    /**
     *待处理数据量实时监控
     */
    CpuOperationCategory:function (PointTime,dataValue,Proportion) {
        var containers =  document.getElementById('CpuOperationCategory');
        var myChart = echarts.init(containers);
        // var option = {
        //     dataZoom: [{
        //         type: 'slider',
        //         show: true, //flase直接隐藏图形
        //         zoomLock:true,
        //         // backgroundColor:"rgba(207,235,255,0.5)", //组件的背景颜色
        //         fillerColor:"rgba(207,235,255,0.5)",
        //         xAxisIndex: [0],
        //         left: '10%', //滚动条靠左侧的百分比
        //         bottom: -5,
        //         start: 0,//滚动条的起始位置
        //         end: 40 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
        //     }],
        //     title: {
        //         left:'center',
        //         text: '变更情况分析',
        //         textStyle:{
        //             fontSize:14
        //             ,fontWeight:'normal'
        //             ,color:'#2c82fe'
        //         },
        //         top:"12",
        //     },
        //     grid: {
        //         bottom: 80
        //     },
        //     tooltip : {
        //         trigger: 'axis',
        //         axisPointer: {
        //             animation: false
        //         },
        //         formatter: function (params) {
        //             var res = params[0].name;
        //             for (var i = 0, l = params.length; i < l; i++)
        //             {
        //                 if(i==0)
        //                 {
        //                     res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
        //                 }
        //                 else
        //                 {
        //                     res += '<br/>' + params[i].seriesName + ' : ' + params[i].value+ "%";
        //                 }
        //             }
        //             return res;
        //         }
        //     },
        //     legend: {
        //         data:['符合规则数据量','比例'],
        //         x: 'left'
        //     },
        //     xAxis : [
        //         {
        //             type : 'category',
        //             boundaryGap : false,
        //             axisLine: {onZero: false},
        //             data : PointTime
        //         }
        //     ],
        //     yAxis: [
        //         {
        //             name: '符合规则数据量(条)',
        //             type: 'value',
        //             axisLabel: {
        //                 show: true,
        //                 interval: 'auto',
        //                 formatter: '{value}'
        //             }
        //         },
        //         {
        //             name: '比例(%)',
        //             nameLocation: 'start',
        //             type: 'value',
        //             inverse: true,
        //             axisLabel: {
        //                 show: true,
        //                 interval: 'auto',
        //                 formatter: '{value}%'
        //             }
        //         }
        //     ],
        //     series: [
        //         {
        //             name:'符合规则数据量',
        //             type:'line',
        //             hoverAnimation: false,
        //             itemStyle: {
        //                 normal: {
        //                     color:'#0b96f7', //改变折线点的颜色
        //                     lineStyle:{
        //                         color:'#0e9cff' //改变折线颜色
        //                     },
        //                     label : {
        //                         show:false,
        //                         position:'top',
        //                         formatter:'{c}'
        //                     }
        //                 }
        //             },
        //             areaStyle: {
        //                 normal: {
        //                     color: '#cfebff' //改变区域颜色
        //                 }
        //             },
        //             lineStyle: {
        //                 normal: {
        //                     width: 1
        //                 }
        //             },
        //             data:dataValue
        //         },
        //         {
        //             name:'比例',
        //             type:'line',
        //             yAxisIndex:1,
        //             hoverAnimation: false,
        //             itemStyle: {
        //                 normal: {
        //                     color:'#65f7b7', //改变折线点的颜色
        //                     lineStyle:{
        //                         color:'#05f68c' //改变折线颜色
        //                     },
        //                     label : {
        //                         show:false,
        //                         position:'top',
        //                         formatter:'{c}%'
        //                     }
        //                 }
        //             },
        //             areaStyle: {
        //                 normal: {
        //                     color: '#a1edcc' //改变区域颜色
        //                 }
        //             },
        //             lineStyle: {
        //                 normal: {
        //                     width: 1
        //                 }
        //             },
        //             data: Proportion
        //         },
        //     ]
        // };
        var  option ={
            color: ['#4fda9d'],  //设置多个颜色值时代表的是图例颜色
            dataZoom: [{
                type: 'slider',
                show: true, //flase直接隐藏图形
                zoomLock:true,
                // backgroundColor:"rgba(207,235,255,0.5)", //组件的背景颜色
                fillerColor:"rgba(207,235,255,0.5)",
                xAxisIndex: [0],
                left: '10%', //滚动条靠左侧的百分比
                bottom: 10,
                start: 0,//滚动条的起始位置
                end: 40 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
            }],
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                },
                formatter: function (params) {
                    var res = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++)
                    {
                        if(i==0)
                        {
                            res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                        }
                        else
                        {
                            res += '<br/>' + params[i].seriesName + ' : ' + params[i].value+ "%";
                        }
                    }
                    return res;
                }
            },
            title: {
                left:'center',
                text: '变更情况分析',
                textStyle:{
                    fontSize:14
                    ,fontWeight:'normal'
                    ,color:'#2c82fe'
                },
                top:"12",
            },
            grid: {
                bottom: 80
            },
            legend: {
                data:['符合规则数据量','比例'],
                x: 'right'
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    axisLine: {onZero: false},
                    data : PointTime
                }
            ],
            yAxis: [   //当有两个y轴时，设置两个{}{}来承载y轴的值
                {
                    name: '符合规则数据量(条)',
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 'normal',
                        },
                    },
                    // splitLine: { show: false },  //y轴网格线，一般都会隐藏，x轴亦是如此

                },
                {
                    name: '比例(%)',
                    type: 'value',
                    min: 0,
                    axisLabel: {
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 'normal',
                        },
                    },
                    splitLine: { show: false },
                },
            ],
            series: [    //对应折线图和柱形图，进行数据加载
                {
                    name: '符合规则数据量',
                    type: 'bar',
                    data: dataValue,
                    // barWidth : 20,//柱图宽度
                    barCategoryGap:"50%" // 控制柱子的间隔
                },
                {
                    name: '比例',
                    type: 'line',
                    yAxisIndex: 1,
                    data: Proportion,
                    itemStyle: {
                        normal: {
                            color:'#129eff', //改变折线点的颜色
                            lineStyle:{
                                color:'#129eff' //改变折线颜色
                            },
                            label : {
                                show:false,
                                position:'top',
                                formatter:'{c}%'
                            }
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#cfebff' //改变区域颜色
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                        },
                    },
                    lineStyle: {
                        normal: {
                            width: 1,
                        },
                    },
                },
            ],
        }
        myChart.setOption(option);
    },
};

$(function(){
    CpuOperation.initCpuOperation();
})