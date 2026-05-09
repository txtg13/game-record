const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 用户账号
let users = [];
// 全局固定游戏列表
const baseGameList = [
  {"gameName":"明日方舟","itemName":"合成玉","onceCost":600,"ratio":"180合成玉=1源石"},
  {"gameName":"明日方舟","itemName":"源石","onceCost":600,"ratio":"180合成玉=1源石"},
  {"gameName":"明日方舟","itemName":"抽卡券","onceCost":600,"ratio":"可直接一抽"},

  {"gameName":"明日方舟终末地","itemName":"合成玉","onceCost":500,"ratio":"90合成玉=1源石"},
  {"gameName":"明日方舟终末地","itemName":"源石","onceCost":500,"ratio":"90合成玉=1源石"},
  {"gameName":"明日方舟终末地","itemName":"抽卡券","onceCost":500,"ratio":"可直接一抽"},

  {"gameName":"原神","itemName":"原石","onceCost":160,"ratio":"160原石=1抽"},
  {"gameName":"原神","itemName":"抽卡券","onceCost":160,"ratio":"可直接一抽"},

  {"gameName":"崩坏星穹铁道","itemName":"星琼","onceCost":160,"ratio":"160星琼=1抽"},
  {"gameName":"崩坏星穹铁道","itemName":"抽卡券","onceCost":160,"ratio":"可直接一抽"},

  {"gameName":"鸣潮","itemName":"星声","onceCost":160,"ratio":"160星声=1抽"},
  {"gameName":"鸣潮","itemName":"抽卡券","onceCost":160,"ratio":"可直接一抽"},

  {"gameName":"绝区零","itemName":"菲林","onceCost":160,"ratio":"160菲林=1抽"},
  {"gameName":"绝区零","itemName":"抽卡券","onceCost":160,"ratio":"可直接一抽"}
];

// 用户个人设置
let userSettings = {};
// 用户游戏数据：userData[账号] = {游戏名:{resCount,ticketCount,upPull,checked}}
let userData = {};

// 登录
app.post('/api/login', (req, res) => {
  const { username, pwd } = req.body;
  const u = users.find(x => x.username === username && x.pwd === pwd);
  if(u){
    return res.json({ code:0, msg:"登录成功", data:{username} });
  }
  res.json({ code:1, msg:"账号密码错误" });
});

// 注册
app.post('/api/register', (req, res) => {
  const { username, pwd } = req.body;
  if(users.find(x => x.username === username)){
    return res.json({ code:1, msg:"用户名已存在" });
  }
  users.push({username,pwd});
  // 初始化空数据
  if(!userData[username]) userData[username] = {};
  res.json({ code:0, msg:"注册成功" });
});

// 获取固定游戏列表
app.get('/api/games', (req, res) => {
  res.json({ code:0, data:baseGameList });
});

// 保存个人设置
app.post('/api/saveSettings', (req, res) => {
  const { username, nickname, avatar } = req.body;
  userSettings[username] = { nickname, avatar };
  res.json({ code:0, msg:"保存成功" });
});

// 获取个人设置
app.post('/api/getSettings', (req, res) => {
  const { username } = req.body;
  res.json({ code:0, data:userSettings[username]||{} });
});

// 保存用户游戏数据
app.post('/api/saveGameData', (req, res) => {
  const { username, gameName, resCount, ticketCount, upPull, checked } = req.body;
  if(!userData[username]) userData[username] = {};
  userData[username][gameName] = { resCount, ticketCount, upPull, checked };
  res.json({ code:0, msg:"数据已同步" });
});

// 获取用户游戏数据
app.post('/api/getGameData', (req, res) => {
  const { username } = req.body;
  res.json({ code:0, data:userData[username]||{} });
});

app.listen(port, ()=>console.log("服务启动成功"));
