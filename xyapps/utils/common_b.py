from django.core.paginator import Paginator
from django.utils import timezone
import re
import datetime


# 获取分页数据
def get_p_data(data_list, pindex=1, psize=10):
    p = Paginator(data_list, psize)
    ptotal = str(p.num_pages)
    try:
        p_list = p.page(pindex)
    except:
        p_list = []
    return ptotal, p_list


def set_instance_attr(instance, value_fields=[], bool_fields=[],
                      datetime_fields=[], image_fields=[], data_list=[]):
    '''为对象的属性设置属性值,
        value_fields 普通值
        bool_fields 布尔值，有值时为True
        data_list 为数据的数组 例：[request.POST, request.FILES]
        datetime_fields 时间字段，格式是%Y-%m-%dT%H:%M,
        image_fields 图片字段
    '''
    __field_list = []

    def __add_field(field, data):
        if data.has_key(field):  # key在当前data中
            if field in __field_list:
                return False
            else:
                __field_list.append(field)
                return True
        return False

    for data in data_list:
        for field in value_fields:
            if not __add_field(field, data):
                continue
            value = data[field]
            if value == '':
                value = None
            setattr(instance, field, value)

        for field in bool_fields:
            # checkbox在不选中时request.POST中没有这一项，此处不用子函数判断
            if field in __field_list:
                continue
            else:
                __field_list.append(field)

            value = data.get(field)
            if value:
                value = True
            else:
                value = False
            setattr(instance, field, value)

        for field in datetime_fields:
            if not __add_field(field, data):
                continue
            value = data.get(field, '')
            if value:
                str_findall = re.findall(r'^(\d+-\d+-\d+T\d+:\d+)', value)
                if str_findall:
                    value = str_findall[0]
                    value = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M", )
                else:
                    value = None
            else:
                value = None
            setattr(instance, field, value)

        for field in image_fields:
            if not __add_field(field, data):
                continue
            value = data[field]
            if value:
                setattr(instance, field, value)

    return instance


def annex_path(instance, filename):
    today = timezone.now().strftime("%Y%m%d")
    f = filename.split(".")[-1]
    f_name = today + "." + f
    path = "uploads/tasks_%s_%s" % (instance.id, f_name)
    return path
