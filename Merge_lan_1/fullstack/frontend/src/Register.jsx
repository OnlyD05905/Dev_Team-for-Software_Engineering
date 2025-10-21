import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import validation from './RegisterValidation'
import axios from 'axios'

function Register() {
  const [values, setValues] = useState({
    name: '',
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
    if(errors.name === "" && errors.email === "" && errors.password === "") {
      axios.post('http://localhost:5000/se_logreg', values)
      .then(res => {
        if (res.data.success) {
          alert("Đăng ký thành công!");
          navigate('/');
        } else {
          alert("Đăng ký thất bại!");
        }
        console.log(res);
      })
      .catch(err => {
        // Kiểm tra lỗi trùng email
        if (err.response && err.response.status === 500) {
          alert("Email đã tồn tại. Vui lòng sử dụng email khác.");
        } else {
          alert("Lỗi server. Vui lòng thử lại sau.");
        }
        console.log(err);
      })
    }
    console.log(values);
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <h1>Register Page</h1>
      <div className='bg-white p-3 rounded w-25'>
        <form action="" onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="name"><strong>Name</strong></label>
            <input type="text" placeholder='Enter name ...' name='name'
            onChange={handleInput} className='form-control rounded-0'/>
            {errors.name && <span className='text-danger'>{errors.name}</span>}
          </div>
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
          <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Register</strong></button>
          <Link to="/" className='btn btn-default border w-100 bg-light rounded-0'>Login</Link>
        </form>
      </div>
    </div>
  )
}

export default Register