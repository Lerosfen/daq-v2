$package("CpuOperation");

CpuOperation = {
    initCpuOperation: function(){
        this.obj = {
            CpuOperation:$("#CpuOperation")
        };
        this.schedule();
        this.memoryMonitorData()
        this.initHtml();
        this.initEvent("60");
        this.OperaIcontionrate("60")
        this.CpuOperationCategory();
        this.MonthlyStatistics()
        this.ReadSpeed()
        this.Refresh()
        // this.initLeiDa();

    },
    /**
     *更新函数
     */
    Refresh:function(){
        var self = this;
        clearInterval(window.scheduleOne);
        window.scheduleOne = setInterval(function(){
            self.schedule()
            self.ReadSpeed()
        },3000)
        clearInterval(window.initHtml);
        window.initHtml = setInterval(function () {
            self.initHtml()
            self.memoryMonitorData()
        },5000)
    },
    initHtml:function(){
            var htmlNum = parseInt(10 + (255 - 10) * (Math.random()))
            var Usage =Math.round((htmlNum/256)*100);
            var html = `
                <div class="progress progress-striped active" style="width: 100%;height: 40px;position: relative">
                    <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="70"
                         aria-valuemin="0" aria-valuemax="100" style="width: ${Usage}%;">
                         <p style="
                            color: #333;
                            position: absolute;
                            right: 5px;
                            top:11px;
                            z-index: 111111;
                        ">${100-Usage}%</p>
                    </div>
                </div>
                <div style="margin-top: 10px;color: #6d747e;">256GB数据量<p style="text-align: center;margin-top: 20px;">使用量</p></div>`
            $("#CpuOperationOne").html(html)
    },
    /**
     *获取内存监控数据
     */
    memoryMonitorData:function(){
        var self = this;
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/cleanRule/CPUList",
            async: false,
            success: function(res){
                var SpeedNum = res.SpeedNum ;
                self.UtilizationRate(SpeedNum)
            }
        })
    },
    /**
     *获取进度数据
     */
    schedule:function(){
        var self = this;
            $.ajax({
                type: "post",
                dataType: "json",
                url: wwwroot + "/cleanRule/CPUList",
                async: false,
                success: function(res){
                    var SpeedNum = res.SpeedNum ;
                    self.initAnnular(SpeedNum)
                    // self.initDom(SpeedNum);
                    // self.MemoryWave(SpeedNum)
                }
            })
    },
    /**
     *环形进度条
     */
    initAnnular:function(SpeedNum){
        var asd =document.getElementById('pie');
        var pieChart = echarts.init(asd);
        var  SpeedNum = SpeedNum;
        var labelTop = {//上层样式
            // x, y, x2, y2：向量坐标，即渐变开始的起点坐标 (x, y)，与结束坐标 (x2, y2) 需要注意的是值的范围在 0 ～ 1 之间
            normal : {
                color: '#4b90ff',
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
                    fontSize:30,
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
        var radius = [60,80];// 半径[内半径，外半径]

        var pieChartOption = {
            animation:false,
            title:{
                text:"CPU使用率",
                left:"center",
                bottom:"0%",
                textStyle:{
                    //文字颜色
                    color:'#6d747e',
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
                    center: ['50%', '45%'],
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
        pieChart.setOption(pieChartOption);
    },
    /**
     *初始化图表
     */
    initDom: function(SpeedNum){
        var containers =  document.getElementById('CpuOperation');
        var myChart = echarts.init(containers);
        var option = {
            series: [{
                type: 'liquidFill',
                radius: '80%',
                center: ['50%', '46%'],
                data: [SpeedNum/100],
                color: ['#c4e8f4'],
                outline: {
                    borderDistance: 0,
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#156ACF',
                        shadowBlur: 0,
                        shadowColor: 'rgba(255, 0, 0, 1)'
                    }
                },
                label: {
                    normal: {
                        // formatter: 'CPU运行监控: {c}',
                        textStyle: {
                            color: '#132637', //波浪上文本颜色
                            insideColor: '#132637', //波浪内部字体颜色
                            fontSize: 36
                        },
                        position: ['50%', '50%'],
                    }
                }
            }]
        }
        myChart.setOption(option);
    },
    /**
     *内存使用率
     */
    UtilizationRate:function(SpeedNum){
        var Other =document.getElementById('UtilizationRateOther');
        var OtherChart = echarts.init(Other);
        var  SpeedNum = SpeedNum;
        var labelTop = {//上层样式
            // x, y, x2, y2：向量坐标，即渐变开始的起点坐标 (x, y)，与结束坐标 (x2, y2) 需要注意的是值的范围在 0 ～ 1 之间
            normal : {
                color: '#4b90ff',
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
                    fontSize:30,
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
        var radius = [60,80];// 半径[内半径，外半径]

        var pieChartOption = {
            animation:false,
            title:{
                text:"内存使用率",
                left:"center",
                bottom:"0%",
                textStyle:{
                    //文字颜色
                    color:'#6d747e',
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
                    center: ['50%', '45%'],
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
        OtherChart.setOption(pieChartOption);
    },
    /**
     *内存水波
     */
    MemoryWave:function(SpeedNum){
        var conInner =  document.getElementById('UtilizationRateInner');
        var myChartInner = echarts.init(conInner);
        var option = {
            series: [{
                type: 'liquidFill',
                radius: '80%',
                center: ['50%', '46%'],
                data: [SpeedNum/100],
                color: ['#c4e8f4'],
                outline: {
                    borderDistance: 0,
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: '#156ACF',
                        shadowBlur: 0,
                        shadowColor: 'rgba(255, 0, 0, 1)'
                    }
                },
                label: {
                    normal: {
                        // formatter: 'CPU运行监控: {c}',
                        textStyle: {
                            color: '#132637', //波浪上文本颜色
                            insideColor: '#132637', //波浪内部字体颜色
                            fontSize: 36
                        },
                        position: ['50%', '50%'],
                    }
                }
            }]
        }
        myChartInner.setOption(option);
    },
    /**
     *初始化图表 内存监控
     */
    initEvent: function(SpeedNum){
        var Other =  document.getElementById('OperaIcontion');
        var OtherChart = echarts.init(Other);
        var  SpeedNum = SpeedNum;
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
                    fontSize:30,
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
        var radius = [60,80];// 半径[内半径，外半径]

        var pieChartOption = {
            animation:false,
            title:{
                text:"磁盘使用量",
                left:"center",
                bottom:"10%",
                textStyle:{
                    //文字颜色
                    color:'#6d747e',
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
                        {name:'60GB', value:100-SpeedNum, itemStyle : labelBottom}
                    ],
                }
            ]
        };
        OtherChart.setOption(pieChartOption);
    },
    /**
     *磁盘使用率
     */
    OperaIcontionrate:function(SpeedNum){
        var OtherRate =  document.getElementById('OperaIcontionrate');
        var OtherChartRate = echarts.init(OtherRate);
        var  SpeedNum = SpeedNum;
        var labelTop = {//上层样式
            // x, y, x2, y2：向量坐标，即渐变开始的起点坐标 (x, y)，与结束坐标 (x2, y2) 需要注意的是值的范围在 0 ～ 1 之间
            normal : {
                color: '#4b90ff',
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
                    fontSize:30,
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
        var radius =  [60,80];// 半径[内半径，外半径]

        var pieChartOption = {
            animation:false,
            title:{
                text:"磁盘使用率",
                left:"center",
                bottom:"10%",
                textStyle:{
                    //文字颜色
                    color:'#6d747e',
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
                        {name:'60%', value:100-SpeedNum, itemStyle : labelBottom}
                    ],
                }
            ]
        };
        OtherChartRate.setOption(pieChartOption);
    },
    /**
     *读写速率
     */
    ReadSpeed:function(){
            var rateNum = parseInt(1 + (70 - 10) * (Math.random()))
        // const { rtt, downlink, effectiveType, saveData } = navigator.connection;
        // console.log(`有效网络连接类型: ${effectiveType}`);
        // console.log(`估算的下行速度/带宽: ${downlink}Mb/s`);
        // console.log(`估算的往返时间: ${rtt}ms`);
        // console.log(`打开/请求数据保护模式: ${saveData}`);
            $("#OperaMumberBottom").html(`
                ${rateNum}<span>Mb/S</span>
            `)
    },
    /**
     * 30天内日总量 折线图
     */
    CpuOperationCategory:function () {
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/Daily/total",
            async: false,
            success: function(res){
                var PointTime = [];
                var dataValue = []
                res.forEach((item,index,arr)=>{
                    PointTime.push(item.PointTime)
                    dataValue.push(item.dataValue)
                })
                var containers =  document.getElementById('CpuOperationCategory');
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
                    title: {
                        left:'center',
                        text: '30天内日总量',
                        textStyle:{
                            fontSize:14
                            ,fontWeight:'normal'
                            ,color:'#2c82fe'
                        },
                        top:"12",
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: PointTime
                    },
                    grid: {
                        left: '10%',
                    },
                    yAxis: {
                        name:"(条)",
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
                        data:dataValue,
                    }],
                };
                myChart.setOption(option);
            }
        })
    },
    /**
     *12月总量统计
     */
    MonthlyStatistics: function(){
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/Memory/monitoring",
            async: false,
            success: function(res){
                var monitorName = [];
                var monitorNumber = []
                res.forEach((item,index,arr)=>{
                    monitorName.push(item.Month)
                    monitorNumber.push(item.monitorNumber)
                })
                var containers =  document.getElementById('MonthlyStatistics');
                var myChart = echarts.init(containers);
                var dataAxis = monitorName;
                var data = monitorNumber;
                var yMax = 500;
                var dataShadow = [];
                for (var i = 0; i < data.length; i++) {
                    dataShadow.push(yMax);
                }
                var optionBar = {
                    title: {
                        left:'center',
                        text: '12月内月总量统计',
                        textStyle:{
                            fontSize:14
                            ,fontWeight:'normal'
                            ,color:'#2c82fe'
                        },
                        top:"12",
                    },
                    color: ['#32A8FF'],
                    tooltip : {
                        trigger: 'axis',
                        formatter:function(params) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value+"GB";
                            }
                            return relVal;
                        },
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '10%',
                    },
                    yAxis : [
                        {
                            name:"(GB)",
                            type : 'value',
                            axisLabel:{formatter:'{value}'},
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    xAxis : [
                        {
                            data : dataAxis,
                            type : 'category'
                        }
                    ],
                    series : [
                        {
                            barWidth : 30,//柱图宽度
                            name:'总量统计',
                            type:'bar',
                            itemStyle:{
                                normal:{
                                    color: function() {
                                        var colorList = [
                                            '#0263ff','#ff7723','#8e30ff'
                                        ];
                                        return colorList[Math.floor(Math.random()*3)]
                                    },
                                }
                            },
                            data:data
                        }
                    ]
                };
                myChart.setOption(optionBar);
            }
        })
    },
    /**
     *获取磁盘监控
     */
    // initLeiDa:function(){
    //     $.ajax({
    //         type: "post",
    //         dataType: "json",
    //         url: wwwroot + "/disk/Monitor",
    //         async: false,
    //         success: function(res){
    //             var DiskMonitoring = []
    //             res.forEach((item,index,arr)=>{
    //                 DiskMonitoring.push(item.name)
    //             })
    //             var containers =  document.getElementById('CpuOperationTwo');
    //             var myChart = echarts.init(containers);
    //             var option = {
    //                 tooltip : {
    //                     trigger: 'item',
    //                     formatter: "{a} <br/>{b} : {c} ({d}%)"
    //                 },
    //                 legend: {
    //                     bottom: 10,
    //                     left: 'center',
    //                     data:DiskMonitoring
    //                 },
    //                 series : [
    //                     {
    //                         type: 'pie',
    //                         radius : '65%',
    //                         center: ['50%', '50%'],
    //                         selectedMode: 'single',
    //                         data:res,
    //                         itemStyle: {
    //                             emphasis: {
    //                                 shadowBlur: 10,
    //                                 shadowOffsetX: 0,
    //                                 shadowColor: 'rgba(0, 0, 0, 0.5)'
    //                             }
    //                         }
    //                     }
    //                 ]
    //             };
    //             myChart.setOption(option);
    //         }
    //     })
    // },
};

$(function(){
    CpuOperation.initCpuOperation();
})