/**
 * entityModel 获取
 *分页数据
 */
Mock.mock(wwwroot+'/dataGovernance/entityModel',function(options) {
    var result = {
        total: 80,
        rows:[]
    };
    var offsetNum = getPostParam(options).offset;
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "modelName": "模型" + (offsetNum+i),
            "modelCode": /[a-z]{2,4}_[A-Z]{3,5}/,
            "themeType": /人口|医疗|环保/,
            "status": /0|1/,
            "pcTime": Mock.Random.datetime(),
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime()
        }));
    };
    return result;
});
Mock.mock(wwwroot + '/base/api/dictionary/pc_status',"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:[{
            dicName:"待物化",
            dicCode:"0"
        },{
            dicName:"已物化",
            dicCode:"1"
        }]
    };
});
Mock.mock(wwwroot + '/base/api/dictionary/theme_status',"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:[{
            dicName:"人口",
            dicCode:"1"
        },{
            dicName:"法人",
            dicCode:"2"
        },{
            dicName:"宏观经济",
            dicCode:"3"
        },{
            dicName:"证照",
            dicCode:"4"
        },{
            dicName:"教育",
            dicCode:"5"
        },{
            dicName:"医疗",
            dicCode:"6"
        }]
    };
});

Mock.mock(wwwroot+'/dataGovernance/selMedaData',function() {
    var result = {
        total: 80,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "dataName": /元数据[a-z]/,
            "dataDesc": "@string(5)",
            "dataType": /string|boolean|number|float/
        }));
    };
    return result;
});

//根据ID获取实体模型信息
Mock.mock(RegExp(wwwroot + '/dataGovernance/entityModel'+ ".*"),"get",function() {
    var result =  {
        code:"code_200",
        msg:"查询成功！",
        data:Mock.mock({
            "id":"12345",
            "modelName": "模型XXX",
            "modelCode": /[a-z]{2,4}_[A-Z]{3,5}/,
            "cols":[]
        })
    };
    for(var i = 0; i < 5; i++){
        result.data.cols.push(Mock.mock({
            "id": i+1,
            "dataName": /元数据[a-z]/,
            "dataDesc": "@string(5)",
            "dataType": /string|boolean|number|float/
        }));
    }
    return result;
});

// 根据ID获取表中的元数据
Mock.mock(RegExp(wwwroot + '/dataGovernance/metaDataFromTbl'+ ".*"),"get",function() {
    var result =  {
        code:"code_200",
        msg:"查询成功！",
        data: []
    };
    for(var i = 0; i < 20; i++){
        result.data.push(Mock.mock({
            "id": i+1,
            "fieldName": /元数据[a-z]/,
            "fieldDesc": "@string(5)",
            "dataType": /string|boolean|number|float/
        }));
    }
    return result;
});

