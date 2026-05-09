const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 模拟数据库（临时用内存存储用户）
let users = [];

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, pwd } = req.body;
  
  // 查找用户
  const user = users.find(u => u.username === username && u.pwd === pwd);
  
  if (user) {
    res.json({
      code: 0,
      msg: '登录成功',
      data: { username: user.username }
    });
  } else {
    res.json({
      code: 1,
      msg: '用户名或密码错误'
    });
  }
});

// 注册接口
app.post('/api/register', (req, res) => {
  const { username, pwd } = req.body;
  
  // 检查用户名是否已存在
  if (users.find(u => u.username === username)) {
    res.json({
      code: 1,
      msg: '用户名已存在'
    });
    return;
  }
  
  // 添加新用户
  users.push({ username, pwd });
  
  res.json({
    code: 0,
    msg: '注册成功'
  });
});

// 启动服务
app.listen(port, () => {
  console.log(`服务已启动，端口：${port}`);
});
