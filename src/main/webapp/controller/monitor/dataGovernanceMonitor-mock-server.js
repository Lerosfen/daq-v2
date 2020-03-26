/**
 * CPU运行监控 数据获取
 *分页数据
 */
Mock.mock(wwwroot + '/cleanRule/CPUList',function() {
    var result = {
        SpeedNum:Math.floor(Math.random() * (100 - 10)) + 10
    };
    return result;
});
/**
 *待清洗
 */
Mock.mock(wwwroot + '/disk/Monitor',function() {
    var resultdisk =[
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '待清洗1'},
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '待清洗2'},
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '待清洗3'},
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '待清洗4'},
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '待清洗5'}
    ]
    return resultdisk;
});
/**
 *前一个小时转换分钟
 */
function getBz(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}
function getDate (){
    var dateArray = {};
    var myDate = new Date(); //实例一个时间对象；
    myDate.getFullYear();   //获取系统的年；
    myDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
    myDate.getDate(); // 获取系统日，
    myDate.getHours(); //获取系统时，
    myDate.getMinutes(); //分
    myDate.getSeconds(); //秒
    var random = parseInt(100 + (9000 - 10) * (Math.random()))
   var oTime =myDate.getHours() +':'+ myDate.getMinutes() +':'+myDate.getSeconds();//拼接时间
    dateArray = {"name":new Date().toString(),value: [new Date(),random]}
    return dateArray;
}
Mock.mock(wwwroot + '/Thread/monitoring',function() {
    var monitoring = getDate();
    return monitoring;
});
/**
 * 待处理数据量实时监控
 */
function getDateArray(endDate, splitTime, count) {
    if(!endDate) {
        endDate = new Date();
    }
    if(!splitTime) {
        splitTime = 1 * 60 * 1000;
    }
    if(!count) {
        count= 60;
    }
    var endTime = endDate.getTime();
    var mod = endTime % splitTime;
    if(mod > 0) {
        endTime -= mod;
    }
    var dateArray = [];
    while(count-- > 0) {
        var timeMouth = endTime - count * splitTime;
        var oDate = new Date(timeMouth*1),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth()+1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = getBz(oHour) +':'+ getBz(oMin) +':'+getBz(oSen);//拼接时间
        var random = parseInt(900 + (2000 - 10) * (Math.random()))
        dateArray.unshift({"PointTime":oTime,"dataValue":random});
    }
    return dateArray;
}
Mock.mock(wwwroot + '/Daily/total',function() {
    var monitoring = getDateArray();
    return monitoring;
});
/**
 *数据融合
 */
Mock.mock(wwwroot + '/disk/fuse',function() {
    var resultdisk =[
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '融合1'},
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '融合2'},
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '融合3'},
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '融合4'},
        {value:Math.floor(Math.random() * (100 - 10)) + 10, name: '融合5'}
    ]
    return resultdisk;
});
