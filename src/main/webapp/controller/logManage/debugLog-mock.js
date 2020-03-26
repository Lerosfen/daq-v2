/**
 * debugLog 获取
 *分页数据
 */
Mock.mock(wwwroot + '/logManage/debugLog',function() {
    var result = {
        total: 100,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "debugContent": '调试XXX功能',
            "operateUser": '@cname',
            "clientIP": '@ip',
            "operateTime": Mock.Random.datetime(),
            "debugDesc": '@cparagraph(2)',
        }));
    };
    return result;
})