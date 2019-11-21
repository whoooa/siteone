from django.urls import path
from xyapps.accounts import views

urlpatterns = [
                        # path("", views.index, name="index"),  # 主页
                       path("accounts/login/", views.login, name="login"),  # 登入
                       path("accounts/logout/", views.logout, name="logout"),  # 登出
                       path("accounts/signup/", views.signup, name="signup"),  # 注册
                       # 校验用户名是否已被注册
                       path("accounts/judgeusername/", views.judge_username_exist, name="judge_username_exist"),
                       # 校验手机号是否已被注册
                       path("accounts/judgePhone/", views.judge_phone_exist, name="judge_phone_exist"),
                       # 校验图片验证码
                       path("accounts/randomCodeVerify/", views.verify_random_code, name="verify_random_code"),
                       path("accounts/randomCodeVerify/", views.verify_random_code, name="verify_random_code"),
                       # 发送验证码短信
                       path("accounts/sendCodeVerify/", views.send_code_verify, name="send_code_verify"),
                       # 校验短信验证码是否正确
                       path("accounts/judgesmscode/", views.judgesmscode, name="judgesmscode"),
                       ]
