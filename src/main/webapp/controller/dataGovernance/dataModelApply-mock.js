/**
 * dataModelApply 获取
 *分页数据
 */
Mock.mock(wwwroot+'/dataGovernance/dataModelApply',function() {
    var result = {
        total: 80,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "applyTitle": "XXX申请",
            "desc": "@cparagraph(1)",
            "status": /0|1|2|3|4/,
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime()
        }));
    };
    return result;
});
Mock.mock(wwwroot + '/base/api/dictionary/model_apply_status',"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:[{
            dicName:"编辑",
            dicCode:"0"
        },{
            dicName:"待审核",
            dicCode:"1"
        },{
            dicName:"通过",
            dicCode:"2"
        },{
            dicName:"不通过",
            dicCode:"3"
        },{
            dicName:"已撤销",
            dicCode:"4"
        }]
    };
});

Mock.mock(wwwroot + '/dataGovernance/modelField',"get",function() {
    var result =  {
        code:"code_200",
        msg:"查询成功！",
        data:[]
    };
    for(var i = 0; i < 20; i++){
        result.data.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "fieldName": /name|age|id_card|address|salary|birthday/,
            "fieldDesc": "@string(5)",
        }));
    };
    return result;
});

/**
 *关系图
 */
Mock.mock(wwwroot + '/dataGovernance/addApplyRelation', "get", function() {
    return {
        "nodes":[
            { "name": "table_user", "image" : "/resources/img/Forced/1.png","Primary":"0"},
            { "name": "name", "image" : "/resources/img/Forced/2.png","Primary":"1" },
            { "name": "IDCard", "image" : "/resources/img/Forced/3.png","Primary":"2" },
            { "name": "age", "image" : "/resources/img/Forced/4.png","Primary":"3" },
            { "name": "address", "image" : "/resources/img/Forced/2.png","Primary":"4" }
        ],
        "edges":[
            { "source": 1 , "target": 0 , "relation":"关联" },
            { "source": 2 , "target": 0 , "relation":"关联" },
            { "source": 3 , "target": 2 , "relation":"关联" },
            { "source": 4 , "target": 2 , "relation":"关联" },
        ]
    }
});

//根据ID获取数据模型申请信息
Mock.mock(RegExp(wwwroot + '/dataGovernance/modelApply'+ ".*"),"get",function() {
    var result =  {
        code:"code_200",
        msg:"查询成功！",
        data:Mock.mock({
            "id":"12345",
            "applyTitle": "XXX申请",
            "dataTheme":  "1",
            "department": "部门1",
            "mainModel": "1",
            "desc": "@cparagraph(5)",
            "cols":[]
        })
    };
    for(var i = 0; i < 5; i++){
        result.data.cols.push(Mock.mock({
            "id": i+1,
            "fieldName": /字段[0-9]{1}/,
            "fieldDesc": "@string(6)",
        }));
    }
    return result;
});

/**
 *  查看调用示例
 */
Mock.mock(wwwroot+'/dataGovernance/dataModelApplyViewEx',function() {
    var result = {
        total: 80,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "callTime": Mock.Random.datetime(),
            "callIP": Mock.Random.ip(),
            "callPort": /接口XXX/,
            "callData": /[0-9]{1,3}/
        }));
    };
    return result;
});




