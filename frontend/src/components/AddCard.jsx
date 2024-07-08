import React, { useEffect, useState } from 'react';
import { RxCross1 } from "react-icons/rx";

async function fetchAllUsers() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/user`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      return data.users;
    } else {
      throw new Error('Failed to fetch all users');
    }
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

function gatherAllEmails(allUsers) {
  const emails = {};
  allUsers.forEach((user) => {
    emails[user.email] = user._id;
  });
  return emails;
}

async function addUserToProject(projectId, userId, userRole) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/addusertoproject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: projectId,
        user_id: userId,
        user_role: userRole,
      }),
    });

    if (response.ok) {
      return 'User added to project';
    } else {
      const data = await response.json();
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error adding user to project:', error);
  }
}

const AddCard = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [errorMessage, setErrorMessage] = useState("");
  const rolesArray = ["Viewer", "Member"];

  useEffect(() => {
    if (isOpen) {
      fetchAllUsers()
        .then((users) => {
          setAllUsers(users);
        })
        .catch((error) => {
          console.error('Error fetching all users:', error);
        });
    }
  }, [isOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    const emails = gatherAllEmails(allUsers);
    const userId = emails[email];
    if (!email) {
      setErrorMessage('Email cannot be empty');
    } else if (!userId) {
      setErrorMessage('Email not found');
    } else {
      const message = await addUserToProject(projectId, userId, role.toLowerCase());
      if (message) {
        localStorage.setItem('showAddUserToast', 'true');
        onSuccess(); // Notify parent component
        setErrorMessage('');
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div className='z-40 fixed inset-0 flex items-center justify-center'>
      <div className="fixed inset-0 bg-black opacity-50"></div> {/* Overlay */}
      <div className="border-2 mx-auto bg-white p-6 rounded-md shadow-md flex flex-col w-[600px] h-[360px] max-w-full relative z-50">
        <div className='flex'>
          <p className='mt-1 mr-auto font-bold text-xl text-blue-700'>Add People to Project</p>
          <RxCross1 className="mt-1 text-blue-800 text-xl cursor-pointer mb-4" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className='flex mt-6'>
            <p className='font-semibold'>Email</p>
          </div>
          <div className='flex mt-2'>
            <input
              type='text'
              className='border-2 border-gray-300 rounded-md w-[520px] h-10 ml-1 pl-2'
              placeholder='Enter email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errorMessage && (
            <div className='flex mt-2'>
              <p className='text-red-600 text-sm ml-[10px] mb-[-100px]`'>{errorMessage}</p>
            </div>
          )}
          <div className='flex mt-6'>
            <p className='font-semibold'>Role</p>
          </div>
          <div className='flex mt-2'>
            <select
              className='border-2 border-gray-300 rounded-md w-[520px] h-10 ml-1 pl-2'
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {rolesArray.map((role, index) => (
                <option key={index}>{role}</option>
              ))}
            </select>
          </div>
          <div className='flex mt-6 justify-end'>
            <button type="button" className='bg-transparent text-black py-2 px-4 rounded-md' onClick={onClose}>Cancel</button>
            <button type="submit" className='bg-blue-800 text-white py-2 px-4 rounded-md ml-3'>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCard;
