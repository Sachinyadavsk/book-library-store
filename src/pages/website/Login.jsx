import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className='max-w-6xl mx-auto py-10 px-10'>
      <div className="max-w-3xl mx-auto text-center">
        <h3 className='text-3xl text-gray-600 font-bold'>Welcome Back !</h3>
        <p className='text-xl text-gray-500 my-2'>Login to your account!</p>
      </div>
      {/* form design */}
      <div className="max-w-2xl mx-auto py-10 px-5">
        <div className="shadow-2xl py-10 px-10">
          <form action="" method="post">
            <div className="">
              <label htmlFor="">Email</label>
              <input type="email" name="email" placeholder='Enter your email' className='w-full py-3 px-5 border border-gray-500 mt-2' />
            </div>
            <div className="mt-4">
              <label htmlFor="">Password</label>
              <input type="password" name="password" placeholder='Enter your password' className='w-full py-3 px-5 border border-gray-500 mt-2' />
            </div>
            <div className="mt-4">
              <button type="button" className='w-full bg-blue-400 text-white py-4'>Login</button>
            </div>
            <div className="mt-3">
              <h5 className='text-xl text-gray-500 text-center'>Do not have an account <span className='text-blue-400 text-xl cursor-pointer' onClick={() => navigate('/register')}>Register</span></h5>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
