import logging

from django import forms
from django.contrib.auth import authenticate
from django.utils.translation import ugettext, ugettext_lazy as _
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.forms.fields import CharField, MultiValueField
from xyapps.utils.common_c import isTelephoneFormat

User = get_user_model()
add_log = logging.getLogger('error')


# 登录的表单
class LoginForm(forms.Form):
    username = forms.CharField(label="用户名")
    password = forms.CharField(label="密码", widget=forms.PasswordInput(render_value=False))

    def clean(self):
        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")
        self._user = authenticate(username=username, password=password)
        if self._user is None:
            raise forms.ValidationError("无效的用户名和密码")
        elif not self._user.is_active:
            raise forms.ValidationError("您的账户未激活")
        return self.cleaned_data

    def save(self):
        return getattr(self, "_user", None)


# 随机码验证的表单
class RandomCodeVerifyForm(forms.Form):
    from xyapps.captcha.fields import CaptchaField
    captcha = CaptchaField()

    def __init__(self, *args, **kwargs):
        super(RandomCodeVerifyForm, self).__init__(*args, **kwargs)

    def save(self, *args, **kwargs):
        super(RandomCodeVerifyForm, self).save(*args, **kwargs)


# 注册表单
class SignupForm(forms.ModelForm):
    phone = forms.CharField(label=_("电话号码"), )
    code = forms.CharField(label=_("验证码"), )
    password1 = forms.CharField(label=_("Password"), widget=forms.PasswordInput(render_value=False))
    password2 = forms.CharField(label=_("Password (again)"), widget=forms.PasswordInput(render_value=False))

    class Meta:
        model = User
        fields = ("phone", "code", "username", "password1", "password2",)

    def __init__(self, *args, **kwargs):
        super(SignupForm, self).__init__(*args, **kwargs)
        user_fields = [i.attname for i in User._meta.get_fields() if hasattr(i, "attname")]
        for field in self.fields:
            if field in user_fields:
                self.fields[field].required = True
                if field.startswith("password"):
                    self.fields[field].widget.attrs["autocomplete"] = "off"
                    self.fields[field].widget.attrs.pop("required", "")

    def clean_username(self):
        username = self.cleaned_data.get("username")
        # 判断用户名是否输入非法字符
        if username.lower() != slugify(username).lower():
            raise forms.ValidationError(ugettext("用户名无效，请使用字符以及数字组合"))
        # 对username进行查询，是否进行过注册
        lookup = {"username__iexact": username}
        try:
            User.objects.exclude(id=self.instance.id).get(**lookup)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError(ugettext("该用户已经注册，请直接登录"))

    def clean_phone(self):
        phone = self.cleaned_data.get("phone")
        # 匹配电话号码
        self.phone = isTelephoneFormat(phone)
        if self.phone is None:
            raise forms.ValidationError(ugettext("输入的邮箱或者电话号码无效"))
        else:
            return self.phone

    def clean_code(self):
        """
        To verify the input code equal to SMS code
        """
        code = self.cleaned_data.get("code")
        phone = self.cleaned_data.get("phone")
        from django.core.cache import cache

        if cache.get("random_code" + phone) is None:
            raise forms.ValidationError("短信验证码已失效")
        elif code != cache.get("random_code" + phone):
            raise forms.ValidationError("请确认短信中的验证码")
        else:
            return code

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")

        if password1:
            if password1 != password2:
                raise forms.ValidationError(ugettext("两次输入的密码不同"))
            if len(password1) < 6:
                raise forms.ValidationError(ugettext("密码至少6位"))
        return password2

    def save(self, *args, **kwargs):
        kwargs["commit"] = False
        super(SignupForm, self).save(*args, **kwargs)
        password = self.cleaned_data.get("password1")
        username = self.cleaned_data.get("username")
        user = User.objects.create_user(username=username, password=password)
        # 开发平台创建用户时创建api用户
        return user