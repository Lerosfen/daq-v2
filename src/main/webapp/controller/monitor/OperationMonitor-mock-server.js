/**
 * CPU运行监控 数据获取
 *分页数据
 */
Mock.mock(wwwroot + '/cleanRule/CPUList',function() {
    var result = {
        SpeedNum:Math.floor(Math.random() * (100 - 10)) + 10
    };
    return result;
});
/**
 *12月总量统计
 */
Mock.mock(wwwroot + '/Memory/monitoring',function() {
    var resultMonitor =[{
            "Month":"1月",
            "monitorNumber":"220"
        },{
            "Month":"2月",
            "monitorNumber":"152"
        },{
            "Month":"3月",
            "monitorNumber":"150"
        },{
        "Month":"3月",
        "monitorNumber":"10"
        },{
            "Month":"4月",
            "monitorNumber":"105"
        },{
            "Month":"5月",
            "monitorNumber":"95"
        },{
            "Month":"6月",
            "monitorNumber":"86"
        },{
            "Month":"7月",
            "monitorNumber":"85"
        },{
            "Month":"8月",
            "monitorNumber":"105"
        },{
            "Month":"9月",
            "monitorNumber":"47"
        },{
            "Month":"10月",
            "monitorNumber":"74"
        },{
            "Month":"11月",
            "monitorNumber":"45"
        },{
            "Month":"12月",
            "monitorNumber":"52"
        }

    ]
    return resultMonitor;
});
/**
 *获取磁盘监控
 */
Mock.mock(wwwroot + '/disk/Monitor',function() {
    var resultdisk =[
        {value:535, name: '磁盘使用量'},
        {value:510, name: '使用率'},
        {value:634, name: '读写速率'},
        {value:735, name: '30天内日总量'},
        {value:735, name: '12月内月总量统计'}
    ]
    return resultdisk;
});
/**
 * 30天内日总量 折线图
 */
function addDate(dd,dadd){
    var a = new Date(dd)
    a = a.valueOf()
    a = a + dadd * 24 * 60 * 60 * 1000
    a = new Date(a)
    return a;
}
Mock.mock(wwwroot + '/Daily/total',function() {
    var now = new Date();
    var dataTitle = [];//保存获取到的日期
    for(i=0;i<30;i++){
        var random = parseInt(100 + (9000 - 10) * (Math.random()))
        var month = (now.getMonth()+1)
        dataTitle[i]=( {"PointTime":month+"-"+now.getDate(),"dataValue":random});
        now = addDate(month+"/"+now.getDate()+"/"+now.getFullYear(),-1);
    }
    return dataTitle;
});

