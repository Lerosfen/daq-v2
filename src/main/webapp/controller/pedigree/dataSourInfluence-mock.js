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
            "selectName":"库表",
            "selectValue":"1"
        },{
            "selectName":"接口",
            "selectValue":"2"
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
        data: [["请选择"],["库表1","库表2","库表3","库表4"],
            ["接口1","接口2","接口3","接口4"]],
    };
})