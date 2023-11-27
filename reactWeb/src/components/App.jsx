import { useEffect, useState } from 'react'
import { Router, Route, Link, useParams } from 'react-router-dom';
import Requests from './Requests';
import '../Styles/ap.css'

function App() {

  const [posts, setPost] = useState([])
  const [comments, setComments] = useState([])
  const [user, setUser] = useState('')

  useEffect(() => {
    // Segunda solicitud para obtener la lista de posts
    fetch('http://localhost:5000/api/showPosts')
      .then(response => {
        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
        return response.json();
      })
      .then(data => {
        setPost(data.posts);
      })
      .catch(error => {
        console.error('Error al obtener posts:', error);
      });

    // Obtener el nombre de usuario de la cookie
    const username = Requests.getCookieValue('username')
    if (username) {
      setUser(username);
    }

  }, []);

  const handleDelete = (postId) => {
    fetch(`http://localhost:5000/api/deletePost/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.mensaje);
        // Actualizar la lista de posts después de la eliminación
        setPost(posts.filter(post => post.id !== postId));
        // Recargar la página después de la eliminación
        window.location.reload();
      })
      .catch(error => console.error('Error al eliminar el post:', error));
  };

  const handleLogout = () => {

    document.cookie = 'username=; e<button onClick={handleLogout}>Logout</button>'
    window.location.reload()
  }

  return (
    <>
      {user ? <h1>Hola {user}</h1> : <h1>Bienvenido</h1>}

      <div className='div'>
        <Link to={'/create'}><button>Create</button></Link>
        <Link to={'/register'}><button>Register</button></Link>
        <Link to={'/login'}><button>Login</button></Link>
        {user && <button className='edi' onClick={handleLogout}>Logout</button>}
      </div>

      <ul className='lista'>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>
              <button>
                <strong>{post.title}</strong>
              </button>
            </Link>
            {user === "Admin" && (
              <>
                <button className='edi' onClick={() => handleDelete(post.id)}>Delete</button>
                <Link to={`/edit/${post.id}`}> <button className='edi'>Edit</button> </Link>
              </>
            )}
          </li>
        ))}
      </ul >
    </>
  )
}

export default App
