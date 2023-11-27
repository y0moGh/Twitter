import React, { useEffect, useState } from 'react'
import { Router, Route, Link, useParams, json } from 'react-router-dom';
import Comments from './Comments';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../Styles/po.css'

const Posts = () => {
  const [posts, setPosts] = useState([])
  let { id } = useParams();
  const postId = parseInt(id)

  useEffect(() => {
    fetch('http://localhost:5000/api/showPosts')
      .then(response => {
        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
        return response.json();
      })
      .then(data => {
        setPosts(data.posts);
      })
      .catch(error => {
        console.error('Error al obtener posts:', error);
      });
  }, [])

  console.log(posts)
  let post = posts.find((elem, i) => i === postId - 1);
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <Link to={'/'}><button className="home-button">Home</button></Link>
      <div className="post-container" style={{ backgroundImage: "url('fondo.jpg')" }}>
        <div className="post-card">
          <h4 className="post-author">By {post.author}</h4>
          <h1 className="post-title">{post.title}</h1>
          <Markdown className="post-content" remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
        </div>
        <div className="comments-section">
          <h3 className="comment-heading">Comments</h3>
          <Comments ID={postId} />
        </div>
      </div>
    </>
  );
}

export default Posts