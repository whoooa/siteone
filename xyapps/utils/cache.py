# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import urllib

from django.core.cache import cache
from django.http import HttpRequest
from wenlincms.utils.cache import cache_key_prefix, cache_installed, _hashed_key

from mainsys.settings import ALLOWED_HOSTS


# 根据url主动删除缓存
def wl_del_cache(the_url):
    if cache_installed():
        # 清空主站和子站的
        for host in ALLOWED_HOSTS:
            obj_request = HttpRequest()
            the_path = the_url
            obj_request.path = urllib.request.unquote(the_path).decode("utf-8")
            obj_request.META['HTTP_USER_AGENT'] = 'Mozilla/5.0'
            obj_request.META['HTTP_HOST'] = host
            obj_request.META['HTTP_ACCEPT_LANGUAGE'] = 'zh-CN,zh;q=0.8,en;q=0.6',
            cache_key = cache_key_prefix(obj_request) + obj_request.path
            cache.delete(_hashed_key(cache_key))
        # 清空移动端的
        obj_request = HttpRequest()
        the_path = the_url
        obj_request.path = urllib.request.unquote(the_path).decode("utf-8")
        obj_request.META['HTTP_USER_AGENT'] = 'Android'
        obj_request.META['HTTP_HOST'] = ALLOWED_HOSTS[0]
        obj_request.META['HTTP_ACCEPT_LANGUAGE'] = 'zh-CN,zh;q=0.8,en;q=0.6',
        cache_key = cache_key_prefix(obj_request) + obj_request.path
        cache.delete(_hashed_key(cache_key))


# 判断系统是否是用的文件或redis缓存系统
def candelcache():
    try:
        from mainsys.settings import CACHES
        if CACHES["default"]["BACKEND"].split(".")[-1] in ["FileBasedCache", "RedisCache"]:
            return True
        return False
    except Exception:
        return False
