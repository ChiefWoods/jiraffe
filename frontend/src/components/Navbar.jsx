import React, { useEffect, useState } from "react";
import { logo_blue } from "../assets";
import { MdDashboard } from "react-icons/md";
import { IoIosUndo } from "react-icons/io";

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

const DashboardLink = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get('userid');
  const projectId = searchParams.get('projectid');

  const navigateToDashboard = (e) => {
    e.preventDefault();
    window.location.href = `/dashboard?userid=${userId}&projectid=${projectId}`;
  }

  return (
    <li className="flex items-center mr-2">
      <span>
        <MdDashboard className="text-white text-2xl mx-2" />
      </span>
      <a href="/dashboard" className="text-white hover:underline ml-2" onClick={navigateToDashboard}>
        Dashboard
      </a>
    </li>
  );
}

const Navbar = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);

  function handleLogout(e) {
    e.preventDefault();
    document.cookie = `token=; max-age=0`;
    window.location.href = "/login";
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
          
          setCurrentProject(currentProject);
          setProjects(projects.filter(project => project._id !== currentProject._id));
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.error('User ID not found in URL');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="z-10 flex flex-col h-screen bg-[#0052CC] w-[230px] top-0 left-0 px-0 py-6">
      <img src={logo_blue} alt="Logo" className="w-48 mb-4" />
      <ul className="text-white-500 mx-2 pl-0 ml-2">
        {currentProject && (
          <li key={currentProject._id} className={`mb-2 bg-[#0052CC] text-white`}>
            <button
              className="block w-full text-left bg-[#0052CC] font-extrabold"
            >
              {currentProject.name}
            </button>
          </li>
        )}
        {projects.map((project, index) => (
          <li key={index} className={`mb-2 bg-[#0052CC] text-white`}>
            <button
              className={`block w-full text-left bg-[#0052CC] ${
                project === currentProject ? "font-extrabold" : "font-light"
              }`}
            >
              {project.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex-grow flex flex-col justify-end mb-6">
        <ul className="flex flex-col space-y-6 ml-6">
          <DashboardLink />
          <li className="flex items-center mr-2">
            <button className="flex items-center bg-white text-[#0052CC] hover:text-white hover:bg-[#0052CC] ml-1 px-2 py-1 rounded-lg w-[160px] transition-colors duration-300" onClick={handleLogout}>
              <span>
                <IoIosUndo className="text-2xl mr-3" />
              </span>
              <p>Log Out</p>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
