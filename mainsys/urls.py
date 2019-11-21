"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.urls import path, include
from mainsys.settings import APP_ROOT, APP_MODELS, APP_VIEWS, APPS_CANNOT_INTSALL

urlpatterns = [
    path('admin/', admin.site.urls),
    path('captcha/', include('captcha.urls')),
]

# 根据wlapps里的目录进行动态添加url
for ap in os.listdir(APP_ROOT):
    if ap not in APPS_CANNOT_INTSALL and os.path.isdir(os.path.join(APP_ROOT, ap)) and \
            os.path.exists(os.path.join(os.path.join(APP_ROOT, ap), "__init__.py")) and \
            os.path.exists(os.path.join(os.path.join(APP_ROOT, ap), "urls.py")):
        urlpatterns.append(path("", include(ap + ".urls")))

# 根据wlapps里的目录进行动态添加url
for ap in os.listdir(APP_MODELS):
    if ap not in APPS_CANNOT_INTSALL and os.path.isdir(os.path.join(APP_MODELS, ap)) and \
            os.path.exists(os.path.join(os.path.join(APP_MODELS, ap), "__init__.py")) and \
            os.path.exists(os.path.join(os.path.join(APP_MODELS, ap), "urls.py")):
        urlpatterns.append(path("", include(ap + ".urls")))

# 根据wlviews里的目录进行动态添加url
if os.path.exists(APP_VIEWS):
    for ap in os.listdir(APP_VIEWS):
        if ap not in APPS_CANNOT_INTSALL and os.path.isdir(os.path.join(APP_VIEWS, ap)) and \
                os.path.exists(os.path.join(os.path.join(APP_VIEWS, ap), "__init__.py")) and \
                os.path.exists(os.path.join(os.path.join(APP_VIEWS, ap), "urls.py")):
            urlpatterns.append(path("", include(ap + ".urls")))
