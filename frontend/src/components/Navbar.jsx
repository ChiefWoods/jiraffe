import React from 'react';
import { logo_blue } from '../assets';
import { MdDashboard } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

const Navbar = ({
  current_project = "Project 1",
  projects = ["Project 1", "Project 2", "Project 3"],
}) => {
  return (
    <div className="flex flex-col h-screen bg-[#0052CC] fixed top-0 left-0 px-4 py-6">
      <img src={logo_blue} alt="Logo" className="w-48 mb-4" />
      <ul className="text-white-500 mx-2">
        {projects.map((project, index) => (
          <li key={index} className={`mb-4 ${project === current_project ? 'font-extrabold' : 'font-light'}`}>
            {project}
          </li>
        ))}
      </ul>
      <div className='flex-grow flex flex-col justify-end mb-6'>
        <ul className="flex flex-col space-y-6">
          <li className='flex items-center mr-2'>
            <span>
              <MdDashboard className='text-2xl mx-2'/>
            </span>
            <a href="#" className="text-white hover:underline">Dashboard</a>
          </li>
          <li className='flex items-center mr-2'>
            <span>
              <IoIosSettings className='text-2xl mx-2'/>
            </span>
            <a href="#" className="text-white hover:underline">Settings</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
