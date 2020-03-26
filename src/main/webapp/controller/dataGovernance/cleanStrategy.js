$package("cleanStrategy");
cleanStrategy = {
    initCleanStrategy: function(){
        this.obj = {
            cleanStrategyTable: $("#cleanStrategyTable"),
            addBtn: $("#addBtn"),
            strategyName: $("#strategyName"),
            searchBtn: $("#searchBtn"),
            resetBtn: $("#resetBtn"),
            ellipseTbl: $(".ellipseTbl"),
            boxField: $(".boxField"),
            paint: $("#paint"),
            arrows: $(".arrows"),
            pointer: $(".pointer"),
        };
        this.data = {
            statusDic: [],
            dragX: 0,
            dragY: 0,
            currentEle: "",
            currentEleMenu: "",
        }
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: wwwroot + "/base/api/dictionary/db_source_status",
            async: false,
            success: function(res){
                if(res.code == "code_200"){
                    self.data.statusDic = res.data.toDict("dicCode", true);
                }
            }
        })
        self.obj.cleanStrategyTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/dataGovernance/cleanStrategy',
            //queryParams: "queryParams",
            toolbar: "#toolbar",
            height:$(window).height()-100,
            striped: false, // 是否显示行间隔色
            cache: false,//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            uniqueId: "id",
            pageSize: 20,
            pageList: [20],  //pageList: [10, 25, 50, 100],
            pagination: true, // 是否分页
            sortable: false, // 是否启用排序
            rightFixedColumns:true,
            rightFixedNumber:1,
            sidePagination: "server",
            onlyInfoPagination:false,
            paginationPreText: "上一页",
            paginationNextText: "下一页",
            columns: [{
                field: 'strategyName',
                title: '策略名称',
                width: 300
            }, {
                field: 'status',
                title: '状态',
                width: 200,
                formatter: function(value) {
                    return self.data.statusDic.getText(value,"dicName");
                }
            },{
                field:"createTime",
                title:"创建时间",
                width: 350
            },{
                field:"createUser",
                title:"创建人",
                width: 350
            },{
                field: 'id',
                title: '操作',
                width: 130,
                align: 'left',
                formatter: function (value, row, index) {
                    var id = value;
                    var result = "";
                    result += '<a href="#" onclick="cleanStrategy.viewById(\'' + id + '\')" title="查看详情"><span class="glyphicon glyphicon-search"></span></a>';
                    if(row.status == 1){
		                result += `<a href="#" onclick="cleanStrategy.viewData('${id}','${row.strategyName}')" title="查看数据"><span class="glyphicon view-data"></span></a>`;
                    }
                    if(row.status == 2){
                        result += '<a href="#" onclick="cleanStrategy.useById(\'' + id + '\')" title="启用"><span class="glyphicon glyphicon-flash"></span></a>';
                        result += '<a href="#" onclick="cleanStrategy.editById(\'' + id + '\')" title="编辑"><span class="glyphicon glyphicon-pencil"></span></a>';
                        result += '<a href="#" onclick="cleanStrategy.deleteById(\'' + id + '\')" title="删除"><span class="glyphicon glyphicon-remove"></span></a>';
                    }
                    return result;
                }
            }]
        });
    },
    initEvent: function(){
        var self = this;
        var graph = new joint.dia.Graph();
        var paper = new joint.dia.Paper({
            el: $('#paint'),
            model: graph,
            width: 950,
            height: 650,
            gridSize: 1,
            clickThreshold: 1
        });
        var tableHtml = [
            '<div class="html-element tableModel">',
            '<label></label>',
            '<span></span>',
            '</div>'
        ];
        var fieldHtml = [
            '<div class="html-element fieldModel">',
            '<label></label>',
            '<span></span>',
            '</div>'
        ];
        var addFieldHtml = [
            '<div class="html-element addFieldModel">',
            '<label></label>',
            '<span></span>',
            '</div>'
        ];
        var config = {
            initialize: function () {    //初始化
                _.bindAll(this, 'updateBox');
                joint.dia.ElementView.prototype.initialize.apply(this, arguments);
                this.$box = $(_.template(this.template)());
                this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
                this.model.on('change', this.updateBox, this);
                this.model.on('remove', this.removeBox, this);
                this.updateBox();
            },
            render: function () {
                joint.dia.ElementView.prototype.render.apply(this, arguments);
                this.paper.$el.prepend(this.$box);
                this.updateBox();
                return this;
            },
            updateBox: function () {
                var bbox = this.model.getBBox();
                this.$box.find('label').text(this.model.get('label'));
                this.$box.find('span').text(this.model.get('span'));  //将从select获取的元素回显到span
                this.$box.css({
                    width: bbox.width,
                    height: bbox.height,
                    left: bbox.x,
                    top: bbox.y,
                    transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
                });
            },
            removeBox: function (evt) {
                this.$box.remove();
            }
        };
        var isLink = false;
        var isShow = true;
        var testArr = [];
        self.obj.addBtn.unbind().bind("click", function(){
            $("#tablePage").css("opacity", 0);
            setTimeout(function(){
                $("#tablePage").hide();
            }, 1000);
            $("#addPage").css("opacity", 1);
            $("#addPage").show();
        });
        self.obj.searchBtn.unbind().bind("click", function(){
            // TODO 调接口
            self.obj.cleanStrategyTable.bootstrapTable("refresh");
        });
        self.obj.resetBtn.unbind().bind("click", function(){
            self.obj.strategyName.val("");
            self.obj.cleanStrategyTable.bootstrapTable("refresh");
        });
        // 拖拽模板事件
        self.obj.ellipseTbl.draggable({
            helper: "clone",
            scope: "drop"
        });
        self.obj.boxField.draggable({
            helper: "clone",
            scope: "drop"
        });
        joint.shapes.html = {};
        // 自定义画布中初始化的html元素
        joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
            defaults: joint.util.deepSupplement({
                type: 'html.Element',
                attrs: {
                    rect: { stroke: 'none', 'fill-opacity': 0 }
                }
            }, joint.shapes.basic.Rect.prototype.defaults)
        });
        // 将模板拖入画布中
        $("#paint").droppable({//拖动复制到指定的div当中
            scope : 'drop',
            drop : function(e, ui) {
                var positionX = e.offsetX-50;
                var positionY = e.offsetY-20;
                if($(ui.helper[0]).hasClass("ellipseTbl")){
                    // 生成表
                    config.template = tableHtml.join('');
                    var tblEllipse = new joint.shapes.html.Element({
                        position: { x: positionX, y: positionY },
                        size: { width: 152, height: 71 },
                        label: '(空)',
                        span: '右键选择表'
                    });
                    joint.shapes.html.ElementView = joint.dia.ElementView.extend(config);
                    tblEllipse.addTo(graph);
                    // 置灰并禁止再拖动表
                    self.obj.ellipseTbl.removeClass("tableNoDrop").addClass("tableDrop");
                    self.obj.ellipseTbl.draggable( "disable" );
                    // self.obj.ellipseTbl.draggable( 'enable' )
                }else if($(ui.helper[0]).hasClass("boxField")){
                    // 生成字段
                    config.template = fieldHtml.join('');
                    var fieldBox = new joint.shapes.html.Element({
                        position: { x: positionX, y: positionY },
                        size: { width: 152, height: 71 },
                        label: '(空)',
                        span: '右键添加规则'
                    });
                    joint.shapes.html.ElementView = joint.dia.ElementView.extend(config);
                    fieldBox.addTo(graph);
                }
            },
        });
        // 画布右键事件
        paper.on('cell:contextmenu',function(e, d) {
            if(e.model.attributes.attrs.line == undefined){
                // 判断是link还是元素
                self.data.currentEle = e;
                var className = e.$box.attr("class").split(" ")[1];
                var positionX = d.clientX;
                var positionY = d.clientY;
                if(isShow){
                    var htmls = document.createElement("div");
                    $(htmls).attr("id", "contextMenus");
                    $(htmls).css({
                        left: positionX,
                        top: positionY
                    });
                    document.body.appendChild(htmls);
                    isShow = false;
                }else{
                    $("#contextMenus").show();
                    $("#contextMenus").css("left", positionX);
                    $("#contextMenus").css("top", positionY);
                }
                if(className == "tableModel"){
                    $("#contextMenus").html("<ul><li><span class='addIcon'></span><span>选择表</span></li><li><span class='delIcon'></span><span>删除</span></li></ul>");
                }else if(className == "fieldModel"){
                    $("#contextMenus").html("<ul><li><span class='addIcon'></span><span>添加清洗规则</span></li><li><span class='delIcon'></span><span>删除</span></li></ul>");
                }
                $("#contextMenus").on("mouseleave", function(){
                    $(this).hide();
                });
            }else{
                if(isLink){
                    e.remove();
                }
            }
        });
        // 右键菜单点击事件
        $(document).on("click", "#contextMenus li", function(){
            var index = $(this).index();
            var val = $(this).children(":last").html();
            $("#contextMenus").hide();
            if(index == 1){
                // 删除元素
                var eleArrs = graph.getCells();
                var id = self.data.currentEle.model.id;
                var eleClassName = self.data.currentEle.$box.attr("class").split(" ")[1];
                for(var i = 0; i < eleArrs.length; i++){
                    if(eleArrs[i].id == id){
                        graph.removeCells(eleArrs[i]);
                    }
                }
                if(eleClassName == "tableModel"){
                    // 可以再次拖动表
                    self.obj.ellipseTbl.removeClass("tableDrop").addClass("tableNoDrop");
                    self.obj.ellipseTbl.draggable('enable');
                }
            }else{
                // 选择表或添加规则弹框
                if(val == "选择表"){
                    YunpiDialog.open({
                        title: "选择清洗表",
                        url: "selectTable.html",
                        sureBtn: true,
                        size: 1200,
                        afterWinOpen: function(){
                            $("#tblTable").bootstrapTable({data:[]});
                            $("#tblTable").bootstrapTable("showLoading");
                            setTimeout(function(){
                                $("#tblTable").bootstrapTable('destroy');
                                $("#tblTable").bootstrapTable({
                                    method : 'POST',
                                    url: wwwroot + "/dataGovernance/selectTable",
                                    height:$(window).height()-340,
                                    striped: true, // 是否显示行间隔色
                                    uniqueId: "id",
                                    pageSize: 20,
                                    pageList: [20],
                                    pagination: true, // 是否分页
                                    sortable: false, // 是否启用排序
                                    sidePagination: "server",
                                    onlyInfoPagination:false,
                                    paginationPreText: "上一页",
                                    paginationNextText: "下一页",
                                    columns:[
                                        {
                                            field: "tableName",
                                            title: "表名称"
                                        },
                                        {
                                            field: "tableDesc",
                                            title: "表描述"
                                        },
                                        {
                                            field: "tableType",
                                            title: "表类型"
                                        },
                                        {
                                            field: "tableName",
                                            title: "操作",
                                            width: 100,
                                            formatter: function(name){
                                                return `<input type="radio" name="currentSel" id="${name}" value="${name}">`;
                                            }
                                        }
                                    ]
                                });
                                $("#CleaningResultsTable").bootstrapTable("hideLoading");
                            },1000);
                            $("#searchTblBtn").unbind().bind("click", function(){
                                $("#tblTable").bootstrapTable("refresh");
                            });
                            // 点击行选中radio
                            $("#tblTable").on("click", "tr", function(){
                                $(this).children().eq(3).children().attr("checked",true);;
                            })
                        },
                        onSureClick: function(){
                            var tblName = $("input[name='currentSel']:checked").val();
                            if(tblName !== undefined){
                                $.ajax({
                                   type: "GET",
                                   dataType: "json",
                                   url: wwwroot + "/dataGovernance/fieldInfo",
                                   success: function(res){
                                       var data = res.rows;
                                       var html = "";
                                       for(var i = 0; i < data.length; i++){
                                           html += '<tr><td>'+data[i].field+'</td><td>'+data[i].desc+'</td><td>'+data[i].type+'</td>' + '<td>'+data[i].len+'</td></tr>';
                                       }
                                       $('#tblFieldTable').empty();
                                       $('#tblFieldTable').append($(html));
                                       $(".nodata").hide();
                                   }
                                })
                                var currentEle = self.data.currentEle;
                                var positionX = currentEle.model.attributes.position.x;
                                var positionY = currentEle.model.attributes.position.y;
                                var eleArrs = graph.getCells();
                                var id = currentEle.model.id;
                                // 由于拖动会使元素初始化，所以此处需要将原位置的元素的删除再创建新元素
                                for(var i = 0; i < eleArrs.length; i++){
                                    if(eleArrs[i].id == id){
                                        graph.removeCells(eleArrs[i]);
                                    }
                                }
                                config.template = tableHtml.join('');
                                var tblEllipse = new joint.shapes.html.Element({
                                    position: { x: positionX, y: positionY },
                                    size: { width: 152, height: 71 },
                                    label: '表',
                                    span: tblName
                                });
                                joint.shapes.html.ElementView = joint.dia.ElementView.extend(config);
                                tblEllipse.addTo(graph);
                                YunpiDialog.close();
                            }else{
                                YunpiAlert.error("请选择清洗表！");
                            }
                        }
                    })
                }else{
                    YunpiDialog.open({
                        title: "选择清洗字段",
                        url: "selectField.html",
                        size: 1200,
                        sureBtn: true,
                        afterWinOpen: function(){
                            $("#fieldSel").css("width", "initial");
                            $("#fieldSel").css("display", "initial");
                            $.ajax({
                                type: "GET",
                                dataType: "json",
                                url: wwwroot + '/cleanRule/cleanRuleList',
                                success: function(res){
                                    $.each(res.rows, function(i, item){
                                        var rName = item.ruleName;
                                        var desc = item.ruleDesc;
                                        $("div.customRules ul").append('<li class="cRulesContent" des-data=' + desc +'>' + rName + '</li>');
                                        $("div.customRules li").draggable({
                                            helper: "clone",
                                            scope: "drop"
                                        });
                                    })
                                }
                            })
                            // 备注
                            var remarkArr = ["去除两边的空格。", "如果字段无值，给字段添加默认值，null、“null”和空字符串均视为无值。", "\n" +
                            "去除字段数据的前缀，如果没有匹配到前缀则不变更，如果有多个重复的前缀，根据配置确定是否循环去除。", "去除字段数据的后缀，如果没有匹配到后缀则不变更，如果有多个重复的后缀，根据配置确定是否循环去除。", "给数据加前缀，如果已有指定的前缀，根据配置确定是否重复添加。", "给数据加后缀，如果已有指定的后缀，根据配置确定是否重复添加。", "给数据补全长度，长度超过指定值时不处理。", "\n" +
                            "使用子典表进行字典值替换。", "使用Map进行字典值替换,Map用\"key:value\"数据格式进行输入，key为字段匹配值，value为替换目标值。多组映射之间用英文逗号分隔。", "\n" +
                            "从该字段拆分出一个新的字段值，新创建字段用于存储该值。", "\n" +
                            "使用正则表达式匹配字段值信息，将匹配到的字符（串）替换为指定的字符串，如果没有指定字符串则替换为空字符串。", "\n" +
                            "截取字符串的指定位置字符，需要配置起始截取位置索引和截取长度，起始索引位置默认为0，当指定长度不足时，取自指定起始索引起至结束位置的所有字符。", "适用于字符串，对日期格式的字符串进行格式转换，需要指定解析格式和转换目标格式。", "转换数据类型，需要指定转换的目标类型。如果是日期（时间）类型转换为字符串类型，需要指定转换的格式。"];
                            $("div.defaultRules>ul").on("click", "li", function(){
                                var i = $(this).index();
                                $("#remark").val(remarkArr[i]);
                            });
                            $("div.customRules>ul").on("click", "li", function(){
                                $("#remark").val($(this).attr("des-data"));
                            });
                            // 拖拽规则
                            $("div.defaultRules>ul>li.rulesContent").draggable({
                                helper: "clone",
                                scope: "drop"
                            });
                            // 拖拽到规则配置
                            $("div.configContent").droppable({
                                scope: "drop",
                                drop: function(e, ui){
                                    var text = $(ui.helper[0]).html();
                                    var html = "";
                                    switch (text) {
                                        case "两边去空格":
                                            html += "";
                                            break;
                                        case "添加默认值":
                                            html += '<input type="text" class="form-controls">';
                                            break;
                                        case "去前缀":
                                            html += '<input type="text" class="form-controls"><label>重复去除</label><input name="isReapeat" type="radio" id="isRepeat"><label for="isRepeat">是</label><input name="isReapeat" type="radio" id="noRepeat"><label for="noRepeat">否</label>';
                                            break;
                                        case "去后缀":
                                            html += "";
                                            break;
                                        case "加前缀":
                                            html += "";
                                            break;
                                        case "加后缀":
                                            html += '<input type="text" class="form-controls"><label>已有前缀</label><input name="isReapeatAdd" type="radio" id="isRepeatAdd"><label for="isRepeatAdd">重复添加</label><input name="isReapeatAdd" type="radio" id="noRepeatAdd"><label for="noRepeatAdd">不重复添加</label>';
                                            break;
                                        case "长度补全":
                                            html += '<input type="text" class="form-controls"><label>位</label><label>填补位</label><input type="radio" name="fillTo" id="before"><label for="before">前</label><input type="radio" name="fillTo" id="after"><label for="after">后</label><label>填补字符：</label><input type="text" class="form-controls">';
                                            break;
                                        case "字典转换":
                                            html += '<select class="form-controls"><option value="1">xx系统字典</option></select><label>匹配字段：</label><select class="form-controls"><option value="1">字典编码</option></select><label>取值字段：</label><select class="form-controls"><option value="1">字典值</option></select>';
                                            break;
                                        case "Map映射转换":
                                            html += '<input type="text" class="form-controls" style="width: 75%">';
                                            break;
                                        case "字符串拆分":
                                            html += '<label>新字段编码</label><input type="text" class="form-controls"><label>描述</label><input type="text" class="form-controls"><label>拆分起始索引</label><input style="width: 7%" type="text" class="form-controls"><label>截取长度</label><input style="width: 7%" type="text" class="form-controls">';
                                            break;
                                        case "正则替换":
                                            html += '<label>正则表达式</label><input type="text" class="form-controls"><label>替换为</label><input type="text" class="form-controls">';
                                            break;
                                        case "字符串截取":
                                            html += '<label>起始索引</label><input type="text" class="form-controls"><label>截取长度</label><input type="text" class="form-controls">';
                                            break;
                                        case "日期字符串转换":
                                            html += '<label>解析格式：</label><select class="form-controls" id=""><option value="1">yy-M-d hh:m:s</option></select><label>目标格式</label><select class="form-controls" id=""><option value="1">yyyy-MM-dd hh:mm</option></select>';
                                            break;
                                        case "数据类型转换":
                                            html += "";
                                            break;
                                    }
                                    var result = `<div class="alert alert-default alert-dismissible" role="alert">
                                                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                      </button>
                                                      <strong>${text}</strong>
                                                      <span>${html}</span>
                                                  </div>`;
                                    // 去重
                                    var name = $("div.configContent").children();
                                    var nameArr = [];
                                    for(var i = 0; i < name.length; i++){
                                        nameArr.push($(name[i]).find("strong").html());
                                    }
                                    if(nameArr.indexOf(text) == -1){
                                        $(result).appendTo($("div.configContent"));
                                    }else{
                                        YunpiAlert.error("请勿重复拖拽！");
                                    }
                                }
                            })
                        },
                        onSureClick: function(){
                            var val = $("#fieldSel").val();
                            var childList = $(".configContent").children();
                            var rulesList = [];
                            for(var i = 0; i<childList.length;i++){
                                rulesList.push($(childList[i]).find("strong").html());
                            }
                            if(rulesList.length!==0){
                                var currentEle = self.data.currentEle;
                                var positionX = currentEle.model.attributes.position.x;
                                var positionY = currentEle.model.attributes.position.y;
                                var eleArrs = graph.getCells();
                                var id = currentEle.model.id;
                                // 由于拖动会使元素初始化，所以此处需要将原位置的元素的删除再创建新元素
                                for(var i = 0; i < eleArrs.length; i++){
                                    if(eleArrs[i].id == id){
                                        graph.removeCells(eleArrs[i]);
                                    }
                                }
                                config.template = addFieldHtml.join('');
                                var fieldEllipse = new joint.shapes.html.Element({
                                    position: { x: positionX, y: positionY },
                                    size: { width: 152, height: 107 },
                                    label: val,
                                    span: rulesList.join(",")
                                });
                                joint.shapes.html.ElementView = joint.dia.ElementView.extend(config);
                                fieldEllipse.addTo(graph);
                                YunpiDialog.close();
                                YunpiAlert.success("清洗成功！");
                            }else{
                                YunpiAlert.error("请完善清洗规则！");
                            }
                        }
                    })
                }
            }
        });
        // 箭头切换
        self.obj.arrows.unbind().bind("click", function(){
            isLink = !isLink;
            if(isLink){
                $(this).removeClass("arrowsNosel").addClass("arrowsSel");
            }else{
                $(this).removeClass("arrowsSel").addClass("arrowsNosel");
            }
        });
        // 画布元素点击事件——连线
        paper.on('cell:pointerclick',function(e, d) {
            if($("#contextMenus")){
                $("#contextMenus").hide();
            }
            if(isLink){
                var currentTbl = $(e.$box).children(":first").html();
                if(currentTbl !== "(空)"){
                    var link = new joint.shapes.standard.Link();
                    link.connector('rounded');
                    /*link.router('orthogonal'); 直线线型 */
                    link.attr({
                        line: {
                            stroke: 'gray',
                            strokeWidth: 4,
                            strokeDasharray: '6 2',
                            targetMarker: {
                                'type': 'image',
                                'xlink:href': 'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
                                'width': 24,
                                'height': 24,
                                'y': -12
                            }
                        }
                    });
                    var eleArr = graph.getElements();  //  返回画布中所有的元素
                    //var eleArr = graph.getSources(); //  返回图中所有根节点的数组
                    var id = e.model.id;
                    for(var i = 0; i < eleArr.length; i++){
                        if(eleArr[i].id == id){
                            testArr.push(eleArr[i]);
                        }
                    }
                    if(testArr.length > 1){
                        if(testArr[0] == testArr[1]){
                            // YunpiAlert.error("请选择两个不同的节点");
                        }else{
                            link.source(testArr[0]);
                            link.target(testArr[1]);
                            link.addTo(graph);
                        }
                        testArr = [];
                    }
                }else{
                    YunpiAlert.error("请选择表或者字段！");
                }
            }
        });
        // 画布空白点击事件
        paper.on("blank:pointerclick", function(){
            if($("#contextMenus")){
                $("#contextMenus").hide();
            }
        });
        // 画布元素移动事件
        paper.on("cell:pointermove", function(e, i){
            if($("#contextMenus")){
                $("#contextMenus").hide();
            };
        });
        $("#goBackBtn").unbind().bind("click", function(){
            graph.clear();
            $('#tblFieldTable').empty();
            isLink = false;
            self.obj.arrows.children().css({
                backgroundColor: "#666",
                borderLeftColor: "#666"
            });
            self.obj.pointer.css("background", 'url("/resources/img/dataGovernance/pointer.png") no-repeat');
            $("#addPage").hide();
            $("#tablePage").css("opacity", 1);
            $("#tablePage").show();
        });
        $("#saveBtn").unbind().bind("click", function(){
            //graph.clear(); // 清除画布
            YunpiAlert.success("清洗策略添加成功！");
            graph.clear();
            $('#tblFieldTable').empty();
            $("#addPage").hide();
            $("#tablePage").css("opacity", 1);
            $("#tablePage").show();
        });
    },
    viewById: function(id){
        YunpiDialog.open({
            title: "查看清洗策略",
            url: "viewCleanStrategy.html",
            size: 1000,
            sureBtn: false,
            afterWinOpen: function(){
                var graph = new joint.dia.Graph();
                var paper = new joint.dia.Paper({
                    el: $('#viewPaint'),
                    model: graph,
                    width: 978,
                    height: 600,
                    gridSize: 1,
                });
                var tableHtml = [
                    '<div class="html-element tableModel">',
                    '<label></label>',
                    '<span></span>',
                    '</div>'
                ];
                var addFieldHtml = [
                    '<div class="html-element addFieldModel">',
                    '<label></label>',
                    '<span></span>',
                    '</div>'
                ];
                var config = {
                    initialize: function () {    //初始化
                        _.bindAll(this, 'updateBox');
                        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
                        this.$box = $(_.template(this.template)());
                        this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
                        this.model.on('change', this.updateBox, this);
                        this.model.on('remove', this.removeBox, this);
                        this.updateBox();
                    },
                    render: function () {
                        joint.dia.ElementView.prototype.render.apply(this, arguments);
                        this.paper.$el.prepend(this.$box);
                        this.updateBox();
                        return this;
                    },
                    updateBox: function () {
                        var bbox = this.model.getBBox();
                        this.$box.find('label').text(this.model.get('label'));
                        this.$box.find('span').text(this.model.get('span'));  //将从select获取的元素回显到span
                        this.$box.css({
                            width: bbox.width,
                            height: bbox.height,
                            left: bbox.x,
                            top: bbox.y,
                            transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
                        });
                    },
                    removeBox: function (evt) {
                        this.$box.remove();
                    }
                };
                joint.shapes.html = {};
                // 自定义画布中初始化的html元素
                joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
                    defaults: joint.util.deepSupplement({
                        type: 'html.Element',
                        attrs: {
                            rect: { stroke: 'none', 'fill-opacity': 0 }
                        }
                    }, joint.shapes.basic.Rect.prototype.defaults)
                });
                config.template = tableHtml.join('');
                var tblEllipse = new joint.shapes.html.Element({
                    position: { x: 800, y: 300},
                    size: { width: 152, height: 71 },
                    label: '表',
                    span: 'table_test'
                });
                joint.shapes.html.ElementView = joint.dia.ElementView.extend(config);
                tblEllipse.addTo(graph);

                config.template = addFieldHtml.join('');
                var fieldBox = new joint.shapes.html.Element({
                    position: { x: 400, y: 100 },
                    size: { width: 152, height: 71 },
                    label: 'field_test',
                    span: '两边去空格, 添加默认值'
                });
                joint.shapes.html.ElementView = joint.dia.ElementView.extend(config);
                fieldBox.addTo(graph);

                config.template = addFieldHtml.join('');
                var fieldBoxs = new joint.shapes.html.Element({
                    position: { x: 160, y: 330 },
                    size: { width: 152, height: 71 },
                    label: 'field_test',
                    span: '清洗规则aa, 清洗规则bb'
                });
                joint.shapes.html.ElementView = joint.dia.ElementView.extend(config);
                fieldBoxs.addTo(graph);

                var link = new joint.shapes.standard.Link();
                link.connector('rounded');
                link.attr({
                    line: {
                        stroke: 'gray',
                        strokeWidth: 4,
                        strokeDasharray: '6 2',
                        targetMarker: {
                            'type': 'image',
                            'xlink:href': 'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
                            'width': 24,
                            'height': 24,
                            'y': -12
                        }
                    }
                });
                link.source(tblEllipse);
                link.target(fieldBox);
                link.addTo(graph);

                var links = new joint.shapes.standard.Link();
                links.connector('rounded');
                links.attr({
                    line: {
                        stroke: 'gray',
                        strokeWidth: 4,
                        strokeDasharray: '6 2',
                        targetMarker: {
                            'type': 'image',
                            'xlink:href': 'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
                            'width': 24,
                            'height': 24,
                            'y': -12
                        }
                    }
                });
                links.source(tblEllipse);
                links.target(fieldBoxs);
                links.addTo(graph);
            }
        })
    },
    useById: function(id){
        var self = this;
        // TODO 启用
        if(Math.random()>0.5){
            YunpiAlert.success("启用成功！");
            self.obj.cleanStrategyTable.bootstrapTable("refresh");
        }else{
            YunpiAlert.error("启用失败！");
        }
    },
    viewData:function(id,dicName){
        $.ajax({
            type: 'get',
            dataType: 'json',
            async: false,
            url: wwwroot + "/Obtain/ObtainHeader/"+id,
            success: function (responseData) {
                if (responseData.code == "code_200") {
                    YunpiDialog.open({
                        title:"查看清洗策略数据",
                        url:"CleaningResults.html",
                        sureBtn:false,
                        size:1200,
                        afterWinOpen:function(){//打开页面时赋值
                                $("#CleanResultsName").val(dicName);
                                $("#CleaningResultsTable").bootstrapTable({data:[]});
                                $("#CleaningResultsTable").bootstrapTable("showLoading");
                                setTimeout(function(){
                                    $("#CleaningResultsTable").bootstrapTable('destroy');
                                    $("#CleaningResultsTable").bootstrapTable({
                                        method : 'POST',
                                        url: wwwroot + '/cleanRule/TableData',
                                        // toolbar: "#toolbar",
                                        height:$(window).height()-340,
                                        striped: true, // 是否显示行间隔色
                                        uniqueId: "id",
                                        pageSize: 20,
                                        pageList: [20],
                                        pagination: true, // 是否分页
                                        sortable: false, // 是否启用排序
                                        sidePagination: "server",
                                        onlyInfoPagination:false,
                                        paginationPreText: "上一页",
                                        paginationNextText: "下一页",
                                        columns:responseData.columns
                                    });
                                    $("#CleaningResultsTable").bootstrapTable("hideLoading");
                                },1000);
                        },
                        beforeWinClose:function(){//关闭时清空form
                            // $('#dicViewForm').clearform();
                        }
                    });
                }else{
                    // YunpiAlert.error(responseData.msg);
                }
            },
            error: function () {
                YunpiAlert.error('查询失败，请重试！');
            }
        });
    },
    deleteById: function(id){
        var self = this;
        YunpiConform.open("您确定要删除该清洗策略吗？", null, function(){
            YunpiAlert.success("删除成功！");
            self.obj.cleanStrategyTable.bootstrapTable("refresh");
        })
    }
};
$(function(){
    cleanStrategy.initCleanStrategy();
})