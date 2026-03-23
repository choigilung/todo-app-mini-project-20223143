require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- 1. 설정 (Middleware) ---
app.use(cors()); // 프론트엔드(React)에서 백엔드로 접속하는 것을 허용합니다.
app.use(express.json()); // JSON 형식의 데이터를 해석할 수 있게 합니다.

// --- 2. MongoDB 연결 ---
// .env 파일에 저장한 MONGODB_URI 주소를 사용해 연결합니다.
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// --- 3. 데이터 모델 정의 ---
// 데이터베이스에 저장될 '할 일'의 생김새를 정합니다 (C언어의 구조체와 비슷함).
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true }, // 할 일 내용
  completed: { type: Boolean, default: false } // 완료 여부 (기본값: 미완료)
});
const Todo = mongoose.model('Todo', todoSchema);

// --- 4. API (기능) 구현 ---

// [GET] 모든 할 일 목록 가져오기
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// [POST] 새로운 할 일 추가하기
app.post('/api/todos', async (req, res) => {
  const newTodo = new Todo({
    title: req.body.title
  });
  try {
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id, 
      { completed: req.body.completed }, 
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// [DELETE] 할 일 삭제하기
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 5. 서버 실행 ---
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다!`);
  });
}

// Vercel Serverless 배포를 위한 export
module.exports = app;