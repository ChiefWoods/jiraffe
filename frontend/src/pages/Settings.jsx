import React from 'react';
import { Navbar, AddCard } from '../components';

const Settings = ({
  user_list = ["User 1", "User 2", "User 3"],
}) => {
  const projectName = "Project Name";
  const projectLead = "Project Lead";

  return (
    <div className="flex">
      <Navbar />
      <div className="flex ml-72 pl-36 w-[1000px] flex-col">
        {/* Project Settings */}
        <form className='mt-12 flex flex-col'>
          <p className='font-bold text-3xl text-blue-700 mb-8'>Project Settings</p>
          {/* Row */}
          <div className='flex ml-8'>
            <div className='flex flex-col mr-8'>
              <label className='font-semibold text-lg text-black mb-2' htmlFor="project-name">{projectName}</label>
              <input className='border border-gray-300 w-[440px] p-2 rounded' type="text" id="project-name" name="project-name" placeholder={projectName} />
            </div>
            <div className='flex flex-col'>
              <label className='font-semibold text-lg text-black mb-2' htmlFor="project-lead">{projectLead}</label>
              <input className='border border-gray-300 w-[440px] p-2 rounded' type="text" id="project-lead" name="project-lead" placeholder={projectLead} />
            </div>
          </div>
          {/* Row */}
          <div className='flex mt-8 ml-8'>
            <div className='flex flex-col'>
              <label className='font-semibold text-lg text-black mb-2' htmlFor="default-assignee">Default Assignee</label>
              {/* <input className='border border-gray-300 w-[440px] p-2 rounded' type="text" id="default-assignee" name="default-assignee" /> */}
              <select className='border border-gray-300 w-[440px] p-2 rounded' name="default-assignee" id="default-assignee">
                {user_list.map((user, index) => (
                  <option key={index}>{user}</option>
                ))}
              </select>
            </div>
            <div className='flex flex-col ml-10'>
              <button className='bg-blue-700 text-white w-[140px] p-2 rounded mt-9 ml-72'>Save Changes</button>
            </div>
          </div>
        </form>
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
