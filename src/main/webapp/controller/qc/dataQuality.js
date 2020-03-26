/**
 * 数据质量检测
 */
$package("dataQuality");
dataQuality = {
    // 初始化方法
    initdataQuality: function(){
        this.obj = {
            addBtn: $('#addBtn'),
            dataQualityTable: $('#dataQualityTable'),
            statusSel: $("select[name='status']"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
            taskName: $("#taskName"),
            tableName: $("#tableName")
        };
        this.data = {
            statusDic: []
        }
        this.initDom();
        this.initEvent();
    },

    // 页面初始化
    initDom: function(){
        var self = this;
        // 获取状态编码
        $.ajax({
            type: 'get',
            dataType: 'json',
            async: false,
            url: wwwroot + "/base/api/dictionary/db_source_status",
            success: function(res){
                if(res.code == 'code_200'){
                    self.data.statusDic = res.data.toDict("dicCode", true);
                    var data = res.data;
                    var len = data.length;
                    var html = "";
                    // 状态下拉框
                    for(var i = 0; i<len;i++){
                        html += `<option value=${data[i].dicCode}>${data[i].dicName}</option>`;
                    }
                    self.obj.statusSel.append(html);
                }else{
                    YunpiAlert.error(res.msg);
                }
            },
            error: function(){
                YunpiAlert.error('状态字典查询失败！');
            }
        })
        self.obj.dataQualityTable.bootstrapTable({
            method: 'POST',
            url: wwwroot + '/qc/dataQuality',
            toolbar: '#toolbar',
            height: $(window).height() - 100,
            striped: false,
            cache: false,
            rightFixedColumns:true,
            rightFixedNumber:1,
            uniqueId: 'id',
            pageSize: 20,
            pageList: [20],
            pagination: true,
            sortable: false,
            sidePagination: "server",
            onlyInfoPagination:false,
            paginationPreText: "上一页",
            paginationNextText: "下一页",
            columns: [{
                field: 'taskName',
                title: '任务名称',
                width: 300
            }, {
                field: 'runRules',
                title: '执行规则',
                width: 300
            },{
                field: 'checkTable',
                title: '检测表',
                width: 300
            },{
                field: 'taskStatus',
                title: '任务状态',
                width: 300,
                formatter: function(val){
                    return self.data.statusDic.getText(val, "dicName");
                }
            },{
                field:"dataQuality",
                title:"数据质量",
                width: 300,
                formatter: function(value, row){
                    if(row.taskStatus == 1){
                        if(value == 0){
                            return "<span class='glyphicon glyphicon-bell dataQuality-warning'></span>"
                        }else{
                            return "<span class='glyphicon glyphicon-bell dataQuality-normal'></span>"
                        }
                    }
                }
            },{
                field:"endCheckTime",
                title:"最后检测时间",
                width: 500
            },
            {
                field: 'createTime',
                title: '创建时间',
                width: 500
            },
            {
                field: 'editTime',
                title: '修改时间',
                width: 500
            },
            {
                field: 'id',
                title: '操作',
                width: 580,
                align: 'left',
                formatter: function(value, row, index) {
                    var id = value;
                    var result = "";
                    result += '<a href="#" onclick="dataQuality.viewById(\'' + id + '\')" title="查看"><span class="glyphicon glyphicon-search"></span></a>';
                    result += '<a href="#" onclick="dataQuality.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                    if(row.taskStatus == 1){ // 启用状态
                        result += '<a href="#" onclick="dataQuality.endById(\'' + id + '\' )" title="禁用"><span class="glyphicon glyphicon-ban-circle"></span></a>';
                    }else{
                        result += '<a href="#" onclick="dataQuality.startById(\'' + id + '\' )" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                    }
                    if(row.taskStatus == 0){ // 编辑状态
                        result += '<a href="#" onclick="dataQuality.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                    }
                    result += `<a href="#" onclick="dataQuality.showReport('${row.checkTable}','${row.endCheckTime}')" title="报告"><span class="glyphicon glyphicon-book"></span></a>`;
                    // result += '<a href="#" onclick="dataQuality.showReport(\'' + (row.checkTable) + '\')" title="报告"><span class="glyphicon glyphicon-book"></span></a>';
                    result += '<a href="#" onclick="dataQuality.problemData(\'' + id + '\')" title="问题数据"><span class="glyphicon glyphicon-hdd"></span></a>';
                    return result;
                }
            }]
        });
    },

    // 页面事件绑定
    initEvent: function(){
        var self = this;
        self.obj.addBtn.unbind().bind('click', function(){
              YunpiDialog.open({
                  title: '数据质检-添加',
                  url: 'dataQualityAdd.html',
                  sureBtn: true,
                  size: 650,
                  afterWinOpen: function(){
                      // 加载cron插件
                      $("#cron").cronGen({
                          direction : 'right'
                      });
                      // cron插件样式重调
                      $("#dataQualityAddForm").children().eq(2).css({
                          marginTop: '-31px',
                          marginLeft: '326px'
                      });
                      //$("span.input-group-btn").css('transform', "translateY(-2.2px)");
                      $("#dataQualityAddForm").find('input').eq(1).attr('readonly', true);
                      // cron插件控制
                      $("div.popover-inner").mouseleave(function(){
                          $(this).hide();
                      })
                  },
                  onSureClick: function(){
                      if($('#dataQualityAddForm').formVerify()){
                          var data = $('#dataQualityAddForm').getform();
                          YunpiConsole.log(data);
                          YunpiAlert.success("数据质检添加成功！");
                          self.obj.dataQualityTable.bootstrapTable("refresh");
                          $('#dataQualityAddForm').clearform();
                          YunpiDialog.close();
                      }else{
                          YunpiAlert.warning("提交失败，参数校验不通过")
                      }
                  }
              })
        });
        self.obj.searchBtn.unbind().bind('click', function(){
            // 搜索按钮
            self.obj.dataQualityTable.bootstrapTable("refresh");
        })
        self.obj.resetBtn.unbind().bind('click', function(){
            // 重置按钮
            self.obj.taskName.val("");
            self.obj.tableName.val("");
            self.obj.statusSel.val("");
            self.obj.dataQualityTable.bootstrapTable("refresh");
            //self.initDom();
        });
    },
    // 删除
    deleteById: function(){
        var self = this;
        YunpiConform.open("您确定要删除该任务吗?", "删除任务后会导致质量不佳, 请谨慎选择！", function(){
            self.obj.dataQualityTable.bootstrapTable('refresh');
            YunpiAlert.success('删除成功！');
        })
    },

    // 编辑
    editById: function(id){
        var self = this;
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + '/qc/dataQuality/' + id,
            success: function(res){
                if(res.code == 'code_200'){
                    YunpiDialog.open({
                        title: '数据质检-编辑',
                        url: 'dataQualityEdit.html',
                        size: 650,
                        sureBtn: true,
                        afterWinOpen: function(){
                            // 加载cron插件
                            $("#cron").cronGen({
                                direction : 'right'
                            });
                            // cron插件样式重调
                            $("#dataQualityEditForm").children().eq(2).css({
                                marginTop: '-31px',
                                marginLeft: '326px'
                            });
                            $("#dataQualityEditForm").find('input').eq(1).attr('readonly', true);
                            var cronVal = res.data.runRules;
                            $('#dataQualityEditForm').setform(res.data);
                            $("#dataQualityEditForm").find('.input-group').eq(2).children().val(cronVal);
                        },
                        onSureClick: function(){
                            if($('#dataQualityEditForm').formVerify()){
                                var data = $('#dataQualityEditForm').getform();
                                YunpiAlert.success("数据质检编辑成功！");
                                self.obj.dataQualityTable.bootstrapTable("refresh");
                                $('#dataQualityEditForm').clearform();
                                YunpiDialog.close();
                            }else{
                                YunpiAlert.warning("提交失败，参数校验不通过")
                            }
                        }
                    })
                }
            }
        })
    },

    // 查看
    viewById: function(id){
        var self = this;
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: wwwroot + '/qc/dataQuality/' + id,
            success: function(res){
                if(res.code == 'code_200'){
                    YunpiDialog.open({
                        title: '数据质检-查看',
                        url: 'dataQualityView.html',
                        size: 650,
                        afterWinOpen: function(){
                            $('#dataQualityViewForm').setform(res.data);
                        },
                        beforeWinClose: function(){
                            $('#dataQualityViewForm').clearform();
                        }
                    })
                }else{
                    YunpiAlert.error(res.msg);
                }
            },
            error: function(){
                YunpiAlert.error(res.msg);
            }
        })
    },

    // 启用
    startById: function(){
        var self = this;
        if(Math.random()>0.5){
            YunpiAlert.success('启用成功');
            self.obj.dataQualityTable.bootstrapTable('refresh');
        }else{
            YunpiAlert.error('启用失败');
        }
    },

    // 禁用
    endById: function(){
        var self = this;
        if(Math.random()>0.5){
            YunpiAlert.success('禁用成功');
            self.obj.dataQualityTable.bootstrapTable('refresh');
        }else{
            YunpiAlert.error('禁用失败');
        }
    },

    // 报告
    showReport: function(row,endCheckTime){
        var self = this;
        console.log("this is row",row,endCheckTime)
        YunpiDialog.open({
            title: '质检报告',
            url: 'dataQualityReport.html',
            size: 950,
            sureBtn: true,
            sureBtnName:"下载报告",
            afterWinOpen: function(){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: wwwroot + '/Quality/inspection/report',
                    success: function (responseData) {
                        $("#Checklist").html(row);
                        $("#CheckT").html(endCheckTime)
                        $("#Detection").html("3分15秒")
                        if (responseData.code == "code_200") {
                            $.each(responseData.data,function(i,item){
                                $("#reportTable").append('<tr><td>'+item.dicName+'</td><td>'+item.describe+'</td><td>'+item.type+'</td><td>'+item.length+'</td><td>'+item.dataSource+'</td><td>'+item.describe+'</td></tr>');
                            });
                        }else{
                            YunpiAlert.error(responseData.msg);
                        }
                        self.CircularStatistics()
                        self.ChangeTrend()
                    },
                    error: function () {
                        YunpiAlert.error('部门列表查询失败！');
                    }
                });
            },
            onSureClick:function () {
                var src = '/resources/img/Qualitytesting.pdf';
                var $a = document.createElement('a');
                $a.setAttribute("href", src);
                $a.setAttribute("download", "");
                var evObj = document.createEvent('MouseEvents');
                evObj.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
                $a.dispatchEvent(evObj);
                $('#yunpi-window').modal('hide');
            }
        });
    },
    //检测结果
    CircularStatistics:function(){
        //圆形统计图
        $("#ResultRight").css('width',$(".ResultRight").width());//获取父容器的宽度具体数值直接赋值给图表
        var ResultRight =document.getElementById('ResultRight');
        var pieChart = echarts.init(ResultRight);
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['规范数据','问题数据']
            },
            series: [
                {
                    name:'规范数据',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:9900, name:'规范数据'},
                        {value:99, name:'问题数据'}
                    ]
                }
            ]
        };
        pieChart.setOption(option);
    },
    //历史变更趋势
    ChangeTrend:function(){
        var self = this;
        var dayNumber = -100;
        $.ajax({
            type: "get",
            dataType: "json",
            url: wwwroot + "/TimeSet/time/?lime="+dayNumber,
            async: false,
            success: function(res) {
                var PointTime = [];
                var dataValue = []
                var  Proportion = []
                res.forEach((item, index, arr) => {
                    PointTime.unshift(item.PointTime)
                    dataValue.unshift(item.dataValue)
                    Proportion.unshift(item.Proportion)
                })
                $("#ChangeTrend").css('width',$(".ChangeTrend").width());//获取父容器的宽度具体数值直接赋值给图表
                var ChangeTrend =  document.getElementById('ChangeTrend');
                var ChangeTrendChart = echarts.init(ChangeTrend);
                var optionTh = {
                    dataZoom: [{
                        type: 'slider',
                        show: true, //flase直接隐藏图形
                        zoomLock:true,
                        // backgroundColor:"rgba(207,235,255,0.5)", //组件的背景颜色
                        fillerColor:"rgba(207,235,255,0.5)",
                        xAxisIndex: [0],
                        left: '10%', //滚动条靠左侧的百分比
                        bottom: -5,
                        start: 0,//滚动条的起始位置
                        end: 40 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
                    }],
                    title: {
                        left:'left',
                        text: '历史变更趋势',
                        textStyle:{
                            fontSize:14
                            ,fontWeight:'normal'
                            ,color:'#333333'
                        },
                        top:"12",
                    },
                    grid: {
                        bottom: 80
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        },
                        formatter: function (params) {
                            var res = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++)
                            {
                                if(i==0)
                                {
                                    res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                                }
                                else
                                {
                                    res += '<br/>' + params[i].seriesName + ' : ' + params[i].value+ "%";
                                }
                            }
                            return res;
                        }
                    },
                    // legend: {
                    //     data:['符合规则数据量','比例'],
                    //     x: 'left'
                    // },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            axisLine: {onZero: false},
                            data : PointTime
                        }
                    ],
                    yAxis: [
                        {
                            // name: '符合规则数据量(条)',
                            type: 'value',
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                formatter: '{value}'
                            }
                        },
                        {
                            // name: '比例(%)',
                            // nameLocation: 'start',
                            type: 'value',
                            // inverse: true,
                            axisLabel: {
                                show: false,
                                interval: 'auto',
                                formatter: '{value}%'
                            }
                        }
                    ],
                    series: [
                        {
                            name:'符合规则数据量',
                            type:'line',
                            hoverAnimation: false,
                            itemStyle: {
                                normal: {
                                    color:'#0b96f7', //改变折线点的颜色
                                    lineStyle:{
                                        color:'#0e9cff' //改变折线颜色
                                    },
                                    label : {
                                        show:false,
                                        position:'top',
                                        formatter:'{c}'
                                    }
                                }
                            },
                            // areaStyle: {
                            //     normal: {
                            //         color: '#cfebff' //改变区域颜色
                            //     }
                            // },
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },
                            data:dataValue
                        },
                        {
                            // name:'比例',
                            type:'line',
                            yAxisIndex:1,
                            hoverAnimation: false,
                            itemStyle: {
                                normal: {
                                    color:'#65f7b7', //改变折线点的颜色
                                    lineStyle:{
                                        color:'#05f68c' //改变折线颜色
                                    },
                                    label : {
                                        show:false,
                                        position:'top',
                                        formatter:'{c}%'
                                    }
                                }
                            },
                            // areaStyle: {
                            //     normal: {
                            //         color: '#a1edcc' //改变区域颜色
                            //     }
                            // },
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },
                            data: Proportion
                        },
                    ]
                };
                ChangeTrendChart.setOption(optionTh);
            }
        })
    },
    // 问题数据
    problemData: function(){
        var self = this;
        YunpiDialog.open({
            title: '问题数据',
            url: 'dataQualityProblemData.html',
            size: 1000,
            afterWinOpen: function(){
                $("#problemTable").bootstrapTable({data: []});
                $("#problemTable").bootstrapTable("showLoading");
                setTimeout(function(){
                    $("#problemTable").bootstrapTable("destroy");
                    $("#problemTable").bootstrapTable({
                        method: 'POST',
                        url: wwwroot + '/qc/problemData',
                        height: $(window).height() - 300,
                        striped: false,
                        cache: false,
                        uniqueId: 'id',
                        pageSize: 20,
                        pageList: [20],
                        pagination: true,
                        sortable: false,
                        sidePagination: "server",
                        onlyInfoPagination:false,
                        paginationPreText: "上一页",
                        paginationNextText: "下一页",
                        columns:[
                            {
                                field: 'column1',
                                title: 'column1',
                                width: 300
                            },
                            {
                                field: 'column2',
                                title: 'column2',
                                width: 300
                            },
                            {
                                field: 'column3',
                                title: 'column3',
                                width: 300
                            }
                        ]
                    });
                    $("#problemTable").bootstrapTable("hideLoading");
                }, 1000);
            }
        });
    }

};
$(function(){
    dataQuality.initdataQuality();
})

