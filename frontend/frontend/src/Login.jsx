import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import validation from './LoginValidation'
import axios from 'axios'
import './Login.css'

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();
  const [errors, setErrors] = useState({})

  const handleInput = (e) => {
    setValues(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validation(values));
    if(errors.email === "" && errors.password === "") {
      axios.post('http://localhost:5000/users', values)
      .then(res => {
        if(res.data.success) {
          navigate('/home');
        } else {
          alert("Invalid email or password")
        }
        console.log(res.data);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          alert("Invalid email or password");
        } else {
          alert("Server error");
        }
        console.log(err);
      })
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <h1>Login Page</h1>
      <div className='bg-white p-3 rounded w-25'>
        <form action="" onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email" placeholder='Enter email ...' name='email'
            onChange={handleInput} className='form-control rounded-0'/>
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input type="password" placeholder='Enter password ...' name='password'
            onChange={handleInput} className='form-control rounded-0'/>
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Login</strong></button>
          <div className='form-check'>
            <input type="checkbox" className='form-check-input' />
            <label className='form-check-label'>I am not a robot</label>
          </div>
          <Link to="/register" className='btn btn-default border w-100 bg-light rounded-0'>Register</Link>
        </form>
      </div>
    </div>
  )
}

export default Login