import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || '/api/todos';

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async () => {
    if (!input) return;
    await axios.post(API_URL, { title: input });
    setInput('');
    fetchTodos();
  };
  
  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
      fetchTodos(); 
    } catch (err) {
      console.error("상태 변경 실패:", err);
    }
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          📊 Dashboard
        </h2>
        
        <div style={styles.infoBox}>
          <p style={{ margin: '10px 0' }}>✅ 완료한 일: {todos.filter(t => t.completed).length}개</p>
          <p style={{ margin: '10px 0' }}>⏳ 남은 일: {todos.filter(t => !t.completed).length}개</p>
          <p style={{ margin: '10px 0', fontSize: '0.9rem', opacity: 0.7 }}>📅 {new Date().toLocaleDateString()}</p>
        </div>

        <hr style={{ opacity: 0.1, margin: '30px 0' }} />
        
        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            💡 <b>오늘의 한마디:</b><br />
            YOU NEVER WALK ALONE
          </p>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.card}>
          <h1 style={styles.title}>📝 My Todo List</h1>

          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="할 일을 입력하세요..."
            />
            <button style={styles.addButton} onClick={addTodo}>추가</button>
          </div>

          <ul style={styles.list}>
            {todos.map(todo => (
              <li key={todo._id} style={styles.listItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo._id, todo.completed)}
                  />
                  <span style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#807b22' : '#ffffff',
                    fontSize: '1.1rem'
                  }}>
                    {todo.title}
                  </span>
                </div>
                <button 
                  style={styles.deleteButton} 
                  onClick={() => deleteTodo(todo._id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #121212 0%, #1e1e2f 100%)',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'sans-serif',
  },
  sidebar: {
    width: '260px',
    padding: '40px 25px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  infoBox: {
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.07)',
    borderRadius: '15px',
    fontSize: '1rem',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  card: {
    width: '100%',
    maxWidth: '550px',
    background: 'rgba(30, 30, 30, 0.8)',
    padding: '40px',
    borderRadius: '25px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2rem',
    color: '#bb86fc',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #444',
    background: '#2c2c2c',
    color: '#fff',
    outline: 'none',
  },
  addButton: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: 'none',
    background: '#03dac6',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  deleteButton: {
    background: 'transparent',
    color: '#ff4b2b',
    border: '1px solid #ff4b2b',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  }
};

export default App;