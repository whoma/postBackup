#! /usr/bin/python
# -*- coding: utf-8 -*-

# need requests module 
# pip install requests

import os
import time
import requests

url = 'URL/doFile.php'

def sendFile():
  files = {'back': ('back.sql', open('./back.sql', 'rb'))}
  try:
    r = requests.post(url, files = files, timeout=2)
    print r
  except Exception:
    print '上传失败'


def backup():
  backCount = 0
  while True:
    backCount += 1
    nowDate = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    print '进行第%d次备份, 当前时间为 %s' %(backCount,nowDate)
    execute = os.system('mysqldump -uuser -ppasswd -t database_name table_name > ./back.sql')
    # 可对 back.sql 需要的信息进行 md5 加密 - 校验
    sendFile()
    print '备份结束'
    time.sleep(5)

backup()