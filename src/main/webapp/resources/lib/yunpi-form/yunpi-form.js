/**
 * Created by lsk on 2017/4/21.
 * jquery操作form的扩展方法定义
 */

/**
 * 获取form中的所有参数值
 * @param formObj form的jQuery对象
 * @returns obj form数据对象
 */
(function($){
    //获取form值
    $.fn.getform = function(){
        var obj = {};
        var values = $(this).serializeArray();
        $.each(values,function(index,item){
            obj[item.name]= item.value;
        });
        return obj;
    };

    //form验证
    $.fn.formVerify = function(){
        var key,tagName,required,regexVal,regexStr;
        var verify = true;
        var values = $(this).serializeArray();
        $(this).find('.form-feedback').remove();
        $.each(values,function(i,item){
            key = item.name;
            $("[name='"+key+"'],[name='"+key+"[]']").each(function(){
                tagName = $(this)[0].tagName;
                required = $(this).attr('required');
                /*$(this).next().remove();*/
                //参数必须要有，否则验证不通过
                if(required && required!='false' && (!item.value || item.value=="") && $(this).attr('type') != 'hidden'){
                    if(tagName.toLowerCase() == "select" && (!($(this).val()) || $(this).val()=="")){
                        $(this).closest(".input-group").append('<span class="form-feedback">请选择</span>');
                        verify=false;
                    }else{
                        $(this).closest(".input-group").append('<span class="form-feedback">不能为空</span>');
                        verify=false;
                    }
                }else{
                    regexVal = $(this).attr('regex');
                    if(regexVal && regexVal!=''){
                        //如果是以“same-as,XXX”定义的，则必须与XXX字段保持一致，否则进行正则表达式校验
                        if(regexVal.length <= 8 || regexVal.substr(0,8)!='same-as,'){//
                            regexStr = regexVerify[regexVal];
                            if(!regexStr || regexStr==''){
                                regexStr = regexVal;
                            }

                            var regex = new RegExp(regexStr);
                            if(!regex.test(item.value) && $(this).attr('type') != 'hidden'){
                                $(this).closest(".input-group").append('<span class="form-feedback">格式不正确</span>');
                                verify = false;
                            }
                        }else{
                            var str = regexVal.substr(8);
                            $.each(values,function(i,xatrr){
                                if(xatrr.name==str && item.value!=xatrr.value){
                                    verify = false;
                                }
                            });
                            if(!verify){
                                $(this).closest(".input-group").append('<span class="form-feedback">输入不一致</span>');
                            }
                        }
                    }
                }
            });
        });

        //失去焦点验证
        $(this).find('input,textarea,select').blur(function(){
            $(this).siblings('.form-feedback').remove();
            if($(this).attr('required') && $(this).attr('required') == 'required' && (!$(this).val() || $(this).val() == "") && $(this).attr('type') != 'hidden') {
                tagName = $(this)[0].tagName;
                if(tagName.toLowerCase() == "select" && (!($(this).val()) || $(this).val()=="")){
                    $(this).closest(".input-group").append('<span class="form-feedback">请选择</span>');
                    verify=false;
                }else{
                    $(this).closest(".input-group").append('<span class="form-feedback">不能为空</span>');
                    verify=false;
                }
            }else{
                regexVal = $(this).attr('regex');
                if(regexVal && regexVal!='') {
                    //如果是以“same-as,XXX”定义的，则必须与XXX字段保持一致，否则进行正则表达式校验
                    if (regexVal.length <= 8 || regexVal.substr(0, 8) != 'same-as,') {
                        regexStr = regexVerify[regexVal];
                        if (!regexStr || regexStr == '') {
                            regexStr = regexVal;
                        }

                        var regex = new RegExp(regexStr);
                        if (!regex.test($(this).val()) && $(this).attr('type') != 'hidden') {
                            $(this).closest(".input-group").append('<span class="form-feedback">格式不正确</span>');
                            verify = false;
                        }
                    }else{
                        var str = regexVal.substr(8);
                        if($(this).val() != $('input[name="'+ str +'"]').val()){
                            verify = false;
                            $(this).closest(".input-group").append('<span class="form-feedback">输入不一致</span>');
                        }
                    }
                }
            }
        });

        return verify;
    };

    /**
     * 验证单个字段信息用form对象调用，传入单个表单对象做为参数
     * @param $_obj
     * @returns {boolean}
     */
    $.fn.verifyOnce = function($_obj){
        var tagName,regexVal,regexStr;
        var verify = true;
        $_obj.siblings('.form-feedback').remove();
        if($_obj.attr('required') && $_obj.attr('required') == 'required' && (!$_obj.val() || $_obj.val() == "") && $_obj.attr('type') != 'hidden') {
            tagName = $_obj[0].tagName;
            if(tagName.toLowerCase() == "select" && (!($_obj.val()) || $_obj.val()=="")){
                $_obj.closest(".input-group").append('<span class="form-feedback">请选择</span>');
                verify=false;
            }else{
                $_obj.closest(".input-group").append('<span class="form-feedback">不能为空</span>');
                verify=false;
            }
        }else{
            regexVal = $_obj.attr('regex');
            if(regexVal && regexVal!='') {
                //如果是以“same-as,XXX”定义的，则必须与XXX字段保持一致，否则进行正则表达式校验
                if (regexVal.length <= 8 || regexVal.substr(0, 8) != 'same-as,') {
                    var regexStr = regexVerify[regexVal];
                    if (!regexStr || regexStr == '') {
                        regexStr = regexVal;
                    }

                    var regex = new RegExp(regexStr);
                    if (!regex.test($_obj.val()) && $_obj.attr('type') != 'hidden') {
                        $_obj.closest(".input-group").append('<span class="form-feedback">格式不正确</span>');
                        verify = false;
                    }
                }else{
                    var str = regexVal.substr(8);
                    if($_obj.val() != $('input[name="'+ str +'"]').val()){
                        verify = false;
                        $_obj.closest(".input-group").append('<span class="form-feedback">输入不一致</span>');
                    }
                }
            }
        }

        $_obj.blur(function(){
            $(this).siblings('.form-feedback').remove();
            if($(this).attr('required') && $(this).attr('required') == 'required' && (!$(this).val() || $(this).val() == "") && $(this).attr('type') != 'hidden') {
                tagName = $(this)[0].tagName;
                if(tagName.toLowerCase() == "select" && (!($(this).val()) || $(this).val()=="")){
                    $(this).closest(".input-group").append('<span class="form-feedback">请选择</span>');
                    verify=false;
                }else{
                    $(this).closest(".input-group").append('<span class="form-feedback">不能为空</span>');
                    verify=false;
                }
            }else{
                regexVal = $(this).attr('regex');
                if(regexVal && regexVal!='') {
                    //如果是以“same-as,XXX”定义的，则必须与XXX字段保持一致，否则进行正则表达式校验
                    if (regexVal.length <= 8 || regexVal.substr(0, 8) != 'same-as,') {
                        regexStr = regexVerify[regexVal];
                        if (!regexStr || regexStr == '') {
                            regexStr = regexVal;
                        }

                        var regex = new RegExp(regexStr);
                        if (!regex.test($(this).val()) && $(this).attr('type') != 'hidden') {
                            $(this).closest(".input-group").append('<span class="form-feedback">格式不正确</span>');
                            verify = false;
                        }
                    }else{
                        var str = regexVal.substr(8);
                        if($(this).val() != $('input[name="'+ str +'"]').val()){
                            verify = false;
                            $(this).closest(".input-group").append('<span class="form-feedback">输入不一致</span>');
                        }
                    }
                }
            }
        });

        return verify;
    };

    //将对象值根据属性匹配form元素的name设置到form中
    $.fn.setform = function(obj){
        var key,value,tagName,type,arr;
        for(x in obj){
            key = x;
            value = obj[x];
            $("[name='"+key+"'],[name='"+key+"[]']").each(function(){
                tagName = $(this)[0].tagName;
                type = $(this).attr('type');
                if(tagName=='INPUT'){
                    if(type=='radio'){
                        $(this).attr('checked',$(this).val()==value);
                    }else if(type=='checkbox'){
                        arr = value.split(',');
                        for(var i =0;i<arr.length;i++){
                            if($(this).val()==arr[i]){
                                $(this).attr('checked',true);
                                break;
                            }
                        }
                    }else{
                        $(this).val(value);
                    }
                }else if(tagName=='SELECT' || tagName=='TEXTAREA'){
                    $(this).val(value);
                }
            });
        }
    };

    //清除表单数据
    $.fn.clearform = function() {
        $(this).find('input').val('');
        $(this).find('select').val('');
        $(this).find('textarea').val('');
    };

    //传入jq数组,单个非空校验
    $.fn.someOneRequired = function(arr){
        var flag = true;
        for(var i=0;i<arr.length;i++){
            var $parent = arr[i].closest('.form-group');
            $parent.find('.form-feedback').remove();
            if(arr[i].val() == ""){
                $parent.append('<span class="form-feedback">不能为空</span>');
                flag = false;
            }
            arr[i].blur(function(){
                if($(this).val() != ""){
                    $parent.find('.form-feedback').remove();
                }
            })
        }
        return flag;
    };

})(jQuery)

regexVerify={
    ip:"^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$",  //IP地址
    intZheng:"^[0-9]*[1-9][0-9]*$",  //正整数
    intFeiFu:"^[0-9.]{1,20}$",  //非负整数
    intFeiZheng:"^((-\\d+)|(0+))$",  //非正整数（负整数+0）
    intFu:"^-[0-9]*[1-9][0-9]*$",  //负整数
    int:"^-?\\d+$",  //整数
    floatFeifu:"^\\d+(\\.\\d+)?$",  //非负浮点数（正浮点数+0）
    floatZheng:"^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$",  //正浮点数
    floatFeiZheng:"^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$",  //非正浮点数（负浮点数+0）
    floatFu:"^(-(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)))$",  //负浮点数
    float:"^(-?\\d+)(\\.\\d+)?$",  //浮点数
    azAZ:"^[A-Za-z]+$",  //由26个英文字母组成的字符串
    AZ:"^[A-Z]+$",  //由26个大写英文字母组成的字符串
    az:"^[a-z]+$",  //由26个大写英文字母组成的字符串
    azAZ09:"^[A-Za-z0-9]+$",  //数字和26个英文字母组成的字符串
    azAZ09_:"^[A-Za-z0-9]+$",  //由数字和26个英文字母及下划线组成的字符串
    email:"^\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}$",  //Email地址
    url:"^[a-zA-z]+://(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*(\\?\\S*)?$",  //url
    phone:"^1[34578]\\d{9}$",  //手机号
    id_card:"(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)",  //身份证号
    chinese:"^[\\u0391-\\uFFE5]+$",
    port:"^([0-9]|[1-9]\\d|[1-9]\\d{2}|[1-9]\\d{3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$"   //端口号
}

