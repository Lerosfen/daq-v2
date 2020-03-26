/**
 * daqHistoryLog 获取
 *分页数据
 */
Mock.mock(wwwroot + '/dataGoverance/FTPRealTimeLog',function(options) {
    var result = {
        total: 100,
        rows:[]
    };
    var offsetNum = getPostParam(options).offset;
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "taskName": '任务' + (offsetNum+i),
            "startTime": Mock.Random.datetime(),
            "endTime": Mock.Random.datetime(),
            "expendTime": /[0-9]{1,3}/,
            "progressStatus": /[0-9]{1,2}/,
            "runResult": /0|1/,
            "daqfileCount": /[0-9]{3,5}/
        }));
    };
    return result;
});
Mock.mock(wwwroot + '/dataGoverance/FTPHistoryLog',function(options) {
    var result = {
        total: 100,
        rows:[]
    };
    var offsetNum = getPostParam(options).offset;
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "taskName": '任务' + (offsetNum+i),
            "startTime": Mock.Random.datetime(),
            "endTime": Mock.Random.datetime(),
            "expendTime": /[0-9]{1,3}/,
            "runResult": /0|1/,
            "daqfileCount": /[0-9]{3,5}/
        }));
    };
    return result;
});
Mock.mock(wwwroot + '/dataGoverance/stRealTimeLog',function(options) {
    var result = {
        total: 100,
        rows:[]
    };
    var offsetNum = getPostParam(options).offset;
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "taskName": '任务' + (offsetNum+i),
            "startTime": Mock.Random.datetime(),
            "endTime": Mock.Random.datetime(),
            "expendTime": /[0-9]{1,3}/,
            "progressStatus": /[0-9]{1,2}/,
            "runResult": /0|1/,
            "daqfileCount": /[0-9]{3,5}/
        }));
    };
    return result;
});
Mock.mock(wwwroot + '/dataGoverance/stHistoryLog',function(options) {
    var result = {
        total: 100,
        rows:[]
    };
    var offsetNum = getPostParam(options).offset;
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "taskName": '任务' + (offsetNum+i),
            "startTime": Mock.Random.datetime(),
            "endTime": Mock.Random.datetime(),
            "expendTime": /[0-9]{1,3}/,
            "runResult": /0|1/,
            "daqfileCount": /[0-9]{3,5}/
        }));
    };
    return result;
});