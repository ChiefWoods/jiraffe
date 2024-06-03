import React from 'react';

const Navbar = () => {
  return (
    <div className="w-48 h-screen bg-gray-800 fixed top-0 left-0 flex flex-col items-center py-4">
      <ul className="space-y-4">
        <li><a href="#" className="text-white hover:underline">Home</a></li>
        <li><a href="#" className="text-white hover:underline">About</a></li>
        <li><a href="#" className="text-white hover:underline">Services</a></li>
        <li><a href="#" className="text-white hover:underline">Contact</a></li>
      </ul>
    </div>
  );
};

export default Navbar;
