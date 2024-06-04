import React from 'react';
import { RxCross1 } from "react-icons/rx";

const AddCard = () => {
  const rolesArray = ["Viewer", "Member", "Admin"];

  return (
    <div className='z-40 relative w-screen flex h-screen'>
      <div className="border-2 mx-auto my-auto bg-white p-6 rounded-md shadow-md flex justify-between w-[600px] h-[360px] max-w-full">
        <div className='flex flex-col'>
          <div className='flex mx-auto'>
            <p className='mt-1 mr-72 font-bold text-xl text-blue-700'>Add People to Project</p>
            <RxCross1 className="mt-1 text-blue-800 text-xl cursor-pointer mb-4" />
          </div>
          <div className='flex mt-6'>
            <p className='font-semibold'>Email</p>
          </div>
          <div className='flex mt-2'>
            <input
              type='text'
              className='border-2 border-gray-300 rounded-md w-[520px] h-10 ml-1 pl-2'
              placeholder='Enter email address'
            />
          </div>
          <div className='flex mt-6'>
            <p className='font-semibold'>Role</p>
          </div>
          <div className='flex mt-2'>
            <select
              className='border-2 border-gray-300 rounded-md w-[520px] h-10 ml-1 pl-2'
            >
              {rolesArray.map((role, index) => (
                <option key={index}>{role}</option>
              ))}
            </select>
          </div>
          <div className='flex mt-6 justify-end'>
            <button className='bg-transparent text-black py-2 px-4 rounded-md'>Cancel</button>
            <button className='bg-blue-800 text-white py-2 px-4 rounded-md mr-3 ml-1'>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCard;
