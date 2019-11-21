from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

__all__ = ['CapthaConfig']

class CapthaConfig(AppConfig):
    name = "xyapps.captcha"
