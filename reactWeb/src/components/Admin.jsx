import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const validPass = "1234"
  
  const handleSubmit = (e) =>{
    e.preventDefault()

    if(password === validPass){
        setIsAdmin(true)
        localStorage.setItem('isAdmin', JSON.stringify(true))
        navigate('/')
    }
    else{
        alert("Error")
    }

    setPassword('')
  }
  
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default Admin