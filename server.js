const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync('./upload')) fs.mkdirSync('./upload');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './upload'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const dbPath = './data/db.json';
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], games: [], records: [] }));
}

const getDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const saveDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

app.post('/api/register', (req, res) => {
  const db = getDB();
  const { username, pwd } = req.body;
  if (db.users.find(x => x.username === username)) {
    return res.json({ code: -1, msg: '账号已存在' });
  }
  db.users.push({ username, pwd, avatar: "" });
  saveDB(db);
  res.json({ code: 0, msg: '注册成功' });
});

app.post('/api/login', (req, res) => {
  const db = getDB();
  const { username, pwd } = req.body;
  const user = db.users.find(x => x.username === username && x.pwd === pwd);
  if (!user) return res.json({ code: -1, msg: '账号密码错误' });
  res.json({ code: 0, data: user });
});

app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  const { username } = req.body;
  const db = getDB();
  const user = db.users.find(x => x.username === username);
  if (user) {
    user.avatar = '/upload/' + req.file.filename;
    saveDB(db);
  }
  res.json({ code: 0, url: user.avatar });
});

app.post('/api/save-game', (req, res) => {
  const db = getDB();
  const game = req.body;
  const idx = db.games.findIndex(x => x.id === game.id);
  idx > -1 ? db.games[idx] = game : db.games.push(game);
  saveDB(db);
  res.json({ code: 0 });
});

app.get('/api/games', (req, res) => {
  const db = getDB();
  res.json({ code: 0, data: db.games });
});

app.post('/api/save-record', (req, res) => {
  const db = getDB();
  const rec = req.body;
  const idx = db.records.findIndex(
    x => x.date === rec.date && x.gameId === rec.gameId && x.user === rec.user
  );
  idx > -1 ? db.records[idx] = rec : db.records.push(rec);
  saveDB(db);
  res.json({ code: 0 });
});

app.get('/api/records', (req, res) => {
  const db = getDB();
  res.json({ code: 0, data: db.records });
});

app.post('/api/upload-img', upload.single('img'), (req, res) => {
  res.json({ code: 0, url: '/upload/' + req.file.filename });
});

app.listen(port, () => {
  console.log(`网站已启动，访问：http://localhost:3000/login.html`);
});