/**
 *
 *  ftpDataSource
 */
Mock.mock(wwwroot+'/dataGovernance/ftpDataSource',function() {
    var result = {
        total: 80,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "ftpDataSourceName":/身份证照片目录|结婚证目录|影像数据/,
            "IPAddress":Mock.Random.ip(),
            "dataBaseType":/mysql|oracle|sqlserver|mariadb/,
            "port":Mock.Random.int(80,3306),
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime()
        }));
    };
    return result;
});

//根据ID获取数据源信息
Mock.mock(RegExp(wwwroot + '/dataGovernance/ftpDataSource'+ ".*"),"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:Mock.mock({
            "id":"12345",
            "ftpDataSourceName":/身份证照片目录|结婚证目录|影像数据/,
            "IPAddress":Mock.Random.ip(),
            "port":Mock.Random.int(80,3306),
            "path": "@string()",
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime(),
            "userName": "Admin",
            "passWord": "@string()"
        })
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