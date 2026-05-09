const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 模拟数据库（内存存储，重启会清空，先用来跑通功能）
let users = [];
let gameRecords = [];

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, pwd } = req.body;
  const user = users.find(u => u.username === username && u.pwd === pwd);
  if (user) {
    res.json({ code: 0, msg: '登录成功', data: { username: user.username } });
  } else {
    res.json({ code: 1, msg: '用户名或密码错误' });
  }
});

// 注册接口
app.post('/api/register', (req, res) => {
  const { username, pwd } = req.body;
  if (users.find(u => u.username === username)) {
    res.json({ code: 1, msg: '用户名已存在' });
    return;
  }
  users.push({ username, pwd });
  res.json({ code: 0, msg: '注册成功' });
});

// 获取游戏记录接口
app.get('/api/games', (req, res) => {
  res.json({ code: 0, data: gameRecords });
});

// 新增游戏记录接口
app.post('/api/games', (req, res) => {
  const game = req.body;
  gameRecords.push(game);
  res.json({ code: 0, msg: '添加成功' });
});

// 启动服务
app.listen(port, () => {
  console.log(`服务已启动，端口：${port}`);
});
