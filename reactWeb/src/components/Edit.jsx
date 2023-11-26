import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Requests from './Requests';

const Edit = () => {
  let { id } = useParams();
  let intId = parseInt(id);
  let navigate = useNavigate();

  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState('')

  useEffect(() => {
    // Hacer la solicitud a la API para obtener los detalles del post
    fetch(`http://localhost:5000/api/showPosts/${intId}`)
      .then((response) => response.json())
      .then((data) => {
        // Actualizar los estados solo si los datos del post existen
        if (data.post) {
          setAuthor(data.post.author || '');
          setTitle(data.post.title || '');
          setContent(data.post.content || '');
        }
      })
      .catch((error) => console.error('Error al obtener detalles del post:', error));
    
      const username = Requests.getCookieValue('username')
      if (username) setUser(username)

  }, [intId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPost = { author, title, content };

    // Hacer la solicitud a la API para actualizar el post
    fetch(`http://localhost:5000/api/updatePost/${intId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.mensaje);
        navigate(`/posts/${intId}`);
      })
      .catch((error) => console.error('Error al actualizar el post:', error));
    
  };

  return (
    <>
      {user === "Admin" && (
        <form onSubmit={handleSubmit}>
          <h3>{author}</h3>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            onChange={(e) => setContent(e.target.value)}
            name="content"
            value={content}
            cols="30"
            rows="10"
            spellCheck="false"
            placeholder="Edit your post in .md"
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
  
};

export default Edit;
