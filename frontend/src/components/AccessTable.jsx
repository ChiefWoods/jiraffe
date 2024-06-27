import React, { useEffect, useState } from 'react';
import {
  AddCard,
  EditUserCard,
  SuccessToast
} from '../components';

// Sample data
const sampleUsers = [
  { id: '1', name: 'user_name', email: 'user_email', role: 'Admin' },
  { id: '2', name: 'user_name', email: 'user_email', role: 'Member' },
  { id: '3', name: 'user_name', email: 'user_email', role: 'Member' },
  { id: '4', name: 'user_name', email: 'user_email', role: 'Viewer' }
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
      };
    } else {
      throw new Error('Failed to fetch projectid');
    }
  } catch (error) {
    console.error('Error fetching projectid:', error);
    throw error;
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
      return data.project;
    } else {
      throw new Error('Failed to fetch project');
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
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
      return data.user;
    } else {
      throw new Error('Failed to fetch user details');
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
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
    ...adminList.map((user) => ({ id: user._id, name: user.name, email: user.email, role: 'Admin' })),
    ...memberList.map((user) => ({ id: user._id, name: user.name, email: user.email, role: 'Member' })),
    ...viewerList.map((user) => ({ id: user._id, name: user.name, email: user.email, role: 'Viewer' }))
  ];

  return allUsers;
}

const AccessTable = () => {
  const [users, setUsers] = useState([]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const toggleAddCard = () => {
    setIsAddCardOpen(!isAddCardOpen);
  };

  const toggleEditCard = (user) => {
    setSelectedUser(user);
    setIsEditCardOpen(!isEditCardOpen);
  };

  const updateUserRole = async (userId, newRole) => {
    const token = getCookie('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/${projectId}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId, role: newRole.toLowerCase() })
      });
      if (response.ok) {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
        setIsEditCardOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to update user role:', errorData);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deleteUser = async (userId) => {
    const token = getCookie('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/${projectId}/user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId })
      });
      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        const errorData = await response.json();
        console.error('Failed to delete user:', errorData);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getCookie('token');
      const urlParams = new URLSearchParams(window.location.search);
      const userID = urlParams.get('userid');
      const projectID = urlParams.get('projectid');

      if (token && userID) {
        try {
          setProjectId(projectID);
          const project = await fetchProject(token, projectID);
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

    // Check localStorage for the showToast flag
    if (localStorage.getItem('showAddUserToast') === 'true') {
      setShowToast(true);
      localStorage.removeItem('showAddUserToast');
    }
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAddSuccess = () => {
    setIsAddCardOpen(false);
    window.location.reload();
  };

  const renderActions = (user) => {
    if (user.role !== 'Admin') {
      return (
        <>
          <button className='bg-gray-100 text-blue-700 mr-2 hover:scale-105 px-4 py-2' onClick={() => toggleEditCard(user)}>✏️</button>
          <button
            className='bg-gray-100 text-red-700 hover:scale-105 px-4 py-2'
            onClick={() => deleteUser(user.id)}
          >🗑️</button>
        </>
      );
    } else {
      return (
        <p className='mr-2 p-[20px]'> </p>
      );
    }
  }

  return (
    <div className='mt-8 flex flex-col'>
      <div className='flex mt-8 ml-2 justify-between w-[930px]'>
        <p className='font-bold text-3xl text-blue-700 mb-8'>Access</p>
        <button className='bg-blue-700 text-white w-[110px] p-0 rounded h-[34px] text-base hover:scale-105' onClick={toggleAddCard}>Add User</button>
      </div>
      <table className='w-[1110px] table-auto border-collapse ml-4'>
        <thead>
          <tr>
            <th className='text-left w-[140px] pb-[10px]'>Name</th>
            <th className='text-left w-[190px] pb-[10px]'>Email</th>
            <th className='text-left w-[130px] pb-[10px]'>Role</th>
            <th className='text-left w-[170px] pb-[10px]'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className='py-2 w-[140px]'>{user.name}</td>
              <td className='py-2 w-[190px]'>{user.email}</td>
              <td className='py-2 w-[130px]'>
                <span className={roleStyles[user.role]}>{user.role}</span>
              </td>
              <td className='py-2 w-[170px]'>
                {renderActions(user)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showToast && <SuccessToast message="User added successfully" />}
      <AddCard isOpen={isAddCardOpen} onClose={toggleAddCard} projectId={projectId} onSuccess={handleAddSuccess} />
      {isEditCardOpen && selectedUser && (
        <EditUserCard
          isOpen={isEditCardOpen}
          onClose={() => setIsEditCardOpen(false)}
          user={selectedUser}
          onSave={updateUserRole}
        />
      )}
    </div>
  );  
};

export default AccessTable;
