# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from threading import Thread

from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.views.decorators.cache import never_cache


# 本文件用于存储一些全站所需的公用函数

# 直接渲染txt文件的函数，url中调用
@never_cache
def textrender(request, textfile):
    return TemplateResponse(request, textfile, content_type="text/plain")


# 转行其他url，url中调用
def wlredirect(request, to_url):
    return HttpResponseRedirect(to_url)


# 返回当前系统使用的主题
def get_theme():
    theme = "wltheme"
    try:
        from mainsys.config import WL_THEME
        if len(WL_THEME.strip()):
            theme = WL_THEME
    except ImportError:
        pass
    return theme


# 根据数据类型进行转化，先全部转为字符串类型
# 注意'true'或者'false'的字符串不能转换为'1'或'0'
def fieldtostr(field):
    if field is None:
        field = ''
    elif isinstance(field, int) or isinstance(field, float):
        field = str(field)
    elif isinstance(field, str):
        field = field.strip()
    elif isinstance(field, bool):  # bool类型也转化为'0'或'1'
        field = str(int(field))
    return field


# 将空类型转为字符串，并对字符串去空，用于导出json时
def kongtostr(field):
    if field is None:
        return ''
    elif isinstance(field, str):
        return field.strip()
    return field


# 将1601数值转换为月份
def tmonthtostr(field):
    if field is None:
        return ''
    try:
        field = str(field)
        return "%s年%s月" % (field[:2], field[2:])
    except:
        return field


# 限制函数的执行时间的装饰器
class TimeoutException(Exception):
    pass


ThreadStop = Thread._stop  # 获取私有函数


def timelimited(timeout):
    def decorator(function):
        def decorator2(*args, **kwargs):
            class TimeLimited(Thread):
                def __init__(self, _error=None, ):
                    Thread.__init__(self)
                    self._error = _error

                def run(self):
                    try:
                        self.result = function(*args, **kwargs)
                    except Exception as e:
                        self._error = e

                def _stop(self):
                    if self.isAlive():
                        ThreadStop(self)

            t = TimeLimited()
            t.start()
            t.join(timeout)
            if isinstance(t._error, TimeoutException):
                t._stop()
                raise TimeoutException('timeout for %s' % (repr(function)))
            if t.isAlive():
                t._stop()
                raise TimeoutException('timeout for %s' % (repr(function)))
            if t._error is None:
                return t.result

        return decorator2

    return decorator
