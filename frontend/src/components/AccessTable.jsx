import React, { useEffect, useState } from 'react';
import {
  AddCard,
} from '../components';

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

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName.trim() === name) {
      return cookieValue;
    }
  }
  return null;
}

async function fetchProjectID(token, userID) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/user/${userID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return {
        projectID: data.projectID,
        projectName: data.projectName
      }; // Assuming the response provides project ID and name
    } else {
      throw new Error('Failed to fetch projectid');
    }
  } catch (error) {
    console.error('Error fetching projectid:', error);
    throw error; // Propagate the error for handling in the calling code
  }
}

async function fetchProject(token, projectID) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/${projectID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.project; // Assuming the response provides the project object directly
    } else {
      throw new Error('Failed to fetch project');
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error; // Propagate the error for handling in the calling code
  }
}

async function getUserDetails(token, userID) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/user/userdetails/${userID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.user; // Assuming the response provides user details directly
    } else {
      throw new Error('Failed to fetch user details');
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error; // Propagate the error for handling in the calling code
  }
}

async function parseUserDetails(project, token) {
  const { admin, members, viewers } = project;
  const adminUser = [getUserDetails(token, admin)];
  const memberUsers = members.map((member) => getUserDetails(token, member));
  const viewerUsers = viewers.map((viewer) => getUserDetails(token, viewer));

  const userDetails = await Promise.all([
    ...adminUser,
    ...memberUsers,
    ...viewerUsers
  ]);

  const adminList = userDetails.slice(0, adminUser.length);
  const memberList = userDetails.slice(adminUser.length, adminUser.length + memberUsers.length);
  const viewerList = userDetails.slice(adminUser.length + memberUsers.length);

  const allUsers = [
    ...adminList.map((user) => ({ name: user.name, email: user.email, role: 'Admin' })),
    ...memberList.map((user) => ({ name: user.name, email: user.email, role: 'Member' })),
    ...viewerList.map((user) => ({ name: user.name, email: user.email, role: 'Viewer' }))
  ];

  return allUsers;
}

const AccessTable = () => {
  const [users, setUsers] = useState([]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const toggleAddCard = () => {
    setIsAddCardOpen(!isAddCardOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getCookie('token');
      const urlParams = new URLSearchParams(window.location.search);
      const userID = urlParams.get('userid');

      if (token && userID) {
        try {
          const data = await fetchProjectID(token, userID);
          const project = await fetchProject(token, data.projectID);
          const allUsers = await parseUserDetails(project, token);
          setUsers(allUsers);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.error('Token or userID not found');
        setUsers(sampleUsers);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='mt-12 flex flex-col'>
      <div className='flex mt-8 ml-2 justify-between w-[930px]'>
        <p className='font-bold text-3xl text-blue-700 mb-8'>Access</p>
        <button className='bg-blue-700 text-white w-[100px] p-0 rounded h-[30px] text-sm' onClick={toggleAddCard}>Add User</button>
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
      {/* Add Card */}
      <AddCard isOpen={isAddCardOpen} onClose={toggleAddCard} />
    </div>
  );
};

export default AccessTable;
