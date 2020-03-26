/**
 * entityModel 获取
 *分页数据
 */
Mock.mock(wwwroot+'/visualization/chartDIY',function(options) {
    var result = {
        total: 580,
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
});
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
            "selectName":"清洗目标表",
            "selectValue":"1"
        },{
            "selectName":"融合目标表",
            "selectValue":"2"
        },{
            "selectName":"模型表",
            "selectValue":"3"
        }]
    };
})
/**
 *数据表
 */
Mock.mock(wwwroot + '/Data/sheetData', "get", function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data: [["请选择"],["采集目标表1","采集目标表2","采集目标表3","采集目标表4"],
            ["清洗目标表1","清洗目标表2","清洗目标表3","清洗目标表4"],
            ["融合目标表1","融合目标表2","融合目标表3","融合目标表4"],
            ["模型表1","模型表2","模型表3","模型表4"]],
    };
})