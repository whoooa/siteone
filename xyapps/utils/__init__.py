# -*- coding:utf-8 -*-
from __future__ import unicode_literals

import os
import sys

from mainsys.settings import BASE_DIR

_mtimes = {}  # 记录代码上一次的修改时间


# 重写代码改动监听函数，只监听项目目录下的py文件的改动
def code_changed():
    global _mtimes
    for tdir in [BASE_DIR, os.path.join(BASE_DIR, "../xyapps"), os.path.join(BASE_DIR, "../xymodels"),
                 os.path.join(BASE_DIR, "../xyviews")]:
        for root, dirs, files in os.walk(tdir):
            for filepath in files:
                if filepath.endswith(".py"):
                    filename = os.path.join(root, filepath)
                    stat = os.stat(filename)
                    mtime = stat.st_mtime
                    if sys.platform == "win32":
                        mtime -= stat.st_ctime
                    if filename not in _mtimes:
                        _mtimes[filename] = mtime
                        continue
                    if mtime != _mtimes[filename]:
                        _mtimes = {}
                        print("%s changed, start reload..." % filename)
                        return True
    return False


# project加载时触发一次监听函数，初始化 _mtimes 全局变量
code_changed()
