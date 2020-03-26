/**
 * cleanRuls 数据获取
 *分页数据
 */
Mock.mock(wwwroot + '/cleanRule/cleanRuleList',function() {
    var result = {
        total: 100,
        rows:[]
    };
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "dicName": /去空格|加前缀|加后缀/,
            "modifyTime": Mock.Random.datetime(),
            "modifyTime": Mock.Random.datetime(),
            "createTime":"特产流众军听变志领对通习发工。",
            "dicCode": /shell|jar/,
            "dicDesc": /1|0/,
            "daqfileCount": /[0-9]{3,5}/
        }));
    };
    return result;
});
/**
 * 获取清洗规则状态信息
 */
Mock.mock(wwwroot + '/cleanRule/api/clean_status',"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:[{
            dicName:"全部",
            dicCode:"0"
        },{
            dicName:"编辑",
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
 * 获取清洗规则类型信息
 */
Mock.mock(wwwroot + '/cleanRule/api/clean_type',"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:[{
            dicName:"shell脚本",
            dicCode:"0"
        },{
            dicName:"jar脚本",
            dicCode:"1"
        }]
    };
});
/**
 * 根据ID获取清洗规则管理
 */
Mock.mock(RegExp(wwwroot + '/basic/configuration'+ ".*"),"get",function() {
    return {
        code:"code_200",
        msg:"查询成功！",
        data:Mock.mock({
            "confDesc":"配置信息描述",
            "confValue" :/[a-z][A-Z][0-9]/,
            "createTime":Mock.Random.datetime()
        })
    };
});