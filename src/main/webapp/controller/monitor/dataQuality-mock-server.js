/**
 *数据总量监控
 */
Mock.mock(wwwroot + '/TotalData/Monitoring',function() {
    var result = [{"TotalDataName":"3","AcquisitionName":"158","InterfaceName":"256","ModelName":"120"}]
    return result;
});
/**
 *数据量变更监控
 */
Mock.mock(wwwroot + '/DataVolume/ChangeMonitoring',function() {
    var result = [{"TargetsStatisticsName":"324","SituationStatisticsName":"254","ModelQuantityName":"125","DailyStatisticsName":"85"}]
    return result;
});
/**
 *数据质量（总体）监控
 */
Mock.mock(wwwroot + '/Overall/Monitoring',function() {
    var result = [{"ConformityConstraintsName":"420","NotConformityName":"354"}]
    return result;
});

/**
 *  不符合模型表规则约束占比
 */
Mock.mock(wwwroot + '/cleanRule/CPUList',function() {
    var result = {
        SpeedNum:Math.floor(Math.random() * (100 - 10)) + 10
    };
    return result;
});
/**
 *获取前100天时间
 */
Mock.mock(RegExp(wwwroot + '/TimeSet/time/'+ ".*"),"get",function(day) {
    var strTime = parseInt(day.url.match(/lime=(\S*)/)[1]);
    var time = new Date();
    time.setDate(time.getDate() + strTime);//获取Day天后的日期
    var y = time.getFullYear();
    var m = time.getMonth() + 1;//获取当前月份的日期
    var d = time.getDate();
    var GetTime  = y + "-" + m + "-" + d;
    var time2 = new Date();
    time2.setTime(time2.getTime());
    var todety = time2.getFullYear()+"-" + (time2.getMonth()+1) + "-" + time2.getDate();
    var timeConr =  getDiffDate(GetTime,todety)
    return timeConr;
});
function getDiffDate(start, end) {
    var startTime = getDate(start);
    var endTime = getDate(end);
    var dateArr = [];
    while ((endTime.getTime() - startTime.getTime()) > 0) {
        var year = startTime.getFullYear();
        var monthNum = startTime.getMonth()+1;
        var month = monthNum.toString().length == 1 ? "0" + (parseInt(monthNum,10)) : (monthNum);
        var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
        dateArr.push({"PointTime":year + "-" + month + "-" + day,"dataValue":parseInt(100 + (9000 - 10) * (Math.random())),"Proportion":parseInt(1 + (100 - 10) * (Math.random()))});
        startTime.setDate(startTime.getDate() + 1);
    }
    return dateArr;
}
function getDate (datestr) {
    var temp = datestr.split("-");
    if (temp[1] === '01') {
        temp[0] = parseInt(temp[0],10) - 1;
        temp[1] = '12';
    } else {
        temp[1] = parseInt(temp[1],10) - 1;
    }
    //new Date()的月份入参实际都是当前值-1
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
}