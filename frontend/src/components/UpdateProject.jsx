import React, { useEffect, useState } from 'react';

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

async function fetchUsername(token, userID) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/user/username/${userID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.username; // Assuming the response provides username under 'username'
    } else {
      throw new Error('Failed to fetch username');
    }
  } catch (error) {
    console.error('Error fetching username:', error);
    throw error; // Propagate the error for handling in the calling code
  }
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

async function updateProjectName(projectID, projectName) {
  const token = getCookie('token');
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/${projectID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: projectName })
    });

    if (response.ok) {
      console.log('Project name updated successfully');
    } else {
      const data = await response.json();
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error updating project name:', error);
  }
}

const UpdateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [projectLead, setProjectLead] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const token = getCookie('token');
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userid');

    if (token && userID) {
      fetchProjectID(token, userID)
        .then((projectDetails) => {
          const { projectID } = projectDetails;
          updateProjectName(projectID, projectName);
        })
        .catch((error) => {
          console.error('Error fetching projectID:', error);
        });
    }
  }

  useEffect(() => {
    const token = getCookie('token');
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userid');

    if (token && userID) {
      fetchUsername(token, userID)
        .then((username) => {
          setProjectLead(username);
        })
        .catch((error) => {
          console.error('Error fetching username:', error);
        });

      fetchProjectID(token, userID)
        .then((projectDetails) => {
          const { projectID, projectName } = projectDetails;
          setProjectName(projectName);
        })
        .catch((error) => {
          console.error('Error fetching projectID:', error);
        });
    }
  }, []);

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleProjectLeadChange = (e) => {
    setProjectLead(e.target.value);
  };

  return (
    <form className='mt-12 flex flex-col' onSubmit={handleSubmit}>
      <p className='font-bold text-3xl text-blue-700 mb-8'>Project Settings</p>
      {/* Row */}
      <div className='flex ml-8'>
        <div className='flex flex-col mr-8'>
          <label className='font-semibold text-lg text-black mb-2' htmlFor="project-name">Project Name</label>
          <input 
            className='border border-gray-300 w-[440px] p-2 rounded' 
            type="text" 
            id="project-name" 
            name="project-name" 
            value={projectName}
            onChange={handleProjectNameChange}
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-lg text-black mb-2' htmlFor="project-lead">Project Lead</label>
          <p className='border border-gray-300 w-[440px] p-2 rounded text-base'>{projectLead}</p>
        </div>
      </div>
      {/* Row */}
      <div className='flex mt-8 ml-8'>
        <div className='flex flex-col'>
          <button className='bg-blue-700 text-white w-[140px] p-2 rounded'>Save Changes</button>
        </div>
      </div>
    </form>
  );
};

export default UpdateProject;
