const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 内存数据库
let users = [];
let gameRecords = [];
let userSettings = {};

// 登录
app.post('/api/login', (req, res) => {
  const { username, pwd } = req.body;
  const user = users.find(u => u.username === username && u.pwd === pwd);
  if (user) {
    res.json({ code: 0, msg: "登录成功", data: { username } });
  } else {
    res.json({ code: 1, msg: "账号或密码错误" });
  }
});

// 注册
app.post('/api/register', (req, res) => {
  const { username, pwd } = req.body;
  if (users.find(u => u.username === username)) {
    res.json({ code: 1, msg: "用户名已存在" });
    return;
  }
  users.push({ username, pwd });
  res.json({ code: 0, msg: "注册成功" });
});

// 获取游戏列表
app.get('/api/games', (req, res) => {
  res.json({ code: 0, data: gameRecords });
});

// 添加游戏
app.post('/api/games', (req, res) => {
  gameRecords.push(req.body);
  res.json({ code: 0, msg: "保存成功" });
});

// 保存用户设置（头像、昵称等）
app.post('/api/saveSettings', (req, res) => {
  const { username } = req.body;
  userSettings[username] = req.body;
  res.json({ code: 0, msg: "设置保存成功" });
});

// 获取用户设置
app.post('/api/getSettings', (req, res) => {
  const { username } = req.body;
  res.json({ code: 0, data: userSettings[username] || {} });
});

// 启动
app.listen(port, () => {
  console.log("服务启动成功 ✅");
});
