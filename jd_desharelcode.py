"""
15 10 * * * jd_desharelcode.py
new Env('删除旧的助力码目录');
"""
#!/usr/bin/env python3
# coding: utf-8

import os

def pullfix():
    print('\n删除老的助力码日志\n')
    print('\n开始执行。。。\n')
    if os.path.isdir('/ql/log/.ShareCode'):
        os.system('rm -rf /ql/log/.ShareCode')
    elif os.path.isdir('/ql/data/log/.ShareCode'):
        os.system('rm -rf /ql/data/log/.ShareCode')
    else:
        print('已删除')
        return False

pullfix()