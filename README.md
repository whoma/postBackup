# postBackup
备份数据库

# 客户端
backupCamera.py 使用的是 mysqldump 命令。备份完成后，发送至服务端。(需要安装 requests 模块)

# 服务端
app.js 得到 sql 文件进行按需导入。