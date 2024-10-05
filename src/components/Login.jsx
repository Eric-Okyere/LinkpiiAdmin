import { useState } from 'react';
import BackgroundImage from '../assets/screen.png';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === 'qwertyericG4387491') {
      onLogin(true);
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-red-500"
    style={{
      backgroundImage: `url(${BackgroundImage})`,
      backgroundSize: 'stretch',
      backgroundPosition: 'center',
    
    }} 
    >
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
