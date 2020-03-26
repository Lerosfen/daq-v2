$package("chartShowEdit");
chartShowEdit = {
    initChartShowEdit: function(){
        this.obj = {
            saveAddBtn: $("#saveAddBtn"),
            addBtn: $("#addBtn")
        };
        this.data = {};
        this.initDom()
        this.initEvent();
    },
    chartEvent: function(dom){
        dom.draggable();
        dom.resizable({
            helper: "ui-resizable-helper",
            stop: function(e, ui){
                var id = $(this).children(":first").attr("id");
                var dom = document.getElementById(id);
                echarts.getInstanceByDom(dom).resize({
                    width: ui.size.width,
                    height: ui.size.height
                });
            }
        });
    },
    initDom: function(){
        var self = this;
        self.chartEvent($( "#chartOne" ));
        self.chartEvent($( "#chartTwo" ));
        self.chartEvent($( "#chartThree" ));
        self.chartEvent($( "#chartFour" ));
        self.chartEvent($("#chartFive"));
        if(sessionStorage.getItem("chart") == 1){
            $("#chartFive").show();
        }else{
            $("#chartFive").hide();
        }
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot +'/visualization/chartShowEdit',
            success: function(res){
                if(res.code == "code_200"){
                    echarts.init(document.getElementById("chartOneImage")).setOption(JSON.parse(res.data[1].options));
                    echarts.init(document.getElementById("chartTwoImage")).setOption(JSON.parse(res.data[2].options));
                    echarts.init(document.getElementById("chartThreeImage")).setOption(JSON.parse(res.data[3].options));
                    echarts.init(document.getElementById("chartFourImage")).setOption(JSON.parse(res.data[4].options));
                    echarts.init(document.getElementById("chartFiveImage")).setOption(JSON.parse(res.data[0].options));
                }
            }
        })
    },
    initEvent: function(){
        var self = this;
        self.obj.saveAddBtn.unbind().bind("click", function(){
            YunpiAlert.success("保存成功！");
        });
        self.obj.addBtn.unbind().bind("click", function(){
            YunpiDialog.open({
                title: "添加图表",
                url: "chartShowEditAdd.html",
                size: 800,
                sureBtn: true,
                afterWinOpen: function(){
                    $("#chartTable").bootstrapTable({data: []});
                    $("#chartTable").bootstrapTable("showLoading");
                    setTimeout(function(){
                        $("#chartTable").bootstrapTable("destroy");
                        $("#chartTable").bootstrapTable({
                            method : 'POST',
                            url: wwwroot + '/visualization/chartDIY',
                            toolbar: "#toolbar",
                            height:$(window).height()-400,
                            striped: false,
                            cache: false,
                            uniqueId: "id",
                            pageSize: 20,
                            pageList: [20],
                            pagination: true,
                            sortable: false,
                            sidePagination: "server",
                            onlyInfoPagination:false,
                            paginationPreText: "上一页",
                            paginationNextText: "下一页",
                            columns: [{
                                field: 'chartName',
                                title: '图表名称',
                                width: 900
                            },{
                                field: 'isShare',
                                title: '是否共享',
                                width: 500
                            },{
                                field: 'chartDesc',
                                title: '图表描述',
                                width: 900
                            },{
                                field: 'id',
                                title: '操作',
                                width: 550,
                                formatter: function(value, row, index) {
                                    return '<input type="radio" name="currentSel" id="'+ value +'" value="'+ value +'">';
                                }
                            }]
                        })
                        $("#chartTable").bootstrapTable("hideLoading");
                    }, 1000);
                    // 点击行选中radio
                    $("#chartTable").on("click", "tr", function(){
                        $(this).children().eq(3).children().attr("checked",true);;
                    })
                },
                onSureClick: function(){
                    var tblName = $("input[name='currentSel']:checked").val();
                    if(tblName !== undefined){
                        window.sessionStorage.setItem("chart", 1);
                        YunpiAlert.success("添加成功！");
                        YunpiDialog.close();
                        var doms = document.getElementById("chartFiveImage");
                        echarts.getInstanceByDom(doms).resize({
                            width: "776px",
                            height: "234px"
                        });
                        $("#chartFive").show();
                    }else{
                        YunpiAlert.error("请选择图表");
                    }
                }
            })
        });
    }
};
$(function(){
    chartShowEdit.initChartShowEdit();
})