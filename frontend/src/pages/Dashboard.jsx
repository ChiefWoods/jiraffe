import React, { useEffect, useState } from 'react';
import { Navbar, Lane,AddCard, TaskCard  } from '../components';
import { IoIosSettings } from "react-icons/io";
import Select from 'react-select'
import { FaTasks } from "react-icons/fa";

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

async function fetchProject(token, projID) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/${projID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return {
        projectID: data.project._id,
        projectName: data.project.name,
        projectAdmin:data.project.admins,
        projectMembers:data.project.members,
        projectViewers:data.project.viewers
      }; // Assuming the response provides project ID and name
    } else {
      throw new Error('Failed to fetch projectid');
    }
  } catch (error) {
    console.error('Error fetching projectid:', error);
    throw error; // Propagate the error for handling in the calling code
  }
}

async function fetchTasks(token, projectID) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/${projectID}/task`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.tasks; // Assuming the response provides tasks array
    } else {
      throw new Error('Failed to fetch tasks');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; // Propagate the error for handling in the calling code
  }
}

async function deleteTask(token,taskID){
  try{
    const response=await fetch(`${import.meta.env.VITE_BACK_END_URL}/task/${taskID}`,{
      method:'DELETE',
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });
    if(response.ok){
      return true;
    }else
    {
      throw new Error('Failed to delete task');
    }
  }catch(error){
    console.error('Error deleting tasks:',error);
    throw error;
  }
}

const SettingsLink = () => {
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userid');
  const projectId = searchParams.get('projectid');

  const navigateToSettings = (e) => {
    e.preventDefault();
    window.location.href = `/settings?userid=${userId}&projectid=${projectId}`;
  };

  return (
    <a href="/settings" onClick={navigateToSettings}>
      <button className="border-slate-400 border-2 bg-white text-slate-400 hover:text-white text-slate-400 mr-5 flex flex-row hover:bg-slate-400 group items-center">
        <IoIosSettings className='text-2xl mr-1 group-hover:animate-spin' />
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
  const [isAddCardOpen, setisAddCardOpen] = useState(false); // State to control the modal
  const [selectedTask,setSelectedTask]=useState(null); //state to manage selected task
  const [isEditing,setisEditing]=useState(false)
  const [userMapping, setUserMapping] = useState({});


  const rolesArray = ["Viewer", "Member", "Admin"];

  const toggleAddCard = () => {
    setisAddCardOpen(!isAddCardOpen); // Toggle the state to open or close the modal
  };

  useEffect(() => {
    const token = getCookie('token');
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userid');
    const projID = urlParams.get('projectid')
  
    const fetchData = async () => {
      try {
        // Fetch username
        const username = await fetchUsername(token, userID);
        setUsername(username);
  
        // Fetch project details
        const projectDetails = await fetchProject(token, projID);
        const { projectID, projectName, projectMembers, projectViewers, projectAdmin } = projectDetails;
        console.log(projectDetails);
        setProjectID(projectID);
        console.log(projectID);
        setProjectName(projectName);
        setprojectMembers(projectMembers);
        setprojectViewers(projectViewers);
        setprojectAdmin(projectAdmin);
  
        // Fetch tasks
        if (projID) {
          const tasks = await fetchTasks(token, projectID);
          setTasks(tasks);
        } else {
          throw new Error('No project ID found');
        }
  
        // Fetch assignee names (users)
        const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/user`);
        const data = await response.json();
  
        const mapping = {};
        data.users.forEach(user => {
          mapping[user._id] = user.name;
        });
        setUserMapping(mapping);
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const assignees=[...projectMembers,...projectViewers]
  const getAssignees = (assigneeIDs) => {
    return assigneeIDs.map(id => ({
      id,
      name: userMapping[id] || id
    }));
  };
 

  const handleDeleteTask=async(taskID)=>{
    try{
      const token=getCookie('token');
      const isDeleted= await deleteTask(token,taskID);
      if(isDeleted){
        setTasks(tasks.filter(task=>task._id !==taskID));
        console.log('task deleted successfully')
      }else{
        console.error('Failed to delete task')
      }
    }catch(error){
      console.error('Error deleting task:',error);
    }
  }

  const handleTaskClick=(task)=>{
    setSelectedTask(task);
    setisEditing(true);
    setisTaskCardOpen(true);
  };

  const handleAddTaskClick=(laneName,projectID)=>{
    console.log('handleaddtask clicked')
    console.log(projectID);
    setSelectedTask({
      status:laneName,
      projectID
    });
    console.log(selectedTask);
    setisEditing(false);
    setisTaskCardOpen(true);
    console.log(isTaskCardOpen)
  }

  const closeTaskCard=()=>{
    setSelectedTask(null);
    setisTaskCardOpen(false);
  }

  const swimlanes = [
    { name: 'TO DO', icon: 'box', bgcolor: '#DEDCFF', strokecolor: '#81ACFF', textcolor: '#0046AF' },
    { name: 'IN PROGRESS', icon: 'time', bgcolor: '#FFF6EB', strokecolor: '#FFE4C2', textcolor: '#8F4F00' },
    { name: 'DONE', icon: 'check', bgcolor: '#E9FFEA', strokecolor: '#AAF0C9', textcolor: '#3A5F3A' }
  ];

  return (
    <div className='flex flex-row'>
      <Navbar />
      <div className="w-[100%] px-10 py-5">
        <div className="mr-[20px] mt-5 flex flex-row justify-between">
          <p className="text-[#0052CC] text-[33px] font-semibold">{projectName}</p>
          <div className='flex flex-row'>
            <SettingsLink />
            <button className="border-[#0052CC] border-2 bg-white text-[#0052CC] hover:bg-[#0052CC] hover:text-white flex flex-row items-center group" onClick={() => handleAddTaskClick('TO DO', projectID)}>
              <p className="text-2xl group-hover:animate-bounce mr-1">+</p>
              <p className='text-[16px]'>Add Task</p>
            </button>
          </div>
        </div>

        <div className="flex flex-row w-[80%] mt-6">
          {swimlanes.map((swimlane, index) => (
            <Lane key={index} lane={swimlane} tasks={tasks.filter(task => task.status === swimlane.name)} onDeleteTask={handleDeleteTask} onTaskClick={handleTaskClick} onAddTaskClick={(laneName) => handleAddTaskClick(laneName, projectID)}/>
          ))}
        </div>

        <AddCard isOpen={isAddCardOpen} onClose={toggleAddCard} />
        
        {selectedTask && (
          <TaskCard
          task={selectedTask}
          isEditing={isEditing}
          taskStatusOptions={['TO DO', 'IN PROGRESS', 'DONE']}
          onClose={closeTaskCard}
          availableAssignees={getAssignees(assignees)}
          projectID={projectID}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
