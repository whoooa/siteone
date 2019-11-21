import json
import logging
import traceback

from django.contrib.auth import (login as auth_login, logout as auth_logout)
from django.core.cache import cache
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect
from django.utils.translation import ugettext_lazy as _
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.shortcuts import render

from django.conf import settings
from xyapps.accounts.forms import LoginForm, SignupForm, RandomCodeVerifyForm
from xyapps.accounts.models import UCenter
from xyapps.utils.CCPREST.CCPRestSDK import REST
from xyapps.utils.common_c import isTelephoneFormat, set_random_code

User = get_user_model()
add_log = logging.getLogger('error')



def index(request):
    return render(request, "xysite/index.html")

# 登入
@csrf_exempt
@never_cache
def login(request):
    if request.user.is_authenticated:
        return redirect(settings.RERICT_URL)
    else:
        form = LoginForm(request.POST or None)
        if request.method == "POST" and form.is_valid():
            authenticated_user = form.save()
            auth_login(request, authenticated_user)

            userid = request.user.id
            last_session = cache.get(userid, '')
            new_session = request.session.session_key
            if last_session:
                request.session.delete(last_session)
                # auth_logout(request)
            cache.set(userid, new_session, 43200)
            return redirect('/')
        context = {"form": form, "title": _("Log in")}
        return render(request, "xysite/login.html", context)


# 登出
@never_cache
def logout(request):
    auth_logout(request)
    return redirect('/')


# 注册
@never_cache
@csrf_exempt
def signup(request):
    if request.user.is_authenticated:
        return redirect(settings.REDIRICT_URL)
    else:
        signup_form = SignupForm(request.POST or None, request.FILES or None)
        random_code_form = RandomCodeVerifyForm(request.POST or None)
        # 渲染注册页面
        if request.method == 'GET':
            context = {"form": signup_form, "title": "注册", "random_code": random_code_form}
            signup_html = "xysite/signup.html"
            return render(request, signup_html, context=context)
        # 注册页面表单提交
        if request.method == "POST" and signup_form.is_valid():
            auth_user = signup_form.save()
            phone = signup_form.cleaned_data.get("phone")
            uphone = isTelephoneFormat(phone)
            if uphone is None:
                return HttpResponse(json.dumps({'status': {'phone': "电话号码无效"}}), content_type="application/json")
            else:
                ucenters = UCenter.objects.filter(userid=auth_user, tel=uphone)
                if len(ucenters):
                    return HttpResponse(json.dumps({'status': {'account': '该账户已经注册'}}), content_type="application/json")
                else:
                    the_ucenters = UCenter.objects.filter(userid=auth_user)
                    if len(the_ucenters):
                        new_a = {"tel": uphone}
                        the_ucenters.update(**new_a)
                    else:
                        new_a = {"userid": auth_user, "tel": uphone}
                        UCenter.objects.create(**new_a)
                    return HttpResponse(json.dumps({'status': 1}), content_type="application/json")
        else:
            return HttpResponse(json.dumps({'status': signup_form.errors}), content_type="application/json")





# 校验手机号是否已被注册
@never_cache
def judge_phone_exist(request):
    telephone = request.GET.get("telephone")
    data = {'tExist': 1}
    if telephone:
        texist = UCenter.objects.filter(tel=telephone).count()
        texist = 1 if texist > 0 else 0
        data['tExist'] = texist
    return HttpResponse(json.dumps(data), content_type="application/json")


# 校验用户名是否已被注册
@never_cache
def judge_username_exist(request):
    username = request.GET.get("username")
    data = dict()
    if username:
        texist = User.objects.filter(username=username).count()
        texist = 1 if texist > 0 else 0
        data['tExist'] = texist
    return HttpResponse(json.dumps(data), content_type="application/json")


# 校验图片验证码
@csrf_exempt
@never_cache
def verify_random_code(request):
    random_code_form = RandomCodeVerifyForm(request.POST or None)
    if request.method == "POST":
        if random_code_form.is_valid():
            return HttpResponse(json.dumps({"random_code_return": 1}), content_type="application/json")
        else:
            return HttpResponse(json.dumps({"random_code_return": 0}), content_type="application/json")


# 发送短信验证码
@csrf_exempt
@never_cache
def send_code_verify(request):
    telephone = ""
    if request.method == "POST":
        telephone = str(request.POST.get("telephone"))
        datas = ["系统"] # todo 动态生成
        random_code = set_random_code(telephone, 150)
        print(random_code)
        datas.extend(random_code)
        telephone = isTelephoneFormat(telephone)
        # 针对是否是合法的电话号码在前使用js进行判断
        tempid = ""
        smsverifyapi(telephone, datas, tempid)
    return HttpResponse(json.dumps({"success": telephone}), content_type="application/json")


# 短信接口api
def smsverifyapi(to, datas, TEMPID):
    """
    :param to: 电话号码
    :param datas: 列表['验证码','时间（分钟）']
    :return:
    """
    try:
        sms_default_settings = settings.SM_OPTIONS
        # REST SDK
        if sms_default_settings['SERVERIP'] and sms_default_settings['SERVERPORT'] \
                and sms_default_settings['SOFTVERSION'] \
                and sms_default_settings['ACCOUNTSID'] and sms_default_settings['ACCOUNTTOKEN'] \
                and TEMPID:
            rest = REST(sms_default_settings['SERVERIP'], sms_default_settings['SERVERPORT'],
                        sms_default_settings['SOFTVERSION'])
            rest.setAccount(sms_default_settings['ACCOUNTSID'], sms_default_settings['ACCOUNTTOKEN'])
            rest.setAppId(sms_default_settings['APPID'])
            rest.sendTemplateSMS(to, datas, TEMPID)
    except Exception:
        add_log.info("短信发送错误: \n%s" % str(traceback.format_exc()))


# 校验短信验证码是否正确
@never_cache
def judgesmscode(request):
    phone = request.GET.get("phone")
    code = request.GET.get("code")
    data = {"status": 1}
    if phone and code:
        if cache.get("random_code" + phone) is None:
            data = {"status": 0, "msg": "短信验证码已失效"}
        elif code != cache.get("random_code" + phone):
            data = {"status": 0, "msg": "请确认短信中的验证码"}
    else:
        data = {"status": 0, "msg": "请确认短信中的验证码"}
    return HttpResponse(json.dumps(data), content_type="application/json")
