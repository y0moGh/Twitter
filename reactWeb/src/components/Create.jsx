import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Requests from './Requests'
import '../Styles/create.css'

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
    <>
     <Link to={'/'}> <button>Home</button> </Link>
    <div className="container">

      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
        <textarea
          onChange={(e) => setContent(e.target.value)} 
          name="content" 
          value={content} 
          cols="30" 
          rows="10"
          spellCheck="false"
          placeholder="Write your post in .md"
          className="textarea"
        >
        </textarea>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
    </>
  );
}

export default Create