window.onload = function () {
    $(".admin-content").css("visibility", "visible");
    $("#saasloading").hide();
};
// 一些saas系统的公共函数
$("#fullscreenanniu").click(function () {
    if ($("#fullscreenanniu").hasClass("withside")) {
        $('#fullscreenanniu').removeClass("withside");
        $('#fullscreenanniu span').html("显示边栏");
        $('.admin-sidebar').attr("style", 'display:none');
        $('.footer p').attr("style", 'padding-left:15px');
    }
    else {
        $('#fullscreenanniu').addClass("withside");
        $('#fullscreenanniu span').html("隐藏边栏");
        $('.admin-sidebar').removeAttr("style", 'display:none');
        $('.footer p').attr("style", 'padding-left:190px');
    }
    if (mini) {
        mini.layout();
    }
});

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return "";
}

//分页
//  翻页
var re_pagination,
    preBtn,
    nextBtn,
    numBox,
    jumpbtn;

function pageTool(pageall, curnum, id) {
    re_pagination = $("#" + id);
    if (pageall <= 1) {
        re_pagination.hide();
    } else {
        re_pagination.show();
        preBtn = re_pagination.find(".preBtn");
        nextBtn = re_pagination.find(".nextBtn");
        numBox = re_pagination.find(".numBox");
        jumpbtn = re_pagination.find(".jumpbtn");
        re_pagination.find(".pageli").remove();
        numBox.text(pageall);
        var bnum = parseInt(curnum + 1);
        var bnum3 = parseInt(bnum + 3);
        var bnum2 = parseInt(bnum + 2);
        var bnum1 = parseInt(bnum + 1);
        var snum = parseInt(curnum - 1);
        var snum1 = parseInt(snum - 1);
        var snum2 = parseInt(snum - 2);

        var li = '<li class="pageli" name="' + snum1 + '" onclick="getList(' + snum2 + ')"><a href="javascript:void(0)">' + snum1 + '</a> </li>' +
            '<li class="pageli" name="' + snum + '" onclick="getList(' + snum1 + ')"><a href="javascript:void(0)">' + snum + '</a> </li>' +
            '<li class="pageli" name="' + curnum + '" onclick="getList(' + snum + ')"><a href="javascript:void(0)">' + curnum + '</a> </li>' +
            '<li class="pageli am-active" name=' + bnum + '><a href="javascript:void(0)">' + bnum + '</a> </li>' +
            '<li class="pageli" name="' + bnum1 + '" onclick="getList(' + bnum + ')"><a href="javascript:void(0)">' + bnum1 + '</a> </li>' +
            '<li class="pageli" name="' + bnum2 + '" onclick="getList(' + bnum1 + ')"><a href="javascript:void(0)">' + bnum2 + '</a> </li>' +
            '<li class="pageli" name="' + bnum3 + '" onclick="getList(' + bnum2 + ')"><a href="javascript:void(0)">' + bnum3 + '</a> </li>';
        nextBtn.before(li);
        preBtn.attr("onclick", "getList(" + snum + ")");
        nextBtn.attr("onclick", "getList(" + bnum + ")");
        if (snum2 <= 0 || snum1 <= 0 || snum <= 0) {
            preBtn.hide();
        } else {
            preBtn.show();
        }
        if (bnum1 >= pageall || bnum2 >= pageall || bnum3 >= pageall) {
            nextBtn.hide();
        } else {
            nextBtn.show();
        }
        var lis = re_pagination.find(".pageli");
        lis.each(function () {
            var $this = $(this);
            var name = $this.attr("name");
            if (name) {
                if (name < 1 || name > pageall) {
                    $this.remove();
                }
            }
        });
    }
}
function jumpage(currentNum, fn, input) {
    var val = mini.getbyName(input).getValue() - 1;
    var num = parseInt(numBox.text());
    var re = /^[1-9]\d*|0$/.test(val);
    var textbox = re_pagination.find(".mini-textbox");
    if (val != currentNum) {
        if (val >= 0 && val < num && re && val < 10001) {
            if (input == "numinput") {
                fn(val);
            }
            else {
                return val;
            }
        } else {
            textbox.addClass("mini-error");
            if (input != "numinput") {
                return -1;
            }
        }
    }
}
//获取数组最大值
Array.prototype.max = function () {
    // 将数组第一个元素的值赋给max
    var max = this[0];
    // 使用for 循环从数组第一个值开始做遍历
    for (var i = 1; i < this.length; i++) {
        // 如果元素当前值大于max,就把这个当前值赋值给max
        if (this[i] > max) {
            max = this[i];
        }
    }
    // 返回最大的值
    return max;
};
Array.prototype.sum = function () {
    // 将数组第一个元素的值赋给max
    var sum = 0;
    for (var i = 0; i <= this.length; i++) {
        var _this = this[i];
        if (_this) {
            sum += parseFloat(_this)
        }

    }
    return sum;
};
//四分位
var count = function (data) {
    var data = data.slice(0);
    var markData = data.sort(function (a, b) {
            return a - b;
        }),
        n = markData.length;
    var index3,
        //较小四分位数
        //中位数（二分位）
        Q3 = 0;  //较大四分位数
    var num3 = (3 * n + 1) / 4,
        index3 = parseInt(num3);
    if (n >= 2) {
        //公式：a[3]+(a[4]-a[3])*小数位
        Q3 = parseFloat(markData[index3 - 1]) + parseFloat((markData[index3] - markData[index3 - 1]) * (num3 - index3));
    }
    else if (n == 1) {
        Q3 = parseFloat(markData[0]);
    }
    return {
        Q3: Q3.toFixed(2),
        max: n == 0 ? 0 : markData[n - 1]
    }
};
//自定义验证规则
function onChineseValidation(e) {
    if (e.isValid) {
        if (isChinese(e.value) == false) {
            e.isValid = false;
        }
    }
}
//是否汉字
function isChinese(v) {
    var re = new RegExp("^[\u4e00-\u9fa5]+$");
    if (re.test(v)) return true;
    return false;
}

//产业标签
//领域标签弹框，第三方组件
var $stags = $("#all_tags");
var $sele = $(".hot_labels");
$(function () {
    (function () {
        var a = $(".plus-tag");
        //删除已选标签
        $(document).on("click", ".plus-tag a", function () {
            var c = $(this), b = c.attr("title"), d = c.attr("value");
            delTips(b, d);
            var uuu = c.attr("title");
            $('.default-tag a').each(function () {
                var $this = $(this);
                if ($this.attr('title') == uuu) {
                    $this.show();
                }
            });
        });
        hasTips = function (b) {
            var d = $("a", a), c = false;
            d.each(function () {
                if ($(this).attr("title") == b) {
                    c = true;
                    return false
                }
            });
            return c
        };
        setTips = function (c, d, id) {
            if (hasTips(c)) {
                return false
            }
            var b = d ? 'value="' + d + '"' : "";
            a.append($("<a " + b + ' title="' + c + '" href="javascript:void(0);" name="' + id + '"><span>' + c + "</span><em></em></a>"));
            searchAjax(c, d, true);
            return true
        };
        delTips = function (b, c) {
            if (!hasTips(b)) {
                return false
            }
            $("a", a).each(function () {
                var d = $(this);
                if (d.attr("title") == b) {
                    d.remove();
                    return false
                }
            });
            searchAjax(b, c, false);
            return true
        };

        getTips = function () {
            var b = [];
            $("a", a).each(function () {
                b.push($(this).attr("title"))
            });
            return b
        };

        getTipsId = function () {
            var b = [];
            $("a", a).each(function () {
                b.push($(this).attr("value"))
            });
            return b
        };

        getTipsIdAndTag = function () {
            var b = [];
            $("a", a).each(function () {
                b.push($(this).attr("value") + "##" + $(this).attr("title"))
            });
            return b
        }
    })()
});
// 更新选中标签标签
$(function () {
    setSelectTips();
    $('.plus-tag').append($('.plus-tag a'));
});
var searchAjax = function (name, id, isAdd) {
    setSelectTips();
};
// 搜索
(function () {
    var $b = $('.plus-tag-add a'), $i = $('.plus-tag-add input');
    $i.keyup(function (e) {
        if (e.keyCode == 13) {
            $b.click();
        }
    });
    $b.click(function () {
        var name = $i.val().toLowerCase();
        if (name != '') setTips(name, -1);
        $i.val('');
        $i.select();
    });
})();
// 推荐标签
(function () {
    $(document).on("click", ".default-tag a", function () {
        var $this = $(this),
            name = $this.attr('title'),
            id = $this.attr('value'),
            textid = $this.attr('name');
        var tagslen = $('#mytags a').length;
        if (tagslen < 3) {
            setTips(name, id, textid);
        }
    });
    // 更新高亮显示
    setSelectTips = function () {
        var arrName = getTips();
        $('.default-tag a').removeClass('selected');
        $.each(arrName, function (index, name) {
            $('.default-tag a').each(function () {
                var $this = $(this);
                if ($this.attr('title') == name) {
                    $this.addClass('selected');
                    $this.hide();
                    return false;
                }
            })
        });
    }
})();
//领域标签组件结束//////////////////////////////////////////////
$sele.click(function () {
    $stags.removeClass('hide_contain').addClass('show_contain');
    $(".maskera").removeClass('hide_contain').addClass('show_contain');
    //数据编辑时用，分隔开显示编辑
    var labs = $(".hot_labels .mini-textbox-input").val();
    if (labs) {
        var labsarr = labs.split(",");
        var list = "";
        for (var i = 0; i < labsarr.length; i++) {
            var uuu = labsarr[i];
            if (uuu != "") {
                $('.default-tag a').each(function () {
                    var $this = $(this);
                    if ($this.attr('title') == uuu) {
                        var name = $this.attr("name");
                        list += '<a title=' + '"' + labsarr[i] + '"' + 'href="javascript:void(0);" name="' + name + '"><span>' + labsarr[i].trim() + '</span><em></em></a>';
                    }
                });
            }
        }
        $(list).prependTo($('#mytags'));
    } else {
        $('#all_tags .default-tag a').removeClass('selected').show();
    }
});
$(".cancel_tags").click(function () {
    $stags.removeClass('show_contain').addClass('hide_contain');
    $(".maskera").removeClass('show_contain').addClass('hide_contain');
    $("#mytags").text("");
});

function getTagsInfo() {
    var arrid = "";
    var lab = $("#mytags a");
    var labss = "";
    for (var i = 0; i < lab.length; i++) {
        var $this = $(lab[i]);
        if (i == lab.length - 1) {
            labss = labss + $this.text();
            arrid = arrid + $this.attr("name");
        }
        else {
            labss = labss + $this.text() + ",";
            arrid = arrid + $this.attr("name") + "$";
        }
    }
    mini.getbyName("TAGS").setValue(labss);
    $stags.removeClass('show_contain').addClass('hide_contain');
    $(".maskera").removeClass('show_contain').addClass('hide_contain');
    $("#mytags").text("");
    return arrid;
}
//====导出excel公用
//获取当前时间
function gettime() {
    var d = new Date();
    var vYear = d.getFullYear().toString();
    var vMon = d.getMonth() + 1;
    var vDay = d.getDate().toString();
    var h = d.getHours().toString();
    var m = d.getMinutes().toString();
    var sdate = vYear + (vMon < 10 ? "0" + vMon : vMon) + (vDay < 10 ? "0" + vDay : vDay) + (h < 10 ? "0" + h : h) + (m < 10 ? "0" + m : m);
    return sdate;
}
//是否为IE
function isIEexcel() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : 0;
    var isedge = navigator.userAgent.indexOf("Edge") > -1;
    return Sys.ie || isedge;
}
//参数说明 json：datagrid返回的json数据 [{"ENTNAME": "元素", "REGNO": "888"…}…]
//keyMap：datagrid要导出字段name数组集合["ENTNAME", "REGNO"...]
//FileName："XX筛查结果-{{ sitesettings.website_name }}-" + gettime()
//注意：表头标题需要自己写并插入到json第一位 {"ENTNAME": "名称", "REGNO": "注册号"…};
//IE 10+
function exportExcelIE(json, keyMap, FileName) {
    //生成表头
    var table = '<table>';
    //循环生成表身
    var i, j;
    for (i = 0; i < json.length; i++) {
        var row = "<tr>";
        var _this = json[i];
        for (j = 0; j < keyMap.length; j++) {
            var _key = keyMap[j];
            var td = _this[_key];
            if (!td) {
                td = "";
            }
            row += '<td x:str=' + td + '>' + td + '</td>';
        }
        table += row + "</tr>";
    }

    table += "</table>";
    var excelFile = "<html xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += "<head>";
    excelFile += ' <meta http-equiv=Content-Type content="text/html; charset=utf-8"/>';
    excelFile += '<meta name=ProgId content=Excel.Sheet>';
    excelFile += '<meta name=Generator content="Microsoft Excel 11">';
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "sheet";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += table;
    excelFile += "</body>";
    excelFile += "</html>";
    var blob = new Blob(
        [excelFile],
        {type: "text/plain;charset=utf8"}
    );
    saveAs(blob, FileName + ".xls");
}
//非IE
function downloadExl(json, keyMap, FileName) {
    var tmpdata = []; //用来保存转换好的json
    json.map(function (v, i) {
        return keyMap.map(function (k, j) {
            return Object.assign({}, {
                v: v[k],
                position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
            });
        });
    }).reduce(function (prev, next) {
        return prev.concat(next);
    }).forEach(function (v, i) {
        return tmpdata[v.position] = {
            v: v.v
        };
    });
    var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
    var tmpWB = {
        SheetNames: ['mySheet'], //保存的表标题
        Sheets: {
            'mySheet': Object.assign({}, tmpdata, //内容
                {
                    '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                })
        }
    };
    var tmpDown = new Blob([s2ab(XLSX.write(tmpWB, {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary'
        } //这里的数据是用来定义导出的格式类型
    ))], {
        type: ""
    }); //创建二进制对象写入转换好的字节流
    var uri = URL.createObjectURL(tmpDown);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = FileName + ".xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () {
        //延时释放
        URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);

}
function s2ab(s) {
    //字符串转字符流
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}
// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
    var s = '',
        m = 0;
    while (n > 0) {
        m = n % 26 + 1;
        s = String.fromCharCode(m + 64) + s;
        n = (n - m) / 26;
    }
    return s;
}
//spend money
var $msureMoney = $('#msureMoney');
function spendMoney(money) {
    $("#moneyinfo").html("查看将花费您<i class='moneynum'>" + money + "</i>元，确认继续吗？");
    $msureMoney.modal('open');
}
$("#msureMoney .moneyCancle").click(function () {
    $msureMoney.modal('close');
});
$("#msureMoney .moneySure").click(function () {
    $msureMoney.hide();
    openmodal();
});

//消费情况余额提示信息
function openmodal(text, money) {
    //第二个字段为空，表示余额不足/账户快到期提醒。两个字段均有，第一个为花费金额，第二个为剩余金额
    if (money) {
        $("#noticeinfo").html("本次消费金额<i class='moneynum'>" + text + "</i>元；账户剩余<i class='moneynum'>" + money + "</i>元。");
        $("#lastMoney").html(money);
    } else {
        $("#noticeinfo").html(text);
    }
    $("#noticeinfobox").modal('open');
}

//模糊匹配最少两位
function ENTNAMELen(e) {
    var val = fclean(e.value);
    if (e.isValid && val && val.length < 2) {
        e.isValid = false;
    }
}

function shoujkloading(eletop) {
    var jkloading = $("#jkloadingimg").length;
    var top = $('body').scrollTop(),
        height = window.screen.height - 200;
    var sctop = top;
    if (eletop) {
        if (eletop < height) {
            sctop = height / 2;
        } else {
            sctop = eletop;
        }
    } else {
        if (top < height) {
            sctop = height / 2;
        } else {
            sctop = top - 100;
        }
    }
    if (!jkloading.length) {
        var html = '<div id="jkloadingimg"><div class="jkloadingbox"></div></div>';
        $("body").append(html);
    }
    $(".jkloadingbox").css("top", sctop);
}
function jiankong(entid, eletop) {
    shoujkloading(eletop);
    $("#jkloadingimg").show();
    $.ajax({
        url: "/saas/add_guanzhu/",
        data: {
            entids: entid
        },
        success: function (response) {
            $("#jkloadingimg").hide();
            var _success = response.sucess,
                _exits = response.exits,
                _error = response.error;
            var alertMsg = "监控成功：" + _success + "个；" + "监控失败：" + _error + "个；" + "已监控：" + _exits + "个；";
            mini.alert(alertMsg);
        },
        error: function () {
            console.log("系统错误，请联系管理员");
        }
    })
}

function cancleJiankong(entid) {
    shoujkloading();
    $("#jkloadingimg").show();
    $.ajax({
        url: "/saas/del_guanzhu/",
        data: {
            entids: entid
        },
        success: function (response) {
            $("#jkloadingimg").hide();
            var _success = response.sucess,
                _exits = response.noguanzhu,
                _error = response.error;
            var alertMsg = "取消成功：" + _success + "个；" + "取消失败：" + _error + "个；" + "未监控：" + _exits + "个；";
            mini.alert(alertMsg, "提醒", function () {
                window.location.reload();
            });
        },
        error: function () {

        }
    });
}


function getAdminHei() {
    var innerhei = window.innerHeight,
        headerrhei = $("header").height(),
        footerhei = $("footer").height();
    return innerhei - headerrhei - 1 - footerhei;
}
function setAdminHei() {
    var tabs = mini.get("mainTabs"),
        actab = tabs.getActiveTab();
    if (actab) {
        var aciconCls = actab.iconCls;
        // debugger
        if (aciconCls.indexOf("icon-report16") > -1 || aciconCls.indexOf("icon-reportyz-detail") > -1) {
            var objhei = {
                "innerhei": window.innerHeight,
                "header": $("header").height(),
                "footer": $("footer").height()
            };
            var adminhei = objhei["innerhei"] - objhei["header"] - objhei["footer"] - 1;//减去头部 border 底部高度
            $("body").css("min-height", "230px");
            $(".admin-content").css({
                "min-height": "200px",
                "height": adminhei + "px"
            });
            // var reporthei = adminhei - 50;
            // var iframe = tabs.getTabIFrameEl(actab);
            // iframe.style.height = reporthei + 'px';
        }
    } else {
        $("body").css("min-height", "600px");
        $(".admin-content").css({
            "min-height": "600px",
            "height": "100%"
        });
    }
}

//侧边栏展开一个
$("#saas_sliderbar .admin-parent .am-cf").click(function () {
    var _this = $(this).parents(".admin-parent"),
        _a = $(_this.find("a")[0]),
        _aid = _a.attr("id"),
        _ul = $(_this.find("ul")[0]);
    if (_ul.length) {
        var _id = _ul.attr("id");
        if (_ul.hasClass("am-in")) {
            $("#" + _id).collapse('close');
        } else {
            _a.removeClass(" am-collapsed");
            var _amid = $($("#saas_sliderbar .am-in")[0]).attr("id");
            $("#" + _amid).collapse('close');
            $("#" + _aid).collapse('open');
        }
    }
});
