/**
 * 主页面js
 */
//$package("index");
index={
	/**
	 * 初始化方法
	 */
	initIndexPage:function() {
		this.obj = {
            cardContainer: $('.cardContainer'),// 卡片
            helpBtn: $('#helpBtn'),
            yunpiThemes: $('#yunpiThemes')
        };
        this.initEvent();//index页面事件初始化
        this.initDom();//页面元素初始化
	},
	/**
	* 页面事件绑定
	*/
	initEvent:function() {
        var self = this;
        // 跳转
        self.obj.cardContainer.on('click', '.card', function () {
            var page = this.className.split(" ")[1];
            window.location.href = wwwroot+ "/tpl/" + page + '/home.html';
        });
        // 帮助
        self.obj.helpBtn.unbind().bind('click', function () {
            showHelp("index.png");
        });
        //添加主题选择事件
        self.obj.yunpiThemes.unbind().bind('change', function () {
            var itemTheme = $(this).val();
            $.cookie('theme',itemTheme);
            YunpiAlert.info("选择主题"+itemTheme);
            //TODO 将主题修改为cookie中读取出的主题
        });
    },

    /**
     * 页面元素初始化
     */
    initDom : function(){
	    var self = this;
        var theme = $.cookie('theme');
        if(!isNull(theme)){
            self.obj.yunpiThemes.val(theme);
            //TODO 将主题修改为cookie中读取出的主题
        }
    }
};
$(function(){
	index.initIndexPage();
});