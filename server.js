const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 3000;

// 1. 用内存变量代替本地文件存储（Vercel 不支持本地文件）
let db = {
  users: [],
  games: [],
  records: []
};

// 2. 用内存存储代替 multer 本地文件上传
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 3. 基础中间件
app.use(express.json());
app.use(express.static(__dirname));

// 4. 把原来的 fs 文件读写，改成直接读写上面的 db 变量
// 示例：getDB 和 saveDB 函数直接操作内存
const getDB = () => db;
const saveDB = (newData) => {
  db = newData;
  // 注意：这里不会保存到文件，服务重启后数据会重置，这是 Vercel 限制导致的
};

// 5. 原来的路由逻辑不用改，直接用上面的 getDB/saveDB 就行
app.post('/api/register', (req, res) => {
  const db = getDB();
  // 你的注册逻辑...
});

// 其他所有路由，比如登录、添加游戏、上传记录等，都不用修改
// 因为它们调用的 getDB/saveDB 已经改成内存版本了

// 启动服务
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});