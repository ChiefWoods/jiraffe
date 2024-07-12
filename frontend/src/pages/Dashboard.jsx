import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext.jsx";
import { Navbar, Lane, AddUserCard, TaskCard, Toast } from "../components";
import {
  getProject,
  getProjectRole,
  getAllUsers,
  getTasks,
  deleteTask,
} from "../utils.js";
import { IoIosSettings } from "react-icons/io";

const Dashboard = ({
  sessionUserID,
  currentProject: project,
  setCurrentProject,
}) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setisEditing] = useState(false);
  const [userMapping, setUserMapping] = useState({});
  const [userRole, setUserRole] = useState("");
  const [assigneeIDs, setAssigneeIDs] = useState([]);
  const { toastMessage, setToastMessage } = useToast();

  const { projectID } = useParams();

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

  function getAssignees(assigneeIDs) {
    return assigneeIDs.map((id) => ({
      id,
      name: userMapping[id] || id,
    }));
  }

  function handleTaskClick(task) {
    setSelectedTask(task);
    setisEditing(true);
  }

  function handleAddTaskClick(laneName) {
    setSelectedTask({
      status: laneName,
    });
    setisEditing(false);
  }

  async function handleDeleteTask(taskID) {
    await deleteTask(taskID);
    setTasks(tasks.filter((task) => task._id !== taskID));
    setToastMessage("Task deleted successfully.");
  }

  function closeCard() {
    setSelectedTask(null);
  }

  useEffect(() => {
    async function fetchData() {
      const project = await getProject(projectID);
      setCurrentProject(project);

      const userRole = await getProjectRole(project._id, sessionUserID);
      setUserRole(userRole);

      const tasks = await getTasks(project._id);
      setTasks(tasks);

      const users = await getAllUsers();
      const mapping = {};

      users.forEach((user) => {
        mapping[user._id] = user.name;
      });

      setUserMapping(mapping);
      setAssigneeIDs([project.admin, ...project.members, ...project.viewers]);
    }

    fetchData();
  }, [projectID]);

  return (
    <div className="flex flex-row">
      <Navbar
        sessionUserID={sessionUserID}
        currentProject={project}
        setCurrentProject={setCurrentProject}
      />
      <div className="w-full px-10 py-5">
        <div className="mr-[20px] mt-5 flex flex-row justify-between">
          <p className="mt-[12px] text-[30px] font-semibold text-[#0052CC]">
            {project.name}
          </p>
          <div className="flex flex-row">
            <Link to={`/settings/${project._id}`}>
              <button
                type="button"
                className="group mr-5 flex h-[52px] flex-row items-center gap-x-2 border-2 border-slate-600 bg-white text-slate-600 hover:bg-slate-600 hover:text-white"
              >
                <IoIosSettings className="text-2xl group-hover:animate-spin" />
                <p className="text-[16px]">Settings</p>
              </button>
            </Link>
            {userRole !== "viewer" && (
              <button
                className="group flex h-[52px] flex-row items-center gap-x-2 border-2 border-[#0052CC] bg-white text-[#0052CC] hover:bg-[#0052CC] hover:text-white"
                onClick={() => handleAddTaskClick("TO DO")}
              >
                <p className="text-2xl">+</p>
                <p className="text-[16px]">Add Task</p>
              </button>
            )}
          </div>
        </div>
        <div className="mt-6 flex w-[80%] flex-row">
          {swimlanes.map((swimlane) => (
            <Lane
              key={swimlane.name}
              lane={swimlane}
              userRole={userRole}
              tasks={tasks.filter((task) => task.status === swimlane.name)}
              onTaskClick={handleTaskClick}
              onAddTaskClick={handleAddTaskClick}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
        {selectedTask && <AddUserCard closeCard={closeCard} />}
        {selectedTask && (
          <TaskCard
            sessionUserID={sessionUserID}
            projectID={project._id}
            task={selectedTask}
            isEditing={isEditing}
            taskStatusOptions={["TO DO", "IN PROGRESS", "DONE"]}
            availableAssignees={getAssignees(assigneeIDs)}
            closeCard={closeCard}
            setTasks={setTasks}
          />
        )}
      </div>
      {toastMessage && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
