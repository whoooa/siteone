var pR = function () {
    function a() {
        var a = window.particlesJS;
        a && ((0, window.$)("\x3cdiv\x3e", {id: "particles"}).appendTo("body"), a("particles", c))
    }

    var b = !!window.HTMLCanvasElement, c = {
        particles: {
            number: {value: 20, density: {enable: !0, value_area: 1E3}},
            color: {value: "#e1e1e1"},
            shape: {
                type: "circle",
                stroke: {width: 0, color: "#000000"},
                polygon: {nb_sides: 5},
                image: {src: "img/github.svg", width: 100, height: 100}
            },
            opacity: {value: .5, random: !1, anim: {enable: !1, speed: 1, opacity_min: .1, sync: !1}},
            size: {
                value: 15, random: !0, anim: {
                    enable: !1,
                    speed: 180, size_min: .1, sync: !1
                }
            },
            line_linked: {enable: !0, distance: 650, color: "#cfcfcf", opacity: .26, width: 1},
            move: {
                enable: !0,
                speed: 2,
                direction: "none",
                random: !0,
                straight: !1,
                out_mode: "out",
                bounce: !1,
                attract: {enable: !1, rotateX: 600, rotateY: 1200}
            }
        }, interactivity: {
            detect_on: "canvas",
            events: {onhover: {enable: !1, mode: "repulse"}, onclick: {enable: !1, mode: "push"}, resize: !0},
            modes: {
                grab: {distance: 400, line_linked: {opacity: 1}},
                bubble: {distance: 400, size: 40, duration: 2, opacity: 8, speed: 3},
                repulse: {distance: 200, duration: .4},
                push: {particles_nb: 4},
                remove: {particles_nb: 2}
            }
        }, retina_detect: !0
    };
    (0, window.$)(function () {
        b && window.$.ajax({
            url: "https://oss.elements.org.cn/opensource/others/particles2.js",
            dataType: "script",
            cache: !0
        }).then(a)
    })
};

pR();

$(document).ready(function () {
    $('form#signup').data("doing", "0");

    $("#captcha").children("#id_captcha_1").remove();
    $(".captcha").click(function () {
        $.getJSON("/captcha/refresh", function (json) {
            $('#id_captcha_0').attr("value", json.key);
            $(".captcha").attr("src", json.image_url);
        });
    });
});

// 页面提前增加单个正则验证规则
(function ($) {
    if ($.AMUI && $.AMUI.validator) {
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
            if (validity.valid && $(validity.field).is('#user')) {
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
                    } else {
                        $tooltip.hide();
                    }
                    return validity;
                }, function () {
                    return validity;
                });
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

// 表单提交主函数
$('form#signup').submit(function () {
    if ($(this).data("doing") == "0") {
        if ($("#user").hasClass("am-field-valid") && $("#password1").hasClass("am-field-valid")
            && $("#password2").hasClass("am-field-valid") && $("#id_captcha_1").hasClass("am-field-valid")) {
            $('form#signup').data("doing", "1");
            $.ajax({
                type: 'POST',
                url: '/accounts/signup/',
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
                        if (response['status']['account']) {
                            $tooltip.text(response['status']['code']).show().css({
                                left: $("#id_code").offset().left + 10,
                                top: $("#id_code").offset().top + $("#id_code").outerHeight() + 10
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
