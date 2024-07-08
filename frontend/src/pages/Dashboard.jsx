import React, { useEffect, useState } from "react";
import { Navbar, Lane, AddCard, TaskCard } from "../components";
import { IoIosSettings } from "react-icons/io";
import Select from "react-select";
import { FaTasks } from "react-icons/fa";

const SettingsLink = () => {
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userid");
  const projectId = searchParams.get("projectid");

  const navigateToSettings = (e) => {
    e.preventDefault();
    window.location.href = `/settings?userid=${userId}&projectid=${projectId}`;
  };

  return (
    <a onClick={navigateToSettings}>
      <button className="group mr-5 flex flex-row items-center border-2 border-slate-400 bg-white text-slate-400 hover:bg-slate-400 hover:text-white">
        <IoIosSettings className="mr-1 text-2xl group-hover:animate-spin" />
        Settings
      </button>
    </a>
  );
};

const Dashboard = () => {
  const [username, setUsername] = useState(null);
  const [projectID, setProjectID] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [projectMembers, setprojectMembers] = useState([]);
  const [projectViewers, setprojectViewers] = useState([]);
  const [projectAdmin, setprojectAdmin] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isTaskCardOpen, setisTaskCardOpen] = useState(false);
  const [isAddCardOpen, setisAddCardOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setisEditing] = useState(false);
  const [userMapping, setUserMapping] = useState({});

  const roles = ["Viewer", "Member", "Admin"];
  const assignees = [...projectMembers, ...projectViewers];

  const toggleAddCard = () => {
    setisAddCardOpen(!isAddCardOpen);
  };

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

  async function fetchProject(token, userID) {
    const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => console.log(err));

    const data = await res.json();

    return data.projects.find((project) => project.admin.toString() === userID);
  }

  async function fetchTasks(token, projectID) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACK_END_URL}/project/${projectID}/task`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      return data.tasks;
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    }
  }

  async function deleteTask(token, taskID) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACK_END_URL}/task/${taskID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        setTasks(tasks.filter((task) => task._id !== taskID));
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Error deleting tasks:", err.message);
    }
  }

  const getAssigneeNames = (assigneeIDs) => {
    return assigneeIDs.map((id) => userMapping[id] || id);
  };

  const handleDeleteTask = async (taskID) => {
    const token = getCookie("token");
    await deleteTask(token, taskID);
  };

  const handleTaskClick = (task) => {
    setSelectedTask({
      ...task,
      projectID,
    });
    setisEditing(true);
    setisTaskCardOpen(true);
  };

  const handleAddTaskClick = (laneName, projectID) => {
    setSelectedTask({
      status: laneName,
      projectID,
    });
    setisEditing(false);
    setisTaskCardOpen(true);
  };

  const closeTaskCard = () => {
    setSelectedTask(null);
    setisTaskCardOpen(false);
  };
  178;

  const swimlanes = [
    {
      name: "TO DO",
      icon: "box",
      bgcolor: "#DEDCFF",
      strokecolor: "#81ACFF",
      textcolor: "#0046AF",
    },
    {
      name: "IN PROGRESS",
      icon: "time",
      bgcolor: "#FFF6EB",
      strokecolor: "#FFE4C2",
      textcolor: "#8F4F00",
    },
    {
      name: "DONE",
      icon: "check",
      bgcolor: "#E9FFEA",
      strokecolor: "#AAF0C9",
      textcolor: "#3A5F3A",
    },
  ];

  useEffect(() => {
    const token = getCookie("token");
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get("userid");

    const fetchData = async () => {
      const username = await fetchUsername(token, userID);
      setUsername(username);

      const projectDetails = await fetchProject(token, userID);
      setProjectID(projectDetails._id);
      setProjectName(projectDetails.name);
      setprojectMembers(projectDetails.members);
      setprojectViewers(projectDetails.viewers);
      setprojectAdmin(projectDetails.admin);

      if (projectDetails._id) {
        const tasks = await fetchTasks(token, projectDetails._id);
        setTasks(tasks);
      } else {
        throw new Error("No project ID found");
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACK_END_URL}/user`,
      ).catch((err) => console.error(err));
      const data = await res.json();

      const mapping = {};

      data.users.forEach((user) => {
        mapping[user._id] = user.name;
      });

      setUserMapping(mapping);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-[100%] px-10 py-5">
        <div className="mr-[20px] mt-5 flex flex-row justify-between">
          <p className="text-[33px] font-semibold text-[#0052CC]">
            {projectName}
          </p>
          <div className="flex flex-row">
            <SettingsLink />
            <button
              className="group flex flex-row items-center border-2 border-[#0052CC] bg-white text-[#0052CC] hover:bg-[#0052CC] hover:text-white"
              onClick={() => handleAddTaskClick("TO DO", projectID)}
            >
              <p className="mr-1 text-2xl group-hover:animate-bounce">+</p>
              <p className="text-[16px]">Add Task</p>
            </button>
          </div>
        </div>

        <div className="mt-6 flex w-[80%] flex-row">
          {swimlanes.map((swimlane, index) => (
            <Lane
              key={index}
              lane={swimlane}
              tasks={tasks.filter((task) => task.status === swimlane.name)}
              onDeleteTask={handleDeleteTask}
              onTaskClick={handleTaskClick}
              onAddTaskClick={(laneName) =>
                handleAddTaskClick(laneName, projectID)
              }
            />
          ))}
        </div>

        <AddCard isOpen={isAddCardOpen} onClose={toggleAddCard} />

        {selectedTask && (
          <TaskCard
            task={selectedTask}
            isEditing={isEditing}
            taskStatusOptions={["TO DO", "IN PROGRESS", "DONE"]}
            onClose={closeTaskCard}
            availableAssignees={getAssigneeNames(assignees)}
            setTasks={setTasks}
            userMapping={userMapping}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
