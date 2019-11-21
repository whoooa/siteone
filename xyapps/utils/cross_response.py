# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from django.http import HttpResponse


def cross_response(data, domain="*", request=None):
    """
    跨域请求返回，添加跨域请求的一些必要参数，domain写主域名即可，自动根据request识别子域名
    """
    the_response = HttpResponse(data)
    the_domain = domain
    if request:
        tmp_domain = request.META["HTTP_ORIGIN"].lower()
        if domain != "*" and domain in tmp_domain:
            the_domain = tmp_domain
    the_response['Access-Control-Allow-Origin'] = the_domain
    the_response['Access-Control-Allow-Credentials'] = "true"
    return the_response


def json_cross_response(data, domain="*", request=None):
    """
    An HttpResponse that renders its content into JSON.
    domain写主域名即可，自动根据request识别子域名
    """

    the_response = HttpResponse(json.dumps(data), content_type="application/json")
    the_domain = domain
    if request:
        tmp_domain = request.META["HTTP_ORIGIN"].lower()
        if domain != "*" and domain in tmp_domain:
            the_domain = tmp_domain
    the_response['Access-Control-Allow-Origin'] = the_domain
    the_response['Access-Control-Allow-Credentials'] = "true"
    return the_response
