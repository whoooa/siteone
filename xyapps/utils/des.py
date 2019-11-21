# -*- coding:utf-8 -*-
# windows安装pycrypto  easy_install http://www.voidspace.org.uk/python/pycrypto-2.6.1/pycrypto-2.6.1.win32-py2.7.exe
# key 为16位字符串或16倍数字符串
import datetime
import json
import time
import hashlib
from binascii import b2a_hex, a2b_hex
import base64
from pyDes import CBC, PAD_PKCS5, des

Des_Key = "W2*&@<FR"  # Key 长度为8
Des_IV = b"\x52\x63\x78\x61\xBC\x48\x6A\x07"  # 自定IV向量


# 加密
def enstr(str):
    k = des(Des_Key, CBC, Des_IV, padmode=PAD_PKCS5)
    return base64.b64encode(k.encrypt(str))


# 解密
def destr(str):
    k = des(Des_Key, CBC, Des_IV, padmode=PAD_PKCS5)
    return k.decrypt(base64.b64decode(str))



# ---------------------------嵌入式网页加密规则------------------------------------
# 仅供友军使用

# username: 元素分配的用户名
# uid：元素分配的唯一标识     todo 非公开（用户pk+element对应md5）
# 密钥 ：'OnEcX82slrLzNRIp'
# AES加密规则： CBC模式，初始向量='0000000000000000'('0'*16)，密钥加密
# 注：明文长度不足16位就用空格补足为16位，大于16当时不是16的倍数，那就补足为16的倍数

# 流程：
# 1：拼接字符串 username + '|' + uid + '|' + 当前时间戳（13位，1970), 编码格式'utf-8'
# 2：拼接后的字符串采用AES加密规则加密得到加密字符串
# 3：将加密字符串转化为16进制字符串得到最终密文
# 4：将密文用GET方式附在url中请求链接-参数名称:'sign'

# 示例URL：https://saas.elecredit.com/saas/embed/company_list/
# 示例：u'尹佳音|2044c0569ada1ceb8e7ebba10fd529ef|1499411922141'
# 最终密文 '875e95bce800439f3966b8b287cf13584f384168c55fc535e2ce8b64385fe5c5b0d11031641550665b7b7b0a439b1d2496cdc5d6ced025a96be524e77edaa827'
# 最终链接：'https://saas.elecredit.com/saas/embed/company_list/?sign=875e95bce800439f3966b8b287cf13584f384168c55fc535e2ce8b64385fe5c5b0d11031641550665b7b7b0a439b1d2496cdc5d6ced025a96be524e77edaa827'


# 扩展login_required装饰器
def url_required(func):
    def wrapper(*args, **kw):
        from django.http import HttpResponseBadRequest
        from django.http import HttpResponseRedirect, HttpResponse
        request = args[0]
        # 登录用户无限制
        if request.user.is_authenticated():
            return func(*args, **kw)
        # 未登录需要验证签名
        sign = request.GET.get('sign', '')
        if not sign:
            if request.method == "POST":
                return HttpResponse(json.dumps({'error': '403'}), content_type='application/json')
            return HttpResponseRedirect("/accounts/login/")
        try:
            sign = destr(sign)
            sign_list = sign.split('|')
            if len(sign_list) == 3:
                user, uid, mtime = sign_list
            else:
                return HttpResponseBadRequest("403")
        except:
            # 未通过返回403
            return HttpResponseBadRequest("403")
        else:
            # 判断时间戳
            now = time.time()
            mtime = float(mtime) / 1000
            now = datetime.datetime.utcfromtimestamp(now)
            mtime = datetime.datetime.utcfromtimestamp(mtime)
            # 1小时内有效
            if abs((now - mtime).total_seconds()) <= 3600:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                this_user = User.objects.filter(username=user).first()
                if this_user:
                    md5 = hashlib.md5(str(this_user.pk) + 'element').hexdigest()
                    if uid != md5:
                        this_user = None
                if this_user:
                    request.user = this_user
                    return func(*args, **kw)
        return HttpResponseBadRequest("403")

    return wrapper
