const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

let users = [];

const baseGameList = [
  {"gameName":"明日方舟","itemName":"合成玉","onceCost":600,"ratio":"180合成玉=1源石"},
  {"gameName":"明日方舟终末地","itemName":"合成玉","onceCost":500,"ratio":"90合成玉=1源石"},
  {"gameName":"原神","itemName":"原石","onceCost":160,"ratio":"160原石=1抽"},
  {"gameName":"崩坏星穹铁道","itemName":"星琼","onceCost":160,"ratio":"160星琼=1抽"},
  {"gameName":"鸣潮","itemName":"星声","onceCost":160,"ratio":"160星声=1抽"},
  {"gameName":"绝区零","itemName":"菲林","onceCost":160,"ratio":"160菲林=1抽"}
];

let userSettings = {};
let userData = {};

app.post('/api/login', (req, res) => {
  const { username, pwd } = req.body;
  const u = users.find(x => x.username === username && x.pwd === pwd);
  if(u){
    return res.json({ code:0, msg:"登录成功", data:{username} });
  }
  res.json({ code:1, msg:"账号密码错误" });
});

app.post('/api/register', (req, res) => {
  const { username, pwd } = req.body;
  if(users.find(x => x.username === username)){
    return res.json({ code:1, msg:"用户名已存在" });
  }
  users.push({username,pwd});
  if(!userData[username]) userData[username] = {};
  res.json({ code:0, msg:"注册成功" });
});

app.get('/api/games', (req, res) => {
  res.json({ code:0, data:baseGameList });
});

app.post('/api/saveSettings', (req, res) => {
  const { username, nickname, avatar } = req.body;
  userSettings[username] = { nickname, avatar };
  res.json({ code:0, msg:"保存成功" });
});

app.post('/api/getSettings', (req, res) => {
  const { username } = req.body;
  res.json({ code:0, data:userSettings[username]||{} });
});

app.post('/api/saveGameData', (req, res) => {
  const { username, gameName, resCount, stoneCount, ticketCount, upPull, checked } = req.body;
  if(!userData[username]) userData[username] = {};
  userData[username][gameName] = { resCount, stoneCount, ticketCount, upPull, checked };
  res.json({ code:0, msg:"同步成功" });
});

app.post('/api/getGameData', (req, res) => {
  const { username } = req.body;
  res.json({ code:0, data:userData[username]||{} });
});

app.listen(port, ()=>console.log("服务启动成功"));
