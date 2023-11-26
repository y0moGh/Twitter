import React, { useEffect, useState } from 'react'
import { Router, Route, Link, useParams, json } from 'react-router-dom';
import Comments from './Comments';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Posts = () => {
  const [posts, setPosts] = useState([])
  let { id } = useParams();
  const postId = parseInt(id)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/showPosts')
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
  },[])
  
  console.log(posts)
  let post = posts.find((elem, i) => i === postId - 1);
  if (!post) return <div>Post not found</div>;
  
  return (
    <div>
        <Link to={'/'}> <button>Home</button> </Link>
        
        <h4>By {post.author}</h4>
        <h1>{post.title}</h1>
        <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>

        <Comments ID={postId} />
    </div>
  )
}

export default Posts