import datetime
from django.db import models


class DouYu(models.Model):
    rid = models.IntegerField('直播间', blank=True, null=True)
    nick_name = models.CharField('昵称', max_length=150, null=True, blank=True)
    cate_name = models.CharField('大类', max_length=30, null=True, blank=True)
    second_lvl_name = models.CharField('二级分类', max_length=50, null=True, blank=True)
    rome_url = models.CharField('直播间名称', max_length=150, null=True, blank=True)
    od = models.CharField('主播奖章', max_length=30, null=True, blank=True)
    created = models.DateTimeField("入库时间", auto_now_add=True, blank=True)
    updated = models.DateTimeField("更新时间", auto_now_add=True, blank=True)


    class Meta:
        verbose_name = '斗鱼数据'
        verbose_name_plural = '斗鱼数据'
        db_table = 'yw_douyu'

class ZhiHu(models.Model):
    answer_count = models.IntegerField('回答数量', blank=True, null=True)
    articles_count = models.IntegerField('文章数量', blank=True, null=True)
    follower_count = models.IntegerField('粉丝数量', blank=True, null=True)
    following_count = models.IntegerField('关注人数', blank=True, null=True)
    educations = models.CharField('教育背景', max_length=150, null=True, blank=True)
    thanked_count = models.IntegerField('感谢数量', blank=True, null=True)
    description = models.CharField('个人简介', max_length=200, null=True, blank=True)
    locations = models.CharField('住址', max_length=200, null=True, blank=True)
    url_token = models.CharField('个人id', max_length=200, null=True, blank=True)
    name = models.CharField('昵称', max_length=200, null=True, blank=True)
    employments = models.CharField('职业', max_length=150, null=True, blank=True)
    business = models.CharField('生意', max_length=30, null=True, blank=True)
    user_type = models.CharField('个人或机构用户', max_length=50, null=True, blank=True)
    headline = models.CharField('标题', max_length=150, null=True, blank=True)
    voteup_count = models.IntegerField('粉丝数量', blank=True, null=True)
    favorited_count = models.IntegerField('粉丝数量', blank=True, null=True)
    avatar_url = models.CharField('头像链接', max_length=150, null=True, blank=True)
    created = models.DateTimeField("入库时间", auto_now_add=True, blank=True)
    updated = models.DateTimeField("更新时间", auto_now_add=True, blank=True)


    class Meta:
        verbose_name = '知乎数据'
        verbose_name_plural = '知乎数据'
        db_table = 'yw_zhihu'