/**
 * ftpDaq
 *
 */
Mock.mock(wwwroot+'/dataGovernance/ftpDaq',function(options) {
    var result = {
        total: 80,
        rows:[]
    };
    var offsetNum = getPostParam(options).offset;
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "strategyName":"策略"+(offsetNum+i),
            "colMethods":/定时|即时/,
            "timeRules": "0 0 0/5 * * *",
            "taskStatus":/0|1|2/,
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime()
        }));
    };
    return result;
});

//根据ID获取数据源信息
Mock.mock(RegExp(wwwroot + '/dataGovernance/dataSource'+ ".*"),"get",function() {
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

/**
 *获取table 表头
 */
Mock.mock(RegExp(wwwroot + '/Obtain/ObtainHeader'+ ".*"),"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        columns:Mock.mock([
            {
                field: 'dicNameData',
                title: '名称',
                width: 200
            }, {
                field: 'dicCodeData',
                title: '类型',
                width: 120
            },{
                field: 'dicDescData',
                title: '状态',
                width: 120
            },{
                field:"createTimeData",
                title:"描述",
                width: 800
            },{
                field:"modifyTimeData",
                title:"创建时间",
                width: 350
            },{
                field:"modifyTimeData",
                title:"修改时间",
                width: 350
            }
        ])
    };
});
/**
 *获取表数据
 */
Mock.mock(wwwroot + '/cleanRule/TableData',function() {
    var resultData = {
        total: 40,
        rows:[]
    };
    for(var i = 0 ; i < 40 ; i++){
        resultData.rows.push(Mock.mock({
            "idData":/[a-z][A-Z][0-9]/,
            "dicNameData": /去空格|加前缀|加后缀/,
            "modifyTimeData": Mock.Random.datetime(),
            "dicDescData": Mock.Random.datetime(),
            "createTimeData":"特产流众军听变志领对通习发工。",
            "dicCodeData": /shell|jar/,
            "dicDescData": /1|0/
        }));
    };
    return resultData;
});