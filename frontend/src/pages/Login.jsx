import React from 'react';
import { logo_title } from '../assets';
import { FaArrowRightToBracket } from "react-icons/fa6";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img src={logo_title} className="mx-auto" alt="Logo" />
        </div>
        <div className="mt-4">
          <form>
            <div className="mb-4">
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
                <button className='bg-[#549EFF] hover:bg-blue-500 flex justify-center  mx-auto items-center rounded-3xl w-[40%] mb-2 text-white '>
                  <span className="mr-[3px]">Sign In!</span>
                  <FaArrowRightToBracket />
                  </button>
                <p className='text-[16px]'>Don't have an account?<a href='/register' className='hover:text-blue-600 text-blue-400'>Sign up now!</a></p>
              </div>

              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
