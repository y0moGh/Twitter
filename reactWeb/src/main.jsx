import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import Create from './components/Create.jsx';
import Posts from './components/Posts.jsx';
import Admin from './components/Admin.jsx';
import Edit from './components/Edit.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<App />} />
        <Route exact path='/create' element={<Create />} />
        <Route exact path ='/posts/:id' element={<Posts />} />
        <Route exact path='/admin' element={<Admin />} />
        <Route exact path='/edit/:id' element={<Edit />} />
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
