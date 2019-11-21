# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from wenlincms.generic.models import Keyword, AssignedKeyword

"""
本文件用于存储 admin 管理后台所需的一些action操作函数
"""

step = 200  # 批量执行时的步长


# 在后台批量通过审核的action
def make_status_online(modeladmin, request, queryset):
    queryset.update(status=2)


make_status_online.short_description = "批量上线"


# 在后台批量不通过审核的action
def make_status_offline(modeladmin, request, queryset):
    queryset.update(status=1)


make_status_offline.short_description = "批量下线"


# 在后台批量通过审核的action
def make_audit_passed(modeladmin, request, queryset):
    queryset.update(audit_status=1)


make_audit_passed.short_description = "通过审核"


# 在后台批量不通过审核的action
def make_audit_notpassed(modeladmin, request, queryset):
    queryset.update(audit_status=2)


make_audit_notpassed.short_description = "不通过审核"


# 在后台批量手动save的action
def manual_save(modeladmin, request, queryset):
    for obj in queryset:
        obj.save()


manual_save.short_description = "触发保存"


# 同步所有标签的使用频率字段
def synckeywordsfreq(modeladmin, request, queryset):
    objs = Keyword.objects.all()
    total = objs.count()
    i = 0
    while i * step < total:
        for obj in objs[i * step:(i + 1) * step]:
            obj.assigned_num = AssignedKeyword.objects.filter(keyword=obj.id).count()
            obj.save()
        i += 1


synckeywordsfreq.short_description = "统计所有标签的使用频率"
