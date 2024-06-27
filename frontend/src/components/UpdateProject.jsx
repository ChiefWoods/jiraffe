import React, { useEffect, useState } from 'react';
import { SuccessToast } from '.';

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
      return 'Project name updated successfully';
    } else {
      const data = await response.json();
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error('Error updating project name:', error);
  }
}

async function fetchUsername(userID) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/user/username/${userID}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      return data.username;
    } else {
      console.error('Failed to fetch username:', response.statusText);
      throw new Error('Failed to fetch username');
    }
  } catch (error) {
    console.error('Error fetching username:', error);
    throw new Error('Error fetching username');
  }
}

async function fetchProjectDetails(projectId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/${projectId}`, {
      method: 'GET'
    });

    if (response.ok) {
      const data = await response.json();
      return data.project;
    } else {
      console.error('Failed to fetch project details:', response.statusText);
      throw new Error('Failed to fetch project details');
    }
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw new Error('Error fetching project details');
  }
}

const UpdateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [projectLead, setProjectLead] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const token = getCookie('token');
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userid');
    const projectID = urlParams.get('projectid');
  
    if (token && userID) {
      updateProjectName(projectID, projectName)
        .then((message) => {
          // Reload and set flag to show toast
          window.location.reload();
          localStorage.setItem('showUpdateProjectToast', 'true');
        })
        .catch((error) => {
          console.error('Error updating project name:', error);
        });
    }
  }
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = getCookie('token');
        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get('userid');
        const projectID = urlParams.get('projectid');
  
        if (token && userID && projectID) {
          const project = await fetchProjectDetails(projectID);
          setProjectName(project.name);
  
          const username = await fetchUsername(project.admin);
          setProjectLead(username);
  
          // Check localStorage for the showToast flag
          if (localStorage.getItem('showUpdateProjectToast') === 'true') {
            setToastMessage('Project name updated successfully');
            setShowToast(true);
            localStorage.removeItem('showUpdateProjectToast');
          }
        }
      } catch (error) {
        console.error('Error fetching project details or username:', error);
      }
    };
  
    fetchDetails();
  }, []);
  
  // Auto-dismiss toast after 2.5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const dismissToast = () => {
    setShowToast(false);
  };

  return (
    <div className='relative'>
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
      {showToast && <SuccessToast message={toastMessage} onClose={dismissToast} />}
    </div>
  );
};

export default UpdateProject;
