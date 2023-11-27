import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import Requests from './Requests.jsx';
import '../Styles/co.css'

const Comments = (props) => {
  const { ID } = props;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/showComments')
      .then(response => response.json())
      .then(data => setComments(data.comments))
      .catch(error => console.error('Error al obtener comentarios:', error));

    const username = Requests.getCookieValue('username');
    if (username) setAuthor(username);
    else setAuthor('Anonymous');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Requests.CreateComment(author, title, content, ID);
      setAuthor('');
      setTitle('');
      setContent('');

      setTimeout(() => {
        // Realiza la recarga de la página
        window.location.reload();
      }, 100);

    } catch (error) {
      console.error('Error al enviar credenciales:', error);
    }
  };

  const filteredComments = comments.filter(comment => comment.postId === ID);

  return (
    <div className='comment-container'>
      <form className='comment-form' onSubmit={handleSubmit}>
        <input className='comment-input' type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
        <textarea
          className='comment-textarea'
          onChange={(e) => setContent(e.target.value)}
          name="content"
          value={content}
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Write your comment in .md"
        >
        </textarea>
        <button className='comment-submit' type="submit">Submit</button>
      </form>

      <h3 className='comment-heading'>Comments</h3>

      {filteredComments.map((comment, i) => (
        <div className='comment' key={i}>
          <h5 className='comment-author'>{comment.author}</h5>
          <h4 className='comment-title'>{comment.title}</h4>
          <Markdown className='comment-content' remarkPlugins={[remarkGfm]}>{comment.content}</Markdown>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Comments;
