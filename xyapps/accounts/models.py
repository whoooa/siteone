import datetime
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


# 用户详细信息
class UCenter(models.Model):
    userid = models.OneToOneField(User, verbose_name="关联用户id", primary_key=True,
                                  db_column="userid", related_name="u_ucenter", on_delete=True)
    title = models.CharField('姓名', max_length=50, blank=True, null=True)
    company = models.CharField('公司', max_length=150, null=True, blank=True)
    tel = models.CharField('电话', max_length=30, null=True, blank=True)
    email = models.CharField('邮箱', max_length=50, null=True, blank=True)
    wechat = models.CharField('微信', max_length=50, null=True, blank=True)
    faq = models.TextField('备注', null=True, blank=True)
    yue = models.DecimalField('余额', null=True, blank=True, max_digits=15, decimal_places=2, default=0)
    feetype = models.CharField('计费类型', null=True, blank=True, max_length=1, default="1",
                               choices=(("1", "按流量计费"), ("2", "包时"),), help_text="包时用户请选择系统到期日期", db_column="ctype")


    class Meta:
        verbose_name = '子用户详情'
        verbose_name_plural = '子用户详情'
        db_table = 'ucenter'

    def __unicode__(self):
        return u'%s' % self.title

    def save(self, *args, **kwargs):
        if not self.title:
            self.title = self.userid.username
        if not self.ktdate:
            self.ktdate = datetime.date.today()
        super(UCenter, self).save(*args, **kwargs)


