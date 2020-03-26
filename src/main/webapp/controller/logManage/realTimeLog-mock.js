/**
 * realTimeLog获取
 *分页数据
 */
Mock.mock(wwwroot + '/logManage/realTimeLog',function() {
    var result = {
        total: 100,
        rows:[]
    };
    for(var i = 0 ; i < 1 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            'columns': '@cparagraph(12)'
        }));
    };
    return result;
})