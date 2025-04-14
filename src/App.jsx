import { useState } from 'react'
import Login from './components/registerAndLogin/Login';
import Register from './components/registerAndLogin/Register';



function App() {

  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShowLogin(true)}>Login</button>
        <button onClick={() => setShowLogin(false)}>Register</button>
      </div>
      {showLogin ? <Login /> : <Register />}
    </div>
  );
}
export default App
