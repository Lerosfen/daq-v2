/**
 * dataQuality获取
 *分页数据
 */
Mock.mock(wwwroot + '/qc/dataQuality',function(options) {
    var result = {
        total: 100,
        rows:[]
    };
    var offsetNum = getPostParam(options).offset;
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "taskName":"测试任务"+(offsetNum+i),
            "runRules": '***?***',
            "checkTable": '检测表' +  (offsetNum+i),
            "taskStatus": /0|1|2/,
            "dataQuality": /0|1/,
            "endCheckTime": Mock.Random.datetime(),
            "createTime": Mock.Random.datetime(),
            "editTime": Mock.Random.datetime()
        }));
    };
    return result;
});
// 问题数据
Mock.mock(wwwroot + '/qc/problemData',function(options) {
    var result = {
        total: 100,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "column1": '@string(10)',
            "column2": '@string(10)',
            "column3": '@string(10)',
        }));
    };
    return result;
});
//根据ID查询信息
Mock.mock(RegExp(wwwroot + '/qc/dataQuality'+ ".*"),"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "taskName":"测试任务三",
            "runRules": '***?***',
            "judgeStyle": 2,
            "dataQuality": 90,
            "checkTableType": /1|2|3|4/
        })
    };
});


//获取数据源状态字典信息
Mock.mock(wwwroot + '/base/api/dictionary/db_source_status',"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:[{
            dicName:"编辑",
            dicCode:"0"
        },{
            dicName:"删除",
            dicCode:"-1"
        },{
            dicName:"启用",
            dicCode:"1"
        },{
            dicName:"禁用",
            dicCode:"2"
        }]
    };
});
/**
 *质量检测
 */
Mock.mock(wwwroot + '/Quality/inspection/report',function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:[{
            dicName:"nema",
            describe:"姓名",
            type:"string",
            length:"16",
            dataSource:"人口信息姓名",
            describe:"汉字最小两个字符"
        },{
            dicName:"id_card",
            describe:"身份证号",
            type:"string",
            length:"18",
            dataSource:"身份证号码",
            describe:"身份证号"
        }]
    };
});
/**
 *获取前20天时间
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