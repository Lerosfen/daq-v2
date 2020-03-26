$package("realTimeLog");
realTimeLog = {
    initRealTimeLog: function(){
        this.obj = {
            realTimeLogTable: $("#realTimeLogTable"),
            searchPauseBtn: $("#searchPauseBtn")
        };
        this.data = {
            testNum: 0
        }
        this.initDom();
        this.initEvent();
    },
    initDom: function(){
        var self = this;

    },
    initTable: function(){
        var self = this;

        /*self.obj.realTimeLogTable.bootstrapTable({
            method : 'POST',
            url: wwwroot + '/logManage/realTimeLog',
            toolbar: "#toolbar",
            height:$(window).height()-100,
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
                field: 'columns',
                title: 'columns',
            }]
        })*/
    },
    initEvent: function(){
        var self = this;
        var toggle = false;
        self.obj.searchPauseBtn.unbind().bind("click", function(){
            toggle = !toggle;
            YunpiLight.open();
            setTimeout(function(){
                var logArr = [`2019-10-29 15:33:01.468  INFO 10168 --- [           main] com.yjhh.bds.BdsApp                      : Starting BdsApp on DESKTOP-M88GM0L with PID 10168 (F:\Project\yunpi\bsd_web\target\classes started by Lero in F:\Project\yunpi\bsd_web)
2019-10-29 15:33:01.472  INFO 10168 --- [           main] com.yjhh.bds.BdsApp                      : No active profile set, falling back to default profiles: default
2019-10-29 15:33:01.559  INFO 10168 --- [           main] ConfigServletWebServerApplicationContext : Refreshing org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext@619713e5: startup date [Tue Oct 29 15:33:01 CST 2019]; root of context hierarchy
2019-10-29 15:33:03.201  INFO 10168 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 80 (http)
2019-10-29 15:33:03.220  INFO 10168 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2019-10-29 15:33:03.220  INFO 10168 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet Engine: Apache Tomcat/8.5.31
2019-10-29 15:33:03.224  INFO 10168 --- [ost-startStop-1] o.a.catalina.core.AprLifecycleListener   : Loaded APR based Apache Tomcat Native library [1.2.16] using APR version [1.6.3].
2019-10-29 15:33:03.225  INFO 10168 --- [ost-startStop-1] o.a.catalina.core.AprLifecycleListener   : APR capabilities: IPv6 [true], sendfile [true], accept filters [false], random [true].
2019-10-29 15:33:03.225  INFO 10168 --- [ost-startStop-1] o.a.catalina.core.AprLifecycleListener   : APR/OpenSSL configuration: useAprConnector [false], useOpenSSL [true]
`, `2019-10-29 15:33:04.246  INFO 10168 --- [ost-startStop-1] o.a.catalina.core.AprLifecycleListener   : OpenSSL successfully initialized [OpenSSL 1.0.2m  2 Nov 2017]
2019-10-29 15:33:04.352  INFO 10168 --- [ost-startStop-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2019-10-29 15:33:04.353  INFO 10168 --- [ost-startStop-1] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 2801 ms
2019-10-29 15:33:04.450  INFO 10168 --- [ost-startStop-1] o.s.b.w.servlet.ServletRegistrationBean  : Servlet dispatcherServlet mapped to [/]
2019-10-29 15:33:04.454  INFO 10168 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'characterEncodingFilter' to: [/*]
2019-10-29 15:33:04.454  INFO 10168 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'hiddenHttpMethodFilter' to: [/*]
2019-10-29 15:33:04.454  INFO 10168 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'httpPutFormContentFilter' to: [/*]
2019-10-29 15:33:04.454  INFO 10168 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'requestContextFilter' to: [/*]
2019-10-29 15:33:04.557  INFO 10168 --- [           main] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/**/favicon.ico] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]`,  `
2019-10-29 15:33:04.716  INFO 10168 --- [           main] s.w.s.m.m.a.RequestMappingHandlerAdapter : Looking for @ControllerAdvice: org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext@619713e5: startup date [Tue Oct 29 15:33:01 CST 2019]; root of context hierarchy
2019-10-29 15:33:04.769  INFO 10168 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error]}" onto public org.springframework.http.ResponseEntity<java.util.Map<java.lang.String, java.lang.Object>> org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController.error(javax.servlet.http.HttpServletRequest)
2019-10-29 15:33:04.770  INFO 10168 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error],produces=[text/html]}" onto public org.springframework.web.servlet.ModelAndView org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController.errorHtml(javax.servlet.http.HttpServletRequest,javax.servlet.http.HttpServletResponse)
2019-10-29 15:33:04.790  INFO 10168 --- [           main] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/webjars/**] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2019-10-29 15:33:04.790  INFO 10168 --- [           main] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/**] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2019-10-29 15:33:04.826  INFO 10168 --- [           main] o.s.b.a.w.s.WelcomePageHandlerMapping    : Adding welcome page: ServletContext resource [/index.html]
2019-10-29 15:33:04.904  INFO 10168 --- [           main] o.s.j.e.a.AnnotationMBeanExporter        : Registering beans for JMX exposure on startup
2019-10-29 15:33:04.972  INFO 10168 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 80 (http) with context path ''
2019-10-29 15:33:04.978  INFO 10168 --- [           main] com.yjhh.bds.BdsApp                      : Started BdsApp in 4.136 seconds (JVM running for 5.822)
` ];
                var i = 0;
                var timer = setInterval(function(){
                    $(".logContent").empty();
                    var arr = logArr[i].replace("---", ",").split(",");
                    var html = "";
                    $.each(arr, function(index, item){
                        html += '<p>'+ item +'</p>'
                    });
                    YunpiLight.close();
                    $(".logContent").append($(html));
                    i++;
                    if(i > 2){
                        i = 0;
                    }
                    if(!toggle){
                        clearInterval(timer);
                    }
                }, 1000);
            }, 2000);
        })
    }
}
$(function(){
    realTimeLog.initRealTimeLog();
})