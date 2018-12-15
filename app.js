const http = require('http');
const fs = require('fs');
const exec = require('child_process').exec;

const backupSh = `mysql -uuser -ppasswd database_name < ./back.sql`;

http.createServer((request, response) => {
  urlOptionMap(request);
  response.writeHead(200, {
    'Content-typpe': 'text/plain'
  });
  response.end('ok');
}).listen(8080)

const urlOptionMap = (request) => {
  let r = '';
  if (request.url === '/doFile.php') {
    request.on('data', data => {
      r += data;
    })
    request.on('end', _ => {
      handle(r);
    })
  }
}

const handle = (r) => {
  let sql = null;
  try {
    // 只采集需要的数据
    sql = r.match(/INSERT INTO `TABLE_NAME` VALUES (\((?:['|"][\s\S]*['|"],){3}(?:['|"][\s\S]*['|"]){1}\)[,]?)+/)[0];
  } catch (e) {
    console.log('接收到的数据非法，暂停写入');
  }
  // check sql  ** md5 校验
  let hasSecure = sql != undefined;
  if (hasSecure) {
    // 先设置字符集，再删除旧的数据
    let exeSql = 'set names Collation;\nLOCK TABLES `TABLE_NAME` WRITE;\nDELETE FROM `TABLE_NAME`;\n' + sql + ';\nUNLOCK TABLES;';
    fs.writeFile('./back.sql', exeSql, (err) => {
      if (!err) {
        handleBack();
      }
    })
  }
}

const handleBack = () => {
  console.log('开始备份数据');
  exec(backupSh, (err, stdout, stderr) => {
    if (!err && stderr != '') {
      console.log('备份数据成功');
    } else {
      console.log('备份数据失败');
    }
  })
}