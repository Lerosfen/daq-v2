/**
 * exceptionLog 获取
 *分页数据
 */
Mock.mock(wwwroot + '/logManage/exceptionLog',function() {
    var result = {
        total: 100,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "operateTime": Mock.Random.datetime(),
            "operateUser": '@cname',
            'exceptionDesc': '@cparagraph(7)',
        }));
    };
    return result;
})