$package("chartShow");
chartShow = {
    initChartShow: function(){
        this.obj = {};
        this.data = {};
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        $.ajax({
            type: "GET",
            dataType: "JSON",
            url: wwwroot + '/visualization/chartShow',
            success: function(res){
                if(res.code == "code_200"){
                    echarts.init(document.getElementById("chartOneImage")).setOption(JSON.parse(res.data[1].options));
                    echarts.init(document.getElementById("chartTwoImage")).setOption(JSON.parse(res.data[2].options));
                    echarts.init(document.getElementById("chartThreeImage")).setOption(JSON.parse(res.data[3].options));
                    echarts.init(document.getElementById("chartFourImage")).setOption(JSON.parse(res.data[4].options));
                    echarts.init(document.getElementById("chartFiveImage")).setOption(JSON.parse(res.data[0].options));
                }
            }
        });
        if(sessionStorage.getItem("chart") == 1){
            $("#chartFive").show();
        }else{
            $("#chartFive").hide();
        }
    },
    initEvent: function(){

    }
};
$(function(){
    chartShow.initChartShow()
})