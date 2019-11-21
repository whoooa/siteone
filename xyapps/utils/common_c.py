# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import re

"""
本文件用于存储一些C端用公用函数
"""


# 注册时判断是否email或telephone
def isEmailOrTelephoneFormat(emailortelephone):
    """
    :param emailortelephone: 输入的字符串（电话号码或者邮件地址）
    :return:列表['you@email',None] or [None,'your,telephone'] or [None. None]
    """
    m = re.match(r'(?P<email>[^\._-][\w\.-]+@(?:[A-Za-z0-9]+\.)+[A-Za-z]+$)|(?P<telephone>^1[3458]\d{9}$)',
                 emailortelephone)
    if m:
        return m.group(1, 2)
    else:
        return [None, None]


def isEmailFormat(email):
    m = re.match(r'(?P<email>[^\._-][\w\.-]+@(?:[A-Za-z0-9]+\.)+[A-Za-z]+$)', email)
    if m:
        return m.group(1)
    else:
        return None


def set_random_code(telephone, time):
    import random
    from django.core.cache import cache
    random_code = str(random.randint(10000, 99999))
    cache.set("random_code" + telephone, random_code, time)
    random_code = [random_code, time / 60]
    return random_code


def isTelephoneFormat(telephone):
    m = re.match(r'(?P<telephone>^1[34578]\d{9}$)', telephone)
    if m:
        return m.group(1)
    else:
        return None
