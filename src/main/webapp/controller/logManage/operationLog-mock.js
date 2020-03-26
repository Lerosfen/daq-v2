/**
 * operationLog
 *分页数据
 */
Mock.mock(wwwroot + '/logManage/operationLog',function(options) {
    var result = {
        total: 666,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "operateUser": '@cname',
            'operateContent': '@cparagraph(1)',
            "operateTime": Mock.Random.datetime(),
            "operateResult": /成功|失败/,
            'operateDesc': '@cparagraph(2)',
        }));
    };
    return result;
});
//根据ID查询信息
/*
Mock.mock(RegExp(wwwroot + '/logManage/systemJoins'+ ".*"),"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "sysName": "测试系统X",
            "desc": '@cparagraph',
            "SFTP": '@ip',
            "uname": '@cname',
            "upwd": '******',
            "saveDay": 90,
            "loginSvDay": 90,
            "operateSvDay": 90,
            "unusualSvDay": 90,
            "debuggerSvDay": 90
        })
    };
});
*/


//获取数据源状态字典信息
/*
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
*/