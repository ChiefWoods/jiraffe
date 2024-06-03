import React from 'react';
import { logo } from '../assets';
import { FaCheckCircle } from "react-icons/fa";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img src={logo} className="mx-auto" alt="Logo" />
        </div>
        <div className="mt-4">
          <form>
            <div className="mb-4">
            <div className='mb-4'>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Name:
                </label>
                <input
                  className="bg-[#DEDCFF] placeholder:text-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                />
              </div>
              <div className='mb-4'>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email:
                </label>
                <input
                  className="bg-[#DEDCFF] placeholder:text-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className='mb-4'>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password:
                </label>
                <input
                  className="bg-[#DEDCFF] placeholder:text-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>

              <div className='text-center'>
                <button className='bg-green-400 hover:bg-green-600 flex justify-center  mx-auto items-center rounded-3xl w-[40%] mb-2 text-white '>
                  <span className="mr-[3px]">Sign Up!</span>
                  <FaCheckCircle />
                  </button>
                <p className='text-[16px]'>Already have an account?<a href='/login' className='hover:text-blue-600 text-blue-400'>Sign In Here!</a></p>
              </div>

              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
