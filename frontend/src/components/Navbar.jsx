import React, { useEffect, useState } from "react";
import { logo_blue } from "../assets";
import { MdDashboard } from "react-icons/md";
import { IoIosUndo } from "react-icons/io";
import { SuccessToast } from ".";

async function getProjectsByUserId(token, userId) {
  const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((err) => console.log(err));

  const data = await res.json();

  const projects = data.projects.filter((project) => {
    return (
      project.admin.toString() === userId ||
      project.members.includes(userId) ||
      project.viewers.includes(userId)
    );
  });

  return projects;
}

async function getProjectById(projectId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_END_URL}/project/${projectId}`,
      {
        method: "GET",
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.project;
    } else {
      console.error(
        "Failed to fetch project:",
        response.status,
        response.statusText,
      );
      throw new Error("Failed to fetch project");
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

const DashboardLink = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get("userid");
  const projectId = searchParams.get("projectid");

  const navigateToDashboard = (e) => {
    e.preventDefault();
    window.location.href = `/dashboard?userid=${userId}&projectid=${projectId}`;
  };

  return (
    <li className="mr-2 flex items-center tracking-wide hover:scale-105">
      <span>
        <MdDashboard className="mx-2 text-2xl text-white" />
      </span>
      <a
        href="/dashboard"
        className="ml-2 text-white hover:text-white"
        onClick={navigateToDashboard}
      >
        Dashboard
      </a>
    </li>
  );
};

const Navbar = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showToast, setShowToast] = useState(false);

  function handleLogout(e) {
    e.preventDefault();
    document.cookie = `token=; max-age=0`;
    window.location.href = "/login";
  }

  function navigateToAnotherProject(projectId) {
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get("userid");
    window.location.href = `${currentPath}?userid=${userId}&projectid=${projectId}`;
    localStorage.setItem("showProjectChangedToast", "true");
  }

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const userId = searchParams.get("userid");
      const projectId = searchParams.get("projectid");

      if (userId) {
        try {
          const projects = await getProjectsByUserId(
            document.cookie.token,
            userId,
          );
          const currentProject = await getProjectById(projectId);

          setCurrentProject(currentProject);
          setProjects(
            projects.filter((project) => project._id !== currentProject._id),
          );

          // Check localStorage for the showToast flag
          if (localStorage.getItem("showProjectChangedToast") === "true") {
            setShowToast(true);
            localStorage.removeItem("showProjectChangedToast");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.error("User ID not found in URL");
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
      {showToast && (
        <SuccessToast
          message="Project changed successfully"
          onClose={dismissToast}
        />
      )}
      <div className="left-0 top-0 z-10 flex h-screen w-[230px] flex-col bg-[#0052CC] px-0 py-6">
        <img src={logo_blue} alt="Logo" className="mb-4 w-48" />
        <ul className="text-white-500 mx-2 ml-2 pl-0">
          {currentProject && (
            <li
              key={currentProject._id}
              className="mb-2 bg-[#0052CC] tracking-wide text-white"
            >
              <button className="block w-full bg-[#0052CC] text-left font-extrabold focus:outline-none">
                {currentProject.name}
              </button>
            </li>
          )}
          {projects.map((project, index) => (
            <li
              key={index}
              className="mb-2 bg-[#0052CC] tracking-wide text-white hover:scale-105"
            >
              <button
                className={`block w-full bg-[#0052CC] text-left ${
                  project === currentProject ? "font-extrabold" : "font-light"
                } focus:outline-none`}
                onClick={() => navigateToAnotherProject(project._id)}
              >
                {project.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="mb-6 flex flex-grow flex-col justify-end">
          <ul className="ml-6 flex flex-col space-y-4">
            <DashboardLink />
            <li className="mr-2 flex items-center tracking-wide">
              <button
                className="ml-1 flex w-[140px] items-center rounded-lg bg-white px-2 py-1 text-[#0052CC] transition-colors duration-300 hover:scale-105"
                onClick={handleLogout}
              >
                <span>
                  <IoIosUndo className="mr-3 text-2xl" />
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
