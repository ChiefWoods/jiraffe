import React, { useEffect, useState } from "react";
import { SuccessToast } from ".";

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return cookieValue;
    }
  }
  return null;
}

async function updateProjectName(projectID, projectName) {
  const token = getCookie("token");
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_END_URL}/project/${projectID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: projectName }),
      },
    );

    if (response.ok) {
      return "Project name updated successfully";
    } else {
      const data = await response.json();
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error("Error updating project name:", error);
  }
}

async function fetchUsername(token, userID) {
  const res = await fetch(
    `${import.meta.env.VITE_BACK_END_URL}/user/${userID}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ).catch((err) => console.log(err));

  if (res.ok) {
    const data = await res.json();

    return data.user.name;
  } else {
    throw new Error(data.message);
  }
}

async function fetchProjectDetails(projectId) {
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
      console.error("Failed to fetch project details:", response.statusText);
      throw new Error("Failed to fetch project details");
    }
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw new Error("Error fetching project details");
  }
}

const UpdateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectLead, setProjectLead] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const token = getCookie("token");
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get("userid");
    const projectID = urlParams.get("projectid");

    if (token && userID) {
      updateProjectName(projectID, projectName)
        .then((message) => {
          // Reload and set flag to show toast
          window.location.reload();
          localStorage.setItem("showUpdateProjectToast", "true");
        })
        .catch((error) => {
          console.error("Error updating project name:", error);
        });
    }
  }

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = getCookie("token");
        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get("userid");
        const projectID = urlParams.get("projectid");

        if (token && userID && projectID) {
          const project = await fetchProjectDetails(projectID);
          setProjectName(project.name);

          const username = await fetchUsername(token, project.admin);
          setProjectLead(username);

          // Check localStorage for the showToast flag
          if (localStorage.getItem("showUpdateProjectToast") === "true") {
            setToastMessage("Project name updated successfully");
            setShowToast(true);
            localStorage.removeItem("showUpdateProjectToast");
          }
        }
      } catch (error) {
        console.error("Error fetching project details or username:", error);
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
    <div className="relative">
      <form className="mt-12 flex flex-col" onSubmit={handleSubmit}>
        <p className="mb-8 text-3xl font-bold text-blue-700">Project Details</p>
        {/* Row */}
        <div className="ml-2 flex">
          <div className="mr-8 flex flex-col">
            <label
              className="mb-2 text-lg font-semibold text-black"
              htmlFor="project-name"
            >
              Project Name
            </label>
            <input
              className="w-[440px] rounded border border-gray-300 p-2"
              type="text"
              id="project-name"
              name="project-name"
              value={projectName}
              onChange={handleProjectNameChange}
            />
          </div>
          <div className="flex flex-col">
            <label
              className="mb-2 text-lg font-semibold text-black"
              htmlFor="project-lead"
            >
              Project Lead
            </label>
            <p className="w-[440px] rounded border border-gray-300 bg-gray-300 p-2 text-base">
              {projectLead}
            </p>
          </div>
        </div>
        {/* Row */}
        <div className="ml-2 mt-8 flex">
          <div className="flex flex-col">
            <button className="w-[140px] rounded bg-blue-700 p-2 text-white hover:scale-105">
              Save Changes
            </button>
          </div>
        </div>
      </form>
      {showToast && (
        <SuccessToast message={toastMessage} onClose={dismissToast} />
      )}
    </div>
  );
};

export default UpdateProject;
