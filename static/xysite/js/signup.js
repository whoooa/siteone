$(document).ready(function () {
    $('form#signup').data("doing", "0");
    $("#sendMobileCode").bind("click", codeVerify);

    // 去除默认的验证码输入框
    $("#captcha").children("#id_captcha_1").remove();
    $(".captcha").click(function () {
        $.getJSON("/captcha/refresh", function (json) {
            $('#id_captcha_0').attr("value", json.key);
            $(".captcha").attr("src", json.image_url);
        });
    });
});

// 验证码通信和确认的全局变量
var InterValObj; //timer变量，控制时间
var count = 120; //间隔函数，1秒执行
var curCount; //当前剩余秒数

// 页面提前增加单个正则验证规则
(function ($) {
    if ($.AMUI && $.AMUI.validator) {
        $.AMUI.validator.patterns.phone = /^1(3|4|5|7|8){1}\d{9}$/;
        $.AMUI.validator.patterns.username = /^[a-zA-Z0-9\u4e00-\u9fa5@\._-]{2,16}$/;
        $.AMUI.validator.patterns.password = /^\S{6,16}$/;
    }
})(window.jQuery);

// 注册表单验证主函数
$(function () {
    var signform = $("#signup");
    var $tooltip = $('<div id="vld-tooltip">提示信息！</div>');
    $tooltip.appendTo(document.body);

    signform.validator({
        validateOnSubmit: true,
        // 下列元素触发以下事件时会调用验证程序
        keyboardEvents: 'change',
        validate: function (validity) {
            var mkvf = function () {
                validity.valid = false;
            };

            // 验证用户名是否已被注册
            if (validity.valid && $(validity.field).is('#id_username')) {
                return $.ajax({
                    url: '/accounts/judgeusername/',
                    type: "GET",
                    data: {username: $(validity.field).val()},
                    cache: false,
                    dataType: 'json'
                }).then(function (data) {
                    if (data.tExist) {
                        mkvf();
                        $tooltip.text("该用户名/昵称已被使用").show().css({
                            left: $(validity.field).offset().left + 10,
                            top: $(validity.field).offset().top + $(validity.field).outerHeight() + 10
                        });
                    }
                    return validity;
                }, function () {
                    return validity;
                });
            }

            // 验证手机号是否已被注册
            if (validity.valid && $(validity.field).is('#id_phone')) {
                return $.ajax({
                    url: '/accounts/judgePhone/',
                    type: "GET",
                    data: {telephone: $(validity.field).val()},
                    cache: false,
                    dataType: 'json'
                }).then(function (data) {
                    if (data.tExist) {
                        mkvf();
                        $tooltip.text("该手机号已被注册").show().css({
                            left: $(validity.field).offset().left + 10,
                            top: $(validity.field).offset().top + $(validity.field).outerHeight() + 10
                        });
                    }
                    return validity;
                }, function () {
                    return validity;
                });
            }

            // 验证短信验证码是否正确
            if (validity.valid && $(validity.field).is('#id_code')) {
                // 确认已发送短信
                if ((typeof curCount != 'undefined')) {
                    return $.ajax({
                        url: '/accounts/judgesmscode/?phone=' + document.getElementById("id_phone").value + "&code=" + document.getElementById("id_code").value,
                        type: "GET",
                        cache: false,
                        dataType: 'json'
                    }).then(function (data) {
                        if (data.status != 1) {
                            mkvf();
                            $tooltip.text(data.msg).show().css({
                                left: $(validity.field).offset().left + 10,
                                top: $(validity.field).offset().top + $(validity.field).outerHeight() + 10
                            });
                        }
                        return validity;
                    }, function () {
                        return validity;
                    });
                }
                // 如果还未发送短信
                else {
                    mkvf();
                    return validity;
                }
            }
        }
    });

    var sign_validator = signform.data('amui.validator');

    signform.on('focusin focusout', '.am-form-error input, .am-form-error select, .am-form-error textarea', function (e) {
        if (e.type === 'focusin') {
            var $this = $(this);
            var offset = $this.offset();
            var msg = $this.data('validationMessage') || sign_validator.getValidationMessage($this.data('validity'));

            $tooltip.text(msg).show().css({
                left: offset.left + 10,
                top: offset.top + $(this).outerHeight() + 10
            });
        } else {
            $tooltip.hide();
        }
    });

    signform.on('focusin focusout', '.am-form-success input, .am-form-success select, .am-form-success textarea', function (e) {
        $tooltip.hide();
    });

    var random_code_form = $("#random_code_form");

    random_code_form.validator({
        validateOnSubmit: true,
        keyboardEvents: 'change',
        validate: function (validity) {
            var mkvf = function () {
                validity.valid = false;
            };

            // 验证验证码是否正确
            if (validity.valid && $(validity.field).is('#id_captcha_1')) {
                return $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: '/accounts/randomCodeVerify/',
                    data: "captcha_1=" + document.getElementById("id_captcha_1").value + "&captcha_0=" + document.getElementById("id_captcha_0").value,
                    cache: false
                }).then(function (data) {
                    if (data.random_code_return != 1) {
                        mkvf();
                        $tooltip.text("验证码错误，请重试，如超时请刷新").show().css({
                            left: $(validity.field).offset().left + 10,
                            top: $(validity.field).offset().top + $(validity.field).outerHeight() + 10
                        });
                    }
                    else {
                        $('#id_captcha_1').attr("disabled", "true");
                        $(".captcha").unbind("click");
                    }
                    return validity;
                }, function () {
                    return validity;
                });
            }
        }
    });

    var random_code_validator = random_code_form.data('amui.validator');

    random_code_form.on('focusin focusout', '.am-form-error input', function (e) {
        if (e.type === 'focusin') {
            var $this = $(this);
            var offset = $this.offset();
            var msg = $this.data('validationMessage') || random_code_validator.getValidationMessage($this.data('validity'));

            $tooltip.text(msg).show().css({
                left: offset.left + 10,
                top: offset.top + $(this).outerHeight() + 10
            });
        } else {
            $tooltip.hide();
        }
    });

    random_code_form.on('focusin focusout', '.am-form-success input', function (e) {
        $tooltip.hide();
    });
});

function codeVerify() {
    if (!$(".am-form-group.user-phone").hasClass("am-form-success")) {
        $("#id_phone").focus().trigger("change");
    }
    else if (!$(".am-form-group.random_code_verification").hasClass("am-form-success")) {
        $("#id_captcha_1").focus().trigger("change");
    }
    else {
        curCount = count;
        $("#sendMobileCode").unbind("click");
        $("#sendMobileCode").text("重新发送" + "（" + curCount + "）");
        InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
        //向后台发送处理数据
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/accounts/sendCodeVerify/',
            data: "telephone=" + $("#id_phone").val(),
            success: function (msg) {
                $("#id_code").focus().trigger("change");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            }
        });
    }
}

//timer处理函数
function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj); //停止计时器
        $("#sendMobileCode").bind("click", codeVerify).text("重新发送验证码");
    }
    else {
        curCount--;
        $("#sendMobileCode").text("重新发送" + "（" + curCount + "）");
    }
}

// 表单提交主函数
$('form#signup').submit(function () {
    if ($(this).data("doing") == "0") {
        if ($(".am-form-group.user-phone").hasClass("am-form-success") && $(".am-form-group.verification").hasClass("am-form-success")
            && $(".am-form-group.user-pass1").hasClass("am-form-success") && $(".am-form-group.user-pass2").hasClass("am-form-success")) {
            $('form#signup').data("doing", "1");
            var the_url = '/accounts/signup/';
            $.ajax({
                type: 'POST',
                url: the_url,
                data: $(this).serialize(),
                success: function (response) {
                    $('form#signup').data("doing", "0");
                    if (response['status'] == 1) {
                        $('#signup_sucess').modal({width: 520, closeViaDimmer: false});
                        setTimeout('location.href = "/accounts/login/"', 2500);
                    }
                    else {
                        var $tooltip = $('<div id="vld-tooltip">提示信息！</div>');
                        $tooltip.appendTo(document.body);
                        if (response['status']['phone']) {
                            $tooltip.text(response['status']['phone']).show().css({
                                left: $("#id_phone").offset().left + 10,
                                top: $("#id_phone").offset().top + $("#id_phone").outerHeight() + 10
                            });
                        }
                        else if (response['status']['code']) {
                            $tooltip.text(response['status']['code']).show().css({
                                left: $("#id_code").offset().left + 10,
                                top: $("#id_code").offset().top + $("#id_code").outerHeight() + 10
                            });
                        }
                        else if (response['status']['username']) {
                            $tooltip.text(response['status']['username']).show().css({
                                left: $("#id_username").offset().left + 10,
                                top: $("#id_username").offset().top + $("#id_username").outerHeight() + 10
                            });
                        }
                        else if (response['status']['password2']) {
                            $tooltip.text(response['status']['password2']).show().css({
                                left: $("#passwordRepeat").offset().left + 10,
                                top: $("#passwordRepeat").offset().top + $("#passwordRepeat").outerHeight() + 10
                            });
                        }
                        else if (response['status']) {
                            $tooltip.text(response['status']).show().css({
                                left: $("#passwordRepeat").offset().left + 10,
                                top: $("#passwordRepeat").offset().top + $("#passwordRepeat").outerHeight() + 10
                            });
                        }
                        $("#signup").on('focusin focusout', '.am-form-success input, .am-form-success select, .am-form-success textarea', function (e) {
                            $tooltip.hide();
                        });
                    }
                },
                error: function (response) {
                    $('form#signup').data("doing", "0");
                    alert("网络异常");
                }
            });
            return false;
        }
        else {
            return false;
        }
    } else {
        return false;
    }
});
