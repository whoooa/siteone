import logging
from django.contrib.auth import get_user_model
from django.shortcuts import render

from utils.common_b import get_p_data
from xyviews.xydata.models import DouYu, ZhiHu
from xyapps.utils.base62 import apidecode, apiencode

User = get_user_model()
add_log = logging.getLogger('error')



def home(request):
    return render(request, "ftpm/index.html")

# 主播百科
def zbindex(request):
    page = request.GET.get("page") or 1
    key = request.GET.get("key")
    zbs = DouYu.objects.order_by("id")
    if key:
        key = key.strip()
        zbs = zbs.filter(nick_name__icontains=key)
    ptotal, p_list = get_p_data(zbs, pindex=page, psize=10)
    for i in p_list:
        cid = apiencode(i.id, addcrc=True)
        setattr(i, "cid", cid)
    content = {"zbs": p_list}
    return render(request, "ftpm/zbindex.html", content)

# 主播详情
def zbdetail(request):
    cid = apidecode(request.GET.get("cid"), addcrc=True)
    zb = DouYu.objects.filter(id=cid).first()
    content = {"zb": zb}
    return render(request, "ftpm/zbdetail.html", content)

# 人物
def rwindex(request):
    page = request.GET.get("page") or 1
    key = request.GET.get("key")
    zhs = ZhiHu.objects.order_by("-follower_count")
    if key:
        key = key.strip()
        zhs = zhs.filter(nick_name__icontains=key)
    ptotal, p_list = get_p_data(zhs, pindex=page, psize=10)
    for i in p_list:
        cid = apiencode(i.id, addcrc=True)
        setattr(i, "cid", cid)
    content = {"zhs": p_list}
    return render(request, "ftpm/rwindex.html", content)

# 主播详情
def rwdetail(request):
    cid = apidecode(request.GET.get("cid"), addcrc=True)
    zh = ZhiHu.objects.filter(id=cid).first()
    content = {"zh": zh}
    return render(request, "ftpm/rwdetail.html", content)