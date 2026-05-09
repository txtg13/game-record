const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 内存数据库（自带所有游戏 + 抽卡规则）
let users = [];
let gameRecords = [
  // 明日方舟
  {
    gameName: "明日方舟",
    itemName: "合成玉",
    itemCount: 6000,
    itemPrice: 1,
    totalPrice: 6000,
    drawCost: 600,
    drawTicket: "抽卡卷",
    ratio: "180合成玉 = 1源石"
  },
  {
    gameName: "明日方舟",
    itemName: "源石",
    itemCount: 100,
    itemPrice: 180,
    totalPrice: 18000,
    drawCost: 600,
    drawTicket: "抽卡卷",
    ratio: "180合成玉 = 1源石"
  },
  {
    gameName: "明日方舟",
    itemName: "抽卡卷",
    itemCount: 50,
    itemPrice: 600,
    totalPrice: 30000,
    drawCost: 600,
    drawTicket: "抽卡卷",
    ratio: "180合成玉 = 1源石"
  },

  // 明日方舟终末地
  {
    gameName: "明日方舟：终末地",
    itemName: "合成玉",
    itemCount: 5000,
    itemPrice: 1,
    totalPrice: 5000,
    drawCost: 500,
    drawTicket: "抽卡卷",
    ratio: "90合成玉 = 1源石"
  },
  {
    gameName: "明日方舟：终末地",
    itemName: "源石",
    itemCount: 100,
    itemPrice: 90,
    totalPrice: 9000,
    drawCost: 500,
    drawTicket: "抽卡卷",
    ratio: "90合成玉 = 1源石"
  },
  {
    gameName: "明日方舟：终末地",
    itemName: "抽卡卷",
    itemCount: 50,
    itemPrice: 500,
    totalPrice: 25000,
    drawCost: 500,
    drawTicket: "抽卡卷",
    ratio: "90合成玉 = 1源石"
  },

  // 鸣潮
  {
    gameName: "鸣潮",
    itemName: "星声",
    itemCount: 8000,
    itemPrice: 1,
    totalPrice: 8000,
    drawCost: 160,
    drawTicket: "抽卡卷",
    ratio: "160 = 1抽"
  },
  {
    gameName: "鸣潮",
    itemName: "抽卡卷",
    itemCount: 50,
    itemPrice: 160,
    totalPrice: 8000,
    drawCost: 160,
    drawTicket: "抽卡卷",
    ratio: "160 = 1抽"
  },

  // 原神
  {
    gameName: "原神",
    itemName: "原石",
    itemCount: 8000,
    itemPrice: 1,
    totalPrice: 8000,
    drawCost: 160,
    drawTicket: "抽卡卷",
    ratio: "160 = 1抽"
  },
  {
    gameName: "原神",
    itemName: "抽卡卷",
    itemCount: 50,
    itemPrice: 160,
    totalPrice: 8000,
    drawCost: 160,
    drawTicket: "抽卡卷",
    ratio: "160 = 1抽"
  },

  // 崩坏：星穹铁道
  {
    gameName: "崩坏：星穹铁道",
    itemName: "星琼",
    itemCount: 8000,
    itemPrice: 1,
    totalPrice: 8000,
    drawCost: 160,
    drawTicket: "抽卡卷",
    ratio: "160 = 1抽"
  },
  {
    gameName: "崩坏：星穹铁道",
    itemName: "抽卡卷",
    itemCount: 50,
    itemPrice: 160,
    totalPrice: 8000,
    drawCost: 160,
    drawTicket: "抽卡卷",
    ratio: "160 = 1抽"
  },

  // 绝区零
  {
    gameName: "绝区零",
    itemName: "菲林",
    itemCount: 8000,
    itemPrice: 1,
    totalPrice: 8000,
    drawCost: 160,
    drawTicket: "抽卡卷",
    ratio: "160 = 1抽"
  },
  {
    gameName: "绝区零",
    itemName: "抽卡卷",
    itemCount: 50,
    itemPrice: 160,
    totalPrice: 8000,
    drawCost: 160,
    drawTicket: "抽卡卷",
    ratio: "160 = 1抽"
  }
];

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

// 保存设置
app.post('/api/saveSettings', (req, res) => {
  const { username } = req.body;
  userSettings[username] = req.body;
  res.json({ code: 0, msg: "设置保存成功" });
});

// 获取设置
app.post('/api/getSettings', (req, res) => {
  const { username } = req.body;
  res.json({ code: 0, data: userSettings[username] || {} });
});

// 启动
app.listen(port, () => {
  console.log("服务启动成功 ✅");
});
