import React, { useState } from 'react';
import Requests from './Requests';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Espera a que SendCredentials se complete antes de continuar
      Requests.SendCredentials(user, password, 'login');

      setUser('');
      setPassword('');

      // Navega a la ruta principal después de un breve retraso
      setTimeout(() => {
        navigate('/', { replace: true });
        // Realiza la recarga de la página
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Error al enviar credenciales:', error);
      // Maneja el error si es necesario
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

