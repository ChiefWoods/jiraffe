import React, { useEffect, useState } from 'react';
import {
  Navbar,
  AddCard,
  UpdateProject
} from '../components';

const Settings = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex ml-72 pl-36 w-[1000px] flex-col">
        {/* Project Settings */}
        <UpdateProject />
        {/* Access Control */}
        <div className='mt-12 flex flex-col'>
          <div className='flex mt-8 ml-2 justify-between w-[930px]'>
            <p className='font-bold text-3xl text-blue-700 mb-8'>Access</p>
            <button className='bg-blue-700 text-white w-[100px] p-0 rounded h-[30px] text-sm'>Add User</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
