/**
 * entityModelRelation 获取
 *分页数据
 */
Mock.mock(wwwroot+'/dataGovernance/modelRelation',function() {
    var result = {
        total: 80,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "mainTable": /[a-z]_[A-Z]{5,8}/,
            "assistTable": /[a-z]_[A-Z]{5,8}/,
            "status": /-1|0|1|2/,
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime()
        }));
    };
    return result;
});

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

/**
 *关系图
 */
Mock.mock(RegExp(wwwroot + '/dataGovernance/modelRelationMap'),"get",function() {
    return {
        "nodes":[
            { "name": "主实体模型", "image" : "/resources/img/Forced/1.png","Primary":"0"},
            { "name": "辅实体模型", "image" : "/resources/img/Forced/2.png","Primary":"1" },
        ],
        "edges":[
            { "source": 0 , "target": 1 , "relation":"关联" },
        ]
    }
})
// 根据id查看实体模型关系
Mock.mock(RegExp(wwwroot + '/dataGovernance/modelRelation'+ ".*"),"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:Mock.mock({
            "id":"12345",
            "mainModelTheme": "1",
            "mainModelName": "1",
            "mainModelField": "1",
            "supportModelField": "1",
            "supportModelTheme": "1",
            "supportModelName": "1"
        })
    };
});