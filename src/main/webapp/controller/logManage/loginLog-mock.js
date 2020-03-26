/**
 * loginLog 获取
 *分页数据
 */
Mock.mock(wwwroot + '/logManage/loginLog',function() {
    var result = {
        total: 100,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "operateUser": '@cname',
            "systemName": /数据治理系统|基础管理系统|数据质量管理系统|数据可视化系统/,
            'operateContent': /登录|登出/,
            "operateTime": Mock.Random.datetime(),
            "operateResult": /成功|失败/,
            "clientIP": '@ip',
            'operateDesc': '@cparagraph(2)',
        }));
    };
    return result;
})