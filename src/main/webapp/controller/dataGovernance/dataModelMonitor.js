/**
 * 数据质量检测
 */
$package("dataModelMonitor");
dataModelMonitor = {
    // 初始化方法
    initdataMonitor: function(){
        this.obj = {
            // addBtn: $('#addBtn'),
        };
        this.data = {
            // statusDic: []
        }
        this.CircularStatistics();
        this.rankingEchants();
    },
    //检测结果
    CircularStatistics:function(){
        //圆形统计图
        $("#ResultRight").css('width',$(".ResultRight").width());//获取父容器的宽度具体数值直接赋值给图表
        var ResultRight =document.getElementById('ResultRight');
        var pieChart = echarts.init(ResultRight);
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'center',
                y:"80%",
                data:['通过审批','未通过审批']
            },
            color: ['#32A8FF','#4fda9d'],
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    center: ['50%', '40%'],
                    radius: ['50%', '70%'],
                    // avoidLabelOverlap: false,
                    label: {normal: {show: true,position: 'center'}},
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:335, name:'通过审批'},
                        {value:310, name:'未通过审批'}
                    ]
                }
            ]
        };
        pieChart.setOption(option);
    },
    rankingEchants:function(){
        //圆形统计图
        // $("#rankingEchants").css('width',$(".rankingEchants").width());//获取父容器的宽度具体数值直接赋值给图表
        var ranking =document.getElementById('rankingEchants');
        var dataMouth = ['A部门','B部门','C部门','D部门','E部门','F部门','G部门','H部门','AT部门','AF部门','AG部门','AB部门'];//x轴
        //显示数据，可修改
        var data1 = [22, 24, 38, 43, 59, 25, 49, 34, 44, 34, 22, 46];
        var data2 = [35, 46, 43, 59, 60, 45, 53, 42, 56, 45, 36, 59];
        var pieranking = echarts.init(ranking);
        var option = {
            // title : {
            //
            //     text: '温度计式图表',
            //
            //     subtext: 'From ExcelHome',
            //
            //     sublink: 'http://e.weibo.com/1341556070/AizJXrAEa'
            //
            // },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params){
                    return params[0].name + '<br/>'
                        + params[0].seriesName + ' : ' + params[0].value + '<br/>'
                        + params[1].seriesName + ' : ' + (params[1].value + params[0].value);
                }
            },
            legend: {
                selectedMode:false,
                x:"right",
                y:"top",
                data:['已物化', '待物化']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: false},
                    dataView : {show: false, readOnly: false},
                    restore : {show: false},
                    saveAsImage : {show: false}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : dataMouth
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    boundaryGap: [0, 0.1]
                }
            ],
            series : [
                {
                    name:'已物化',
                    type:'bar',
                    stack: 'sum',
                    barCategoryGap: '50%',
                    itemStyle: {
                        normal: {
                            color: '#32A8FF',
                            barBorderColor: '#32A8FF',
                            barBorderWidth: 6,
                            barBorderRadius:0,
                            label : {
                                show: true, position: 'insideTop'
                            }
                        }
                    },
                    data:data2
                },
                {
                    name:'待物化',
                    type:'bar',
                    stack: 'sum',
                    itemStyle: {
                        normal: {
                            color: '#4fda9d',
                            barBorderColor: '#32A8FF',
                            barBorderWidth: 6,
                            barBorderRadius:0,
                            label : {
                                show: true,
                                position: 'top',
                                formatter: function (params) {
                                    for (var i = 0, l = option.xAxis[0].data.length; i < l; i++) {
                                        if (option.xAxis[0].data[i] == params.name) {
                                            return option.series[0].data[i] + params.value;
                                        }
                                    }
                                },
                                textStyle: {
                                    color: '#32A8FF'
                                }
                            }
                        }
                    },
                    data:data1
                }
            ]
        };
        pieranking.setOption(option);
    },
};
$(function(){
    dataModelMonitor.initdataMonitor();
})

