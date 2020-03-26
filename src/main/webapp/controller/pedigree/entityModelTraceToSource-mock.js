/**
 * entityModel 获取
 *分页数据
 */
Mock.mock(wwwroot + '/pedigree/entityModel',function() {
    var result = {
        total: 100,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            'columns1': '@cparagraph(1)',
            'columns2': '@cparagraph(1)',
            'columns3': '@cparagraph(1)',
            'columns4': '@cparagraph(1)',
            'columns5': '@cparagraph(1)'
        }));
    };
    return result;
})
/**
 *主题
 */
Mock.mock(wwwroot + '/DataTable/type', "get", function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data: [{
            "selectName":"请选择",
            "selectValue":"0"
        },{
            "selectName":"人口",
            "selectValue":"1"
        },{
            "selectName":"医疗",
            "selectValue":"2"
        },{
            "selectName":"环保",
            "selectValue":"3"
        }],
        entityModel:[{
            "entityName":"请选择",
            "entityValue":"0"
        },{
            "entityName":"人口基础信息模型",
            "entityValue":"1"
        }]
    };
})