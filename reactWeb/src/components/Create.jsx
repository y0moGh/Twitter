import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Requests from './Requests'

const Create = () => {
  
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const username = Requests.getCookieValue('username')
    if (username) setAuthor(username)
    else setAuthor("Anonymous")
  },[])
  
  const handleSubmit = (e) => { 
    e.preventDefault()
    Requests.CreatePost( author, title, content)

    setAuthor('')
    setContent('')
    setTitle('')
    navigate("/");
  }

  return (
    <div>
        <Link to={'/'}> <button>Home</button> </Link>

        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
            <textarea
                onChange={(e) => setContent(e.target.value)} 
                name="content" 
                value={content} 
                cols="30" 
                rows="10"
                spellCheck="false"
                placeholder="Write your post in .md"
            >
            </textarea>
        <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default Create