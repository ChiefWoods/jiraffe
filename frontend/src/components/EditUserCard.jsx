import React, { useState } from 'react';
import { RxCross1 } from "react-icons/rx";

const EditUserCard = ({ isOpen, onClose, user, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  
  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(user.id, selectedRole);
  };

  return (
    <div className='z-40 fixed inset-0 flex items-center justify-center'>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="border-2 mx-auto my-auto bg-white p-6 rounded-md shadow-md flex justify-between w-[590px] h-[330px] max-w-full relative z-50">
        <div className='flex flex-col'>
          <div className='flex justify-between items-center'>
            <p className='mt-1 mr-72 font-bold text-l text-blue-700'>Edit User</p>
            <RxCross1 className="mt-1 text-blue-800 text-xl cursor-pointer mb-4 hover:scale-105" onClick={onClose} />
          </div>
          <div className='flex mt-4'>
            <p className='font-semibold text-base'>Username</p>
          </div>
          <div className='flex mt-0'>
            <p className='w-[500px] ml-2 pl-0 pt-1 text-blue-900 text-base font-bold'>{user.name}</p>
          </div>
          <div className='flex mt-6'>
            <p className='font-semibold text-base'>Role</p>
          </div>
          <div className='flex mt-2'>
            <select
              className='border-2 border-gray-300 rounded-md w-[520px] h-10 ml-1 pl-2'
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {["Viewer", "Member"].map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className='flex mt-8 justify-end'>
            <button className='bg-transparent text-black py-2 px-4 rounded-md hover:scale-105' onClick={onClose}>Cancel</button>
            <button className='bg-blue-800 text-white py-2 px-4 rounded-md mr-3 ml-1 hover:scale-105' onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUserCard;
