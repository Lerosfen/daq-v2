/**
 *  wsDataDaq
 *
 */
Mock.mock(wwwroot+'/dataGovernance/wsDataDaq',function(options) {
    var result = {
        total: 80,
        rows:[]
    };
    var offsetNum = getPostParam(options).offset;
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "wsName":"接口"+(offsetNum+i),
            "wsCode": /i-000[0-9]{1,3}/,
            "wsStatus": /0|1|2/,
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime()
        }));
    };
    return result;
});

//根据ID获取数据源信息
/*
Mock.mock(RegExp(wwwroot + '/dataGovernance/wsDataDaq'+ ".*"),"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:Mock.mock({
            "id":"12345",
            "dataSourceName":"测试数据源",
            "systemName":"北斗导航系统",
            "dataBaseType":/mysql|oracle|sqlserver|mariadb/,
            "tableSpaceName":"bbdb",
            "dataBaseName":"bbdb",
            "dataBaseIP":Mock.Random.ip(),
            "dataBasePort":10000,
            "userName":10000,
            "dataSourceDesc":"测试数据源，用于进行系统测试，该数据源无数据表",
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime()
        })
    };
});
*/

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
//获取数据库类型字典信息
Mock.mock(wwwroot + '/base/api/dictionary/db_types',"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:[{
            dicName:"MySQL",
            dicCode:"mysql"
        },{
            dicName:"Oracle",
            dicCode:"oracle"
        },{
            dicName:"SQL Server",
            dicCode:"sqlserver"
        },{
            dicName:"MariaDB",
            dicCode:"mariadb"
        }]
    };
});

Mock.mock(wwwroot+'/dataGovernance/metaData',"get",function() {
    var result = {
        code:"code_200",
        msg:"查询成功！",
        data:[]
    };
    for(var i = 0; i < 20; i++){
        result.data.push(Mock.mock({
            "metaDataField": /name|age|address|id_card/,
            "metaDataDesc": "@string(5)"
        }))
    }
    return result;
});
// 根据ID获取接口管理
Mock.mock(RegExp(wwwroot+'/dataGovernance/wsDataDaq'+ ".*"), "get", function(){
    var result = {
        code: "code_200",
        msg: "查询成功",
        data: Mock.mock({
            "id": "123",
            "wsName": "接口XXX",
            "wsCode": /i-000[0-9]{1,3}/,
            "provideDepartment": "1",
            "belongTo": "1",
            "metaData": "1",
            "cols": []
        })
    };
    for(var i = 0; i < 6; i++){
        result.data.cols.push(Mock.mock({
            "metaDataField": /name|age|address|id_card/,
            "metaDataDesc": "@string(5)",
            "mapData": "@string(5)"
        }))
    };
    return result;
})