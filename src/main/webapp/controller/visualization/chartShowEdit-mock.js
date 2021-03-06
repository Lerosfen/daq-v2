/**
*  图表展示编辑 mock
* */
Mock.mock(wwwroot + '/visualization/chartShowEdit', 'get', function() {
    return {
        "msg":"查询成功。",
        "code":"code_200",
        "data":[
            {
                "chartName":"医生科室人数统计-雷达图",
                "classify":"{\"filed\":\"所在科室\",\"targetFieldName\":\"DEPARTMENT_IN_CHARGE\",\"pid\":\"725516d9fa024705b5e731c9677767ea\",\"id\":\"e08094ce94574e548b43f117eb76a4e2\"}",
                "createTime":"2019-10-31 15:25:23",
                "createUser":"1008611",
                "heights":300,
                "id":"0a8199d614b348fd84a11a6c58ea63ac",
                "leftValue":-458,
                "modelName":"MODEL_Y_DOCTOR_DATA",
                "options":"{\"radar\":{\"indicator\":[{\"max\":7,\"name\":\"传染病科\"},{\"max\":7,\"name\":\"内科\"},{\"max\":7,\"name\":\"口腔科\"},{\"max\":7,\"name\":\"呼吸科\"},{\"max\":7,\"name\":\"心内科\"},{\"max\":7,\"name\":\"骨科\"}],\"name\":{\"textStyle\":{\"padding\":[3,5],\"backgroundColor\":\"#999\",\"color\":\"#000\",\"borderRadius\":3}}},\"legend\":{\"data\":[\"DEPARTMENT_IN_CHARGE\"],\"left\":\"left\",\"textStyle\":{\"color\":\"#000\"}},\"series\":[{\"data\":[{\"name\":\"DEPARTMENT_IN_CHARGE\",\"value\":[7,6,5,4,6,4]}],\"type\":\"radar\"}],\"tooltip\":{},\"title\":{\"x\":\"right\",\"text\":\"医生科室人数统计-雷达图\",\"textStyle\":{\"color\":\"#000\"}}}",
                "orders":0,
                "pageId":"1",
                "series":"",
                "state":2,
                "status":2,
                "topValue":-630,
                "types":"radar",
                "updateTime":"2019-10-27 23:59:59",
                "widths":452
            },
            {
                "chartName":"医生科室人数统计--饼图",
                "classify":"{\"filed\":\"所在科室\",\"targetFieldName\":\"DEPARTMENT_IN_CHARGE\",\"pid\":\"725516d9fa024705b5e731c9677767ea\",\"id\":\"e08094ce94574e548b43f117eb76a4e2\"}",
                "createTime":"2019-10-28 07:59:59",
                "createUser":"1008611",
                "heights":300,
                "id":"196e429ee62f465aa0b15d0aecbcd5b8",
                "leftValue":-461,
                "modelName":"MODEL_Y_DOCTOR_DATA",
                "options":"{\"legend\":{\"orient\":\"vertical\",\"data\":[\"传染病科\",\"内科\",\"口腔科\",\"呼吸科\",\"心内科\",\"骨科\"],\"left\":\"left\",\"textStyle\":{\"color\":\"#000\"}},\"series\":[{\"data\":[{\"name\":\"传染病科\",\"value\":7},{\"name\":\"内科\",\"value\":6},{\"name\":\"口腔科\",\"value\":5},{\"name\":\"呼吸科\",\"value\":4},{\"name\":\"心内科\",\"value\":6},{\"name\":\"骨科\",\"value\":4}],\"center\":[\"50%\",\"60%\"],\"name\":\"名称\",\"itemStyle\":{\"emphasis\":{\"shadowOffsetX\":0,\"shadowBlur\":10,\"shadowColor\":\"rgba(0, 0, 0, 0.5)\"}},\"type\":\"pie\",\"radius\":\"55%\"}],\"tooltip\":{\"formatter\":\"{a} <br/>{b} : {c} ({d}%)\",\"trigger\":\"item\"},\"title\":{\"x\":\"center\",\"text\":\"医生科室人数统计--饼图\",\"textStyle\":{\"color\":\"#000\"}}}",
                "orders":0,
                "pageId":"1",
                "series":"",
                "state":2,
                "status":2,
                "topValue":3,
                "types":"pie",
                "updateTime":"2019-10-27 23:59:59",
                "widths":452
            },
            {
                "chartName":"医生科室人数统计--柱状图",
                "classify":"{\"filed\":\"所在科室\",\"targetFieldName\":\"DEPARTMENT_IN_CHARGE\",\"pid\":\"725516d9fa024705b5e731c9677767ea\",\"id\":\"e08094ce94574e548b43f117eb76a4e2\"}",
                "createTime":"2019-10-28 07:59:59",
                "createUser":"1008611",
                "heights":300,
                "id":"3ca02203fa4548989f0c95fb42336443",
                "leftValue":649,
                "modelName":"MODEL_Y_DOCTOR_DATA",
                "options":"{\"yAxis\":[{\"axisLine\":{\"lineStyle\":{\"color\":\"#000\"}},\"type\":\"value\"}],\"xAxis\":[{\"data\":[\"传染病科\",\"内科\",\"口腔科\",\"呼吸科\",\"心内科\",\"骨科\"],\"axisLine\":{\"lineStyle\":{\"color\":\"#000\"}},\"axisTick\":{\"alignWithLabel\":true},\"type\":\"category\"}],\"color\":[\"#3398DB\"],\"grid\":{\"left\":\"3%\",\"bottom\":\"3%\",\"right\":\"4%\",\"containLabel\":true},\"series\":[{\"barWidth\":\"30%\",\"data\":[7,6,5,4,6,4],\"type\":\"bar\"}],\"tooltip\":{\"axisPointer\":{\"type\":\"shadow\"},\"trigger\":\"axis\"},\"title\":{\"x\":\"right\",\"text\":\"医生科室人数统计--柱状图\",\"textStyle\":{\"color\":\"#000\"}}}",
                "orders":0,
                "pageId":"1",
                "series":"",
                "state":2,
                "status":2,
                "topValue":17,
                "types":"bar",
                "updateTime":"2019-10-27 23:59:59",
                "widths":757
            },
            {
                "chartName":"医生科室-职称--折线图",
                "classify":"{\"filed\":\"所在科室\",\"targetFieldName\":\"DEPARTMENT_IN_CHARGE\",\"pid\":\"725516d9fa024705b5e731c9677767ea\",\"id\":\"e08094ce94574e548b43f117eb76a4e2\"}",
                "createTime":"2019-10-28 07:59:59",
                "createUser":"1008611",
                "heights":298,
                "id":"597144d7357045c2963151af53144043",
                "leftValue":11,
                "modelName":"MODEL_Y_DOCTOR_DATA",
                "options":"{\"yAxis\":{\"axisLine\":{\"lineStyle\":{\"color\":\"#000\"}},\"type\":\"value\"},\"xAxis\":{\"data\":[\"传染病科\",\"内科\",\"口腔科\",\"呼吸科\",\"心内科\",\"骨科\"],\"axisLine\":{\"lineStyle\":{\"color\":\"#000\"}},\"type\":\"category\",\"boundaryGap\":false},\"legend\":{\"data\":[\"住院医生\",\"助理医师\",\"住院医师\",\"主治医师\",\"副主任\",\"主任\"],\"left\":\"left\",\"textStyle\":{\"color\":\"#000\"}},\"grid\":{\"left\":\"3%\",\"bottom\":\"3%\",\"right\":\"4%\",\"containLabel\":true},\"series\":[{\"data\":[1,0,2,0,0,0],\"name\":\"住院医生\",\"type\":\"line\"},{\"data\":[2,2,2,0,0,1],\"name\":\"助理医师\",\"type\":\"line\"},{\"data\":[3,0,0,1,0,1],\"name\":\"住院医师\",\"type\":\"line\"},{\"data\":[1,3,1,3,4,1],\"name\":\"主治医师\",\"type\":\"line\"},{\"data\":[0,1,0,0,1,0],\"name\":\"副主任\",\"type\":\"line\"},{\"data\":[0,0,0,0,1,1],\"name\":\"主任\",\"type\":\"line\"}],\"tooltip\":{\"trigger\":\"axis\"},\"toolbox\":{\"feature\":{\"saveAsImage\":{}}},\"title\":{\"x\":\"right\",\"text\":\"医生科室-职称--折线图\",\"textStyle\":{\"color\":\"#000\"}}}",
                "orders":0,
                "pageId":"1",
                "series":"{\"filed\":\"技术职称\",\"targetFieldName\":\"TECHNICAL_ TITLE\",\"pid\":\"725516d9fa024705b5e731c9677767ea\",\"id\":\"981951043803402b8716ff17eb15385f\"}",
                "state":2,
                "status":2,
                "topValue":-609,
                "types":"line",
                "updateTime":"2019-10-27 23:59:59",
                "widths":1385
            },
            {
                "chartName":"医生科室人数统计--折线图",
                "classify":"{\"filed\":\"所在科室\",\"targetFieldName\":\"DEPARTMENT_IN_CHARGE\",\"pid\":\"725516d9fa024705b5e731c9677767ea\",\"id\":\"e08094ce94574e548b43f117eb76a4e2\"}",
                "createTime":"2019-10-28 07:59:59",
                "createUser":"1008611",
                "heights":300,
                "id":"5aa5046ece1548639cbd7bef029ff463",
                "leftValue":10,
                "modelName":"MODEL_Y_DOCTOR_DATA",
                "options":"{\"yAxis\":{\"axisLine\":{\"lineStyle\":{\"color\":\"#000\"}},\"type\":\"value\"},\"xAxis\":{\"data\":[\"传染病科\",\"内科\",\"口腔科\",\"呼吸科\",\"心内科\",\"骨科\"],\"axisLine\":{\"lineStyle\":{\"color\":\"#000\"}},\"type\":\"category\"},\"series\":[{\"data\":[7,6,5,4,6,4],\"type\":\"line\"}],\"tooltip\":{\"trigger\":\"axis\"},\"title\":{\"x\":\"right\",\"text\":\"医生科室人数统计--折线图\",\"textStyle\":{\"color\":\"#000\"}}}",
                "orders":0,
                "pageId":"1",
                "series":"",
                "state":2,
                "status":2,
                "topValue":-603,
                "types":"line",
                "updateTime":"2019-10-28 00:00:00",
                "widths":631
            },
            {
                "chartName":"医生科室-职称--柱状图",
                "classify":"{\"filed\":\"所在科室\",\"targetFieldName\":\"DEPARTMENT_IN_CHARGE\",\"pid\":\"725516d9fa024705b5e731c9677767ea\",\"id\":\"e08094ce94574e548b43f117eb76a4e2\"}",
                "createTime":"2019-10-28 07:59:59",
                "createUser":"1008611",
                "heights":300,
                "id":"cd3ae9eeee7d4a1c82722eb1cd979131",
                "leftValue":456,
                "modelName":"MODEL_Y_DOCTOR_DATA",
                "options":"{\"yAxis\":{\"axisLine\":{\"lineStyle\":{\"color\":\"#000\"}}},\"xAxis\":{\"axisLine\":{\"lineStyle\":{\"color\":\"#000\"}},\"type\":\"category\"},\"legend\":{\"left\":\"left\",\"textStyle\":{\"color\":\"#000\"}},\"series\":[{\"barWidth\":\"10%\",\"type\":\"bar\"},{\"barWidth\":\"10%\",\"type\":\"bar\"},{\"barWidth\":\"10%\",\"type\":\"bar\"},{\"barWidth\":\"10%\",\"type\":\"bar\"},{\"barWidth\":\"10%\",\"type\":\"bar\"},{\"barWidth\":\"10%\",\"type\":\"bar\"}],\"tooltip\":{},\"title\":{\"x\":\"right\",\"text\":\"医生科室-职称--柱状图\",\"textStyle\":{\"color\":\"#000\"}},\"dataset\":{\"source\":[[\"product\",\"住院医生\",\"助理医师\",\"住院医师\",\"主治医师\",\"副主任\",\"主任\"],[\"传染病科\",1,2,3,1,0,0],[\"内科\",0,2,0,3,1,0],[\"口腔科\",2,2,0,1,0,0],[\"呼吸科\",0,0,1,3,0,0],[\"心内科\",0,0,0,4,1,1],[\"骨科\",0,1,1,1,0,1]]}}",
                "orders":0,
                "pageId":"1",
                "series":"{\"filed\":\"技术职称\",\"targetFieldName\":\"TECHNICAL_ TITLE\",\"pid\":\"725516d9fa024705b5e731c9677767ea\",\"id\":\"981951043803402b8716ff17eb15385f\"}",
                "state":2,
                "status":2,
                "topValue":-1234,
                "types":"bar",
                "updateTime":"2019-10-28 00:00:00",
                "widths":934
            }
        ]
    }
});

Mock.mock(wwwroot+'/visualization/chartDIY',function(options) {
    var result = {
        total: 100,
        rows:[]
    };
    var offsetNum = getPostParam(options).offset;
    for(var i = 0 ; i < 20 ; i++){
        result.rows.push(Mock.mock({
            "id":/[a-z][A-Z][0-9]/,
            "chartName":"图表"+(offsetNum+i),
            "chartDesc":"图表" + (offsetNum+i)  + "信息描述",
            "isShare":/是|否/,
            "createTime":Mock.Random.datetime(),
            "modifyTime":Mock.Random.datetime()
        }));
    };
    return result;
});