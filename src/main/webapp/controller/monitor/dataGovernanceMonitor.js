$package("CpuOperation");

CpuOperation = {
    initCpuOperation: function(){
        this.data = {
            data: [],
        }
        this.fusionMonitoring();
        this.obtainThread()
        this.Refresh()
        this.acquisition();
        this.fuseData()
        this.taskMonitor();
        // this.aggregateSet()

    },
    /**
     *定时更新函数
     */
    Refresh:function(){
        var self = this;
        clearInterval(window.fusionMonitoring);
        window.fusionMonitoring = setInterval(function () {
            self.fusionMonitoring()
            self.acquisition()
            self.fuseData()
            // self.aggregateSet()
        },60000)
        clearInterval(window.ChangeMonitoring);
        window.ChangeMonitoring = setInterval(function () {
            self.taskMonitor();
        },5000)
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
                // $("#TotalAmount").html(`
                //  <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="70"
                //      aria-valuemin="0" aria-valuemax="100" style="width: ${(res.SpeedNum*10/3690)*100}%;">
                //     <p style="color: #333;position: absolute;right: 5px;top:0px;z-index: 111111;">${res.SpeedNum*10}(个)</p>
                // </div>
                // `)
                var taskNumber = (res.SpeedNum*10/3690)*100;
                var  taskCont =  res.SpeedNum*10
                self.TasksOperation(taskNumber,taskCont)
            }
        })
    },
    /**
     *总量
     */
    aggregateSet:function(){
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/cleanRule/CPUList",
            async: false,
            success: function(res){
                $("#totalCleaned").html(`
                 <div class="progress-bar progress-bar-info"  role="progressbar" aria-valuenow="70"
                         aria-valuemin="0" aria-valuemax="100" style="width: ${res.SpeedNum}%;">
                        <p style="color: #333;position: absolute;right: 5px;top:0px;z-index: 111111;">${res.SpeedNum*10}</p>
                    </div>
                `)
                $("#TotalFusion").html(`
                <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="70"
                     aria-valuemin="0" aria-valuemax="100" style="width: ${res.SpeedNum}%;">
                    <p style="color: #333;position: absolute;right: 5px;top:0px;z-index: 111111;">${res.SpeedNum*10}</p>
                </div>
                `)
            }
        })
    },
    /**
     *运行中任务量
     */
    TasksOperation:function(SpeedNum,taskCont){
        var TasksOther =document.getElementById('TasksOperation');
        var TasksOtherChart = echarts.init(TasksOther);
        var  SpeedNum = parseInt(SpeedNum);
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
        var radius = [75,95];// 半径[内半径，外半径]

        var pieChartOption = {
            animation:false,
            title:{
                text:"运行中任务量",
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
                        {name:`${SpeedNum*10}/${taskCont}(总)`, value:100-SpeedNum, itemStyle : labelBottom}
                    ],
                }
            ]
        };
        TasksOtherChart.setOption(pieChartOption);
    },
    /**
     *融合获取数据
     */
    fuseData:function(){
        var self = this;
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/disk/fuse",
            async: false,
            success: function(res) {
                var DiskMonitoring = []
                var fuseNum = [];
                var fuseAnd = 0;
                res.forEach((item, index, arr) => {
                    DiskMonitoring.push(item.name)
                    fuseNum.push(item.value)
                })
                for(var i = 0 ;i<fuseNum.length;i++){
                    fuseAnd +=fuseNum[i];
                }
                $("#FusionNumber").html(`
                ${fuseAnd}
                <span>条</span>
                `);
                // $("#TotalFusion").html(`
                // <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="70"
                //      aria-valuemin="0" aria-valuemax="100" style="width: ${(fuseAnd/369)*100}%;">
                //     <p style="color: #333;position: absolute;right: 5px;top:0px;z-index: 111111;">${fuseAnd}(条)</p>
                // </div>
                // `)
                self.ToBeMerged(DiskMonitoring,res)
            }
         })
    },
    /**
     *数据融合监控
     */
    ToBeMerged: function(DiskMonitoring,res){
                var containers =  document.getElementById('ToBeMerged');
                var myChart = echarts.init(containers);
                var option = {
                    color: ['#32A8FF'],
                    tooltip : {
                        trigger: 'axis',
                        formatter:function(params) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value+"条";
                            }
                            return relVal;
                        },
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '10%',
                        top: '3%',
                    },
                    yAxis : [
                        {
                            name:"(条)",
                            type : 'value',
                            axisLabel:{formatter:'{value}(条)'},
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    xAxis : [
                        {
                            data : DiskMonitoring,
                            type : 'category'
                        }
                    ],
                    series : [
                        {
                            barWidth : 30,//柱图宽度
                            name:'总条数',
                            type:'bar',
                            itemStyle:{
                                normal:{
                                    color: "#4fda9d"
                                }
                            },
                            data:res
                        }
                    ]
                };
                myChart.setOption(option);
    },
    /**
     *待处理数据量实时监控 获取数据
     */
    fusionMonitoring:function(){
        var self = this;
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
                self.CpuOperationCategory(PointTime,dataValue)
            }
        })
    },
    /**
     *待处理数据量实时监控
     */
    CpuOperationCategory:function (PointTime,dataValue) {
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
                text: '待处理数据量实时监控',
                textStyle:{
                    fontSize:14
                    ,fontWeight:'normal'
                    ,color:'#2c82fe'
                },
                top:"12",
            },
            xAxis: {
                name:"(时间)",
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
    },
    /**
     *获取 数据处理线程数据
     */
    obtainThread:function(){
        var self = this;
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/Thread/monitoring",
            async: false,
            success: function(res){
                // if(self.data.data.length !==720){
                    self.data.data.push(res);
                // }else{
                //     self.data.data.shift();
                // }
                self.ThreadMonitor()
            }
        })
    },
    /**
     *数据处理线程监控
     */
    ThreadMonitor:function () {
        var self = this;
        var containers =  document.getElementById('ThreadMonitor');
        var myChart = echarts.init(containers);
        var option = {
            title: {
                left:'center',
                text: '数据处理线程监控',
                textStyle:{
                    fontSize:14
                    ,fontWeight:'normal'
                    ,color:'#2c82fe'
                },
                top:"12",
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                }
            },
            xAxis: {
                name:"时间",
                type: 'time',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: function (value) {//在这里写你需要的时间格式
                        var t_date = new Date(value);
                        return [t_date.getHours() <10?'0'+t_date.getHours():t_date.getHours(),  t_date.getMinutes() <10?'0'+t_date.getMinutes():t_date.getMinutes(),t_date.getSeconds()<10?'0'+t_date.getSeconds():t_date.getSeconds()].join(':');
                    }
                }
            },
            yAxis: {
                name:"(个)",
                type: 'value',
                axisLabel:{formatter:'{value}'},
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                }
            },
            series: [{
                name: '数据',
                type: 'line',
                itemStyle: {
                    normal: {
                        borderColor: '#2aa7ff',
                        lineStyle: {  //线的颜色
                            color: '#9ed7ff'
                        },
                    },
                },
                showSymbol: false,
                hoverAnimation: false,
                data: self.data.data
            }]
        };
        clearInterval(window.ThreadMonitoring);
        window.ThreadMonitoring = setInterval(function () {
            $.ajax({
                type: "post",
                dataType: "json",
                url: wwwroot + "/Thread/monitoring",
                async: false,
                success: function(res){
                    if(self.data.data.length ==720){
                        self.data.data.shift();
                    }else{
                        self.data.data.push(res);
                    }
                    myChart.setOption({
                        series: [{
                            data: self.data.data
                        }]
                    });
                }
            })
        }, 5000);
        if (option && typeof option === "object") {
            myChart.setOption(option);
        }
    },
    /**
     *待清洗获取数据
     */
    acquisition:function(){
        var self = this;
        $.ajax({
            type: "post",
            dataType: "json",
            url: wwwroot + "/disk/Monitor",
            async: false,
            success: function(res){
                var DiskMonitoring = []
                var acquisiNum = [];
                var acquisiAnd = 0;
                res.forEach((item,index,arr)=>{
                    DiskMonitoring.push(item.name)
                    acquisiNum.push(item.value)
                })
                for(var i = 0 ;i<acquisiNum.length;i++){
                    acquisiAnd +=acquisiNum[i];
                }
                self.initPieChart(DiskMonitoring,res)
                $("#totalNumber").html(`
                ${acquisiAnd}
                <span>条</span>
                `);
            }
    })
    },
    /**
     *待清洗数据监控
     */
    initPieChart:function(DiskMonitoring,res){
            var containers =  document.getElementById('Tobecleaned');
            var myChart = echarts.init(containers);
            var option = {
                color: ['#32A8FF'],
                tooltip : {
                    trigger: 'axis',
                    formatter:function(params) {
                        var relVal = params[0].name;
                        for (var i = 0, l = params.length; i < l; i++) {
                            relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value+"条";
                        }
                        return relVal;
                    },
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    top: '3%',
                },
                yAxis : [
                    {
                        name:"(条)",
                        type : 'value',
                        axisLabel:{formatter:'{value}(条)'},
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                xAxis : [
                    {
                        data : DiskMonitoring,
                        type : 'category'
                    }
                ],
                series : [
                    {
                        barWidth : 30,//柱图宽度
                        name:'总条数',
                        type:'bar',
                        itemStyle:{
                            normal:{
                                color: "#0263ff"
                            }
                        },
                        data:res
                    }
                ]
            };
            myChart.setOption(option);
    }
};

$(function(){
    CpuOperation.initCpuOperation();
})