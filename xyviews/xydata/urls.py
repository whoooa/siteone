from django.urls import path
from xyviews.xydata import views

urlpatterns = [
    path("", views.rwindex, name="home"),  # 主页
    path("zbindex/", views.zbindex, name="zbindex"),  # 直播主页
    path("zbdetail/", views.zbdetail, name="zbdetail"),  # 直播详情页
    path("rwindex/", views.rwindex, name="rwindex"),  # 人物主页
    path("rwdetail/", views.rwdetail, name="rwdetail"),  # 人物详情页
]
