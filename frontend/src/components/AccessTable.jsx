import React, { useEffect, useState } from 'react';

// Sample data
const sampleUsers = [
  { name: 'user_name', email: 'user_email', role: 'Admin' },
  { name: 'user_name', email: 'user_email', role: 'Member' },
  { name: 'user_name', email: 'user_email', role: 'Member' },
  { name: 'user_name', email: 'user_email', role: 'Viewer' }
];

const roleStyles = {
  Admin: 'bg-blue-100 text-blue-700 px-2 py-1 rounded',
  Member: 'bg-green-100 text-green-700 px-2 py-1 rounded',
  Viewer: 'bg-orange-100 text-orange-700 px-2 py-1 rounded'
};

const AccessTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from your API or use sample data
    // fetch('/api/users').then(response => response.json()).then(data => setUsers(data));
    setUsers(sampleUsers);
  }, []);

  return (
    <div className='mt-12 flex flex-col'>
      <div className='flex mt-8 ml-2 justify-between w-[930px]'>
        <p className='font-bold text-3xl text-blue-700 mb-8'>Access</p>
        <button className='bg-blue-700 text-white w-[100px] p-0 rounded h-[30px] text-sm'>Add User</button>
      </div>
      <table className='w-[1210px] table-auto border-collapse'>
        <thead>
          <tr>
            <th className='text-left'>Name</th>
            <th className='text-left'>Email</th>
            <th className='text-left'>Role</th>
            <th className='text-left'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className='py-2'>{user.name}</td>
              <td className='py-2'>{user.email}</td>
              <td className='py-2'>
                <span className={roleStyles[user.role]}>{user.role}</span>
              </td>
              <td className='py-2'>
                <button className='bg-gray-100 text-blue-700 mr-2'>✏️</button>
                <button className='bg-gray-100 text-red-700'>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessTable;
