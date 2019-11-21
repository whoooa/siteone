/**
 * Created by Administrator on 2016/4/10.
 */

String.prototype.endsWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
};

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//获取url参数
function MoregetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r1 = window.location.search.substr(1).match(reg);
    if (r1 != null) {
        return decodeURI(r1[2]);
    } else if (window.Owner) {
        var r2 = window.Owner.location.search.substr(1).match(reg);
        if (r2 != null) {
            return decodeURI(r2[2]);
        }
    } else if (window.parent) {
        var r3 = window.parent.location.search.substr(1).match(reg);
        if (r3 != null) {
            return decodeURI(r3[2]);
        }
    }
    return "";
}

// 在url中加上sign参数的函数
var basesign;

function eladdsign(nowurl) {
    // var reg = new RegExp("(\\?|&)sign=([^&]*)(&|$)", "i");
    var reg = new RegExp("(\\?|&)sign=([^&]*)(&|$)|(\\.(png|jpg|gif|js)$)", "i");
    var r0 = nowurl.match(reg);
    if (r0 != null) {
        return nowurl;
    } else {
        var the_sign = MoregetQueryString("sign");
        if (!the_sign && basesign) {
            the_sign = basesign;
        }
        if (the_sign) {
            if (nowurl.indexOf("/?") == -1 && nowurl.endsWith("/")) {
                return nowurl + "?sign=" + the_sign;
            } else {
                return nowurl + "&sign=" + the_sign;
            }
        }
    }
    return nowurl;
}

jQuery.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
        }
        if (settings.dataType != "script") {
            settings.url = eladdsign(settings.url);
        }
    }
});
$(document).ajaxSuccess(function (event, jqXHR, options, data) {
    var text = jqXHR.responseText;
    if (text) {
        text = text.replace(/\r\n/g, "<br>")
    }
    if (text && text.length < 20) {
        text = JSON.parse(text);
        if (text.error == "403") {
            location.href = "/accounts/login/";
        }
    }
});
