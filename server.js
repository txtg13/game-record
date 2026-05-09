const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();

// 允许 Vercel 环境端口
const port = process.env.PORT || 3000;

// 内存存储（Vercel 只能用这个，不影响功能）
let database = { users: [], games: [], records: [] };
const getDB = () => database;
const saveDB = (data) => { database = data; };

// 静态文件托管（关键！能打开 html）
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// 内存上传（不写本地文件）
const upload = multer({ storage: multer.memoryStorage() });

// ---------------------- 你的业务接口 ----------------------
app.post('/api/register', (req, res) => {
  const db = getDB();
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username);
  if (user) return res.json({ success: false, msg: "用户名已存在" });
  db.users.push({ username, password });
  saveDB(db);
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const db = getDB();
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.json({ success: false, msg: "账号或密码错误" });
  res.json({ success: true, username });
});

app.get('/api/games', (req, res) => {
  const db = getDB();
  res.json(db.games);
});

app.post('/api/add-game', (req, res) => {
  const db = getDB();
  db.games.push(req.body);
  saveDB(db);
  res.json({ success: true });
});

app.post('/api/add-record', upload.single('image'), (req, res) => {
  const db = getDB();
  db.records.push({ ...req.body, image: req.file?.originalname || '' });
  saveDB(db);
  res.json({ success: true });
});

app.get('/api/records', (req, res) => {
  const db = getDB();
  res.json(db.records);
});

// 默认打开登录页（解决 Cannot GET /）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// 启动服务
app.listen(port, () => {
  console.log('服务已启动');
});

module.exports = app;