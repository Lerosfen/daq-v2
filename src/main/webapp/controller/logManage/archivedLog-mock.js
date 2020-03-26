/**
 * archivedLog获取
 *分页数据
 */
Mock.mock(wwwroot + '/logManage/archivedLog',function() {
    var result = {
        total: 100,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "fileName": Mock.Random.datetime().slice(0,10).replace(/-/g, '_') + '.zip',
            "archivedTime": Mock.Random.datetime()
        }));
    };
    return result;
})