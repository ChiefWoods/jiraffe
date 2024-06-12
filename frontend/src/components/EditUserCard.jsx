import React from 'react';
import { RxCross1 } from "react-icons/rx";

const EditUserCard = () => {
  const rolesArray = ["Viewer", "Member", "Admin"];
  const userName = "John Doe";

  return (
    <div className='z-40 relative w-screen flex h-screen'>
      <div className="border-2 mx-auto my-auto bg-white p-6 rounded-md shadow-md flex justify-between w-[600px] h-[350px] max-w-full">
        <div className='flex flex-col'>
          <div className='flex justify-between items-center'>
            <p className='mt-1 mr-72 font-bold text-xl text-blue-700'>Edit User</p>
            <RxCross1 className="mt-1 text-blue-800 text-xl cursor-pointer mb-4" />
          </div>
          <div className='flex mt-6'>
            <p className='font-semibold'>Username</p>
          </div>
          <div className='flex mt-2'>
            <p className='w-[500px] ml-2 pl-0 pt-1 text-blue-900'>userName</p>
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
            <button className='bg-blue-800 text-white py-2 px-4 rounded-md mr-3 ml-1'>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUserCard;
