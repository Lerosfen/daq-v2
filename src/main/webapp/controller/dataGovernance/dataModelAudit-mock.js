/**
 * dataModelAudit 获取
 *分页数据
 */
Mock.mock(wwwroot+'/dataGovernance/dataModelAudit',function() {
    var result = {
        total: 80,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "applyTitle": "XXX申请",
            "desc": "@cparagraph(1)",
            "status": /0|1|2/,
            "applyDepartment": /民政部|XX学校|XX局/,
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime()
        }));
    };
    return result;
});
Mock.mock(wwwroot + '/base/api/dictionary/model_audit_status',"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:[{
            dicName:"待审核",
            dicCode:"0"
        },{
            dicName:"通过",
            dicCode:"1"
        },{
            dicName:"不通过",
            dicCode:"2"
        }]
    };
});

/**
 *关系图
 */
Mock.mock(RegExp(wwwroot + '/ForceDiagram/data/'+ ".*"),"get",function(TableName) {
    var TableName = TableName.url.match(/TableName=(\S*)/)[1];
    return {
        "nodes":[
            { "name": `${TableName}`, "image" : "/resources/img/Forced/1.png","Primary":"0"},
            { "name": "子模型A11", "image" : "/resources/img/Forced/1.png","Primary":"1" },
            { "name": "子模型A1", "image" : "/resources/img/Forced/2.png","Primary":"2" },
            { "name": "子模型A12", "image" : "/resources/img/Forced/1.png","Primary":"3" },
            { "name": "子模型A2", "image" : "/resources/img/Forced/2.png","Primary":"4" },
        ],
        "edges":[
            { "source": 0 , "target": 1 , "relation":"关联" },
            { "source": 0 , "target": 2 , "relation":"关联" },
            { "source": 1 , "target": 3 , "relation":"关联" },
            { "source": 1 , "target": 4 , "relation":"关联" }
        ]
    }
})
/**
 *获取表数据
 */
Mock.mock(RegExp(wwwroot + '/ForceDiagram/gitTable/'+ ".*"),"get",function(TableName) {
    var TableName = TableName.url.match(/TableName=(\S*)/)[1];
    if(TableName =="A实体模型" || TableName =="子模型A11" || TableName =="子模型A12" ||TableName =="B实体模型" ){
        return [{
            "Fieldname":`name${TableName}`,
            "describe":"姓名"
        },{
            "Fieldname":`id_card${TableName}`,
            "describe":"身份证号"
        }]
    }else{
        return []
    }

})