import React from 'react'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Home from './Home.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/home' element={<h1>Home Page</h1>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
