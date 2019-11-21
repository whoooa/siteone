# -*- coding: utf-8 -*-
from __future__ import unicode_literals

# 用于加密和解密的 base62 字符串

api_key = 'YCvUMOnEcX82slrLzNRIpjoyBAfWaSDmuxe7Z0tTFQk16VihJb4GwqHK5g39Pd'
api_num = 32212254719


# base62加密函数  对外api使用
def apiencode(num, addcrc=None):
    try:
        num = api_num * int(num) + 1
        ret = ''
        crc = api_key[int(str(num)[-1]) * 6]
        while num != 0:
            ret = (api_key[num % 62]) + ret
            num = int(num / 62)
        if addcrc:
            # 在末尾添加一位随机字符
            ret += crc
        return ret
    except Exception:
        return num


# base62解密函数 对外api使用
def apidecode(st, addcrc=None):
    if isinstance(st, str):
        ret, mult = 0, 1
        if addcrc:
            # 去掉最末一位的随机字符
            st = st[:-1]
        for c in reversed(st):
            ret += mult * api_key.index(c)
            mult *= 62
        if (ret - 1) % api_num == 0:
            return int((ret - 1) / api_num)
    return ""
