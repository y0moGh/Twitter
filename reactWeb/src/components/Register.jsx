import React, { useState } from 'react'
import Requests from './Requests'
import { useNavigate } from 'react-router-dom'
import '../Styles/re.css'

const Register = () => {

  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    Requests.SendCredentials(user, password, 'createUser')
    setUser('')
    setPassword('')
    navigate('/')
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register