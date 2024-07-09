import React, { useEffect, useState } from "react";
import { logo_blue } from "../assets";
import { MdDashboard } from "react-icons/md";
import { IoIosUndo } from "react-icons/io";
import { SuccessToast } from ".";

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

async function getProjectsByUserId(userId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/all/${userId}`, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      return data.projects;
    } else {
      throw new Error("Failed to fetch projects");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

async function getProjectById(projectId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/${projectId}`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return data.project;
    } else {
      console.error("Failed to fetch project:", response.status, response.statusText);
      throw new Error("Failed to fetch project");
    } 
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

const navigateToDashboard = (e) => {
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get('userid');
  const projectId = searchParams.get('projectid');

  e.preventDefault();
  window.location.href = `/dashboard?userid=${userId}&projectid=${projectId}`;
}

const DashboardLink = () => {
  return (
    <li className="flex items-center mr-2 hover:scale-105 tracking-wide">
      <span>
        <MdDashboard className="text-white text-2xl ml-[8px] mr-[4px]" />
      </span>
      <a href="/dashboard" className="text-white hover:text-white ml-2" onClick={navigateToDashboard}>
        Dashboard
      </a>
    </li>
  );
}

const Navbar = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [userName, setUserName] = useState('');

  function handleLogout(e) {
    e.preventDefault();
    document.cookie = `token=; max-age=0`;
    window.location.href = "/login";
  }

  function navigateToAnotherProject(projectId) {
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get('userid');
    window.location.href = `${currentPath}?userid=${userId}&projectid=${projectId}`;
    localStorage.setItem('showProjectChangedToast', 'true');
  }

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const userId = searchParams.get('userid');
      const projectId = searchParams.get('projectid');
    
      if (userId) {
        try {
          const projects = await getProjectsByUserId(userId);
          const currentProject = await getProjectById(projectId);
          const user = await getUserDetails(localStorage.getItem('token'), userId);
          const userName = user.name;

          setUserName(userName);
          
          setCurrentProject(currentProject);
          setProjects(projects.filter(project => project._id !== currentProject._id));

          // Check localStorage for the showToast flag
          if (localStorage.getItem('showProjectChangedToast') === 'true') {
            setShowToast(true);
            localStorage.removeItem('showProjectChangedToast');
          }
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.error('User ID not found in URL');
      }
    };

    fetchData();
  }, []);

  // Auto-dismiss toast after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showToast]);

  const dismissToast = () => {
    setShowToast(false);
  };

  return (
    <>
      {showToast && <SuccessToast message="Project changed successfully" onClose={dismissToast} />}
      <div className="items-center z-10 flex flex-col h-screen bg-[#0052CC] w-[240px] top-0 left-0 py-6">
        <a onClick={navigateToDashboard} className="cursor-pointer">
          <img src={logo_blue} alt="Logo" className="w-48" />
        </a>
        {/* app name */}
        <p className="text-white font-bold text-[20px] mb-[60px] font-mono tracking-wide cursor-default">Jiraffe.</p>
        <ul className="text-white-500">
          {currentProject && (
            <li key={currentProject._id} className="mb-[20px] text-white text-center tracking-wider cursor-default">
              <p
                className="block w-full bg-blue-600 font-bold py-[6px] px-[20px] focus:outline-none rounded-[16px] text-[15px]">
                {currentProject.name}
              </p>
            </li>
          )}
          {projects.map((project, index) => (
            <li key={index} className="mb-2 text-white hover:scale-105 tracking-wider">
              <button
                className={`block w-full text-left bg-transparent ${
                  project === currentProject ? "font-bold" : "font-light"
                } focus:outline-none text-[14px]`}
                onClick={() => navigateToAnotherProject(project._id)}
              >
                {project.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex-grow flex flex-col justify-end mb-6">
          <ul className="flex flex-col space-y-[30px]">
            <li className="mb-[10px] flex items-center mr-2 cursor-default">
              <p className="text-[24px] bg-blue-600 text-white font-bold px-4 py-2 rounded-full text-sm tracking-wider w-[140px] ml-[4px] text-center">{userName}</p>
            </li>
            <DashboardLink />
            <li className="flex items-center mr-2 tracking-wide">
              <button className="mb-[20px] flex items-center bg-white text-[#0052CC] hover:scale-105 ml-1 px-2 py-1 rounded-lg w-[140px] transition-colors duration-300" onClick={handleLogout}>
                <span>
                  <IoIosUndo className="text-2xl mr-[16px]" />
                </span>
                <p className="text-base font-bold">Log Out</p>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
