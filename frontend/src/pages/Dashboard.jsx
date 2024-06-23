import React,{useEffect,useState} from 'react'
import { Work,Lane,Navbar } from '../components'
import { IoIosSettings } from "react-icons/io";
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
        projectID:data.projectID,
        projectName:data.projectName
      }; // Assuming the response provides username under 'username'
    } else {
      throw new Error('Failed to fetch projectid');
    }
  } catch (error) {
    console.error('Error fetching projectid:', error);
    throw error; // Propagate the error for handling in the calling code
  }
}


const Dashboard = () => {
  const [username, setUsername] = useState(null);
  const [projectID,setProjectID]=useState(null);
  const [projectName,setProjectName]=useState(null);
  useEffect(() => {
    const token = getCookie('token'); // Get token from cookies or local storage
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userid'); // Get user_id from URL query parameter

    if (token && userID) {
      fetchUsername(token, userID)
        .then(username => {
          setUsername(username);
        })
        .catch(error => {
          console.error('Error fetching username:', error);
          // Handle error state or notify the user
        });

      fetchProjectID(token,userID)
        .then(projectDetails =>{
          const { projectID, projectName } = projectDetails;
          setProjectID(projectID);
          setProjectName(projectName);
          console.log(projectID);
          console.log(projectName)
        })
        .catch(error => {
          console.error('Error fetching projectid:', error);
          // Handle error state or notify the user
        }); 
    }
  }, []);
  const tasks=[
    { task_name: 'Task 1', task_description: 'Description 1', task_status: 'todo' },
    { task_name: 'Task 2', task_description: 'Description 2', task_status: 'inprog' },
    { task_name: 'Task 3', task_description: 'Description 3', task_status: 'done' },
  ];
  const swimlanes=[
    {lane_name:'TO DO',lane_icon:'box',bgcolor:'#DEDCFF',strokecolor:'#81ACFF',textcolor:'#0046AF'},
    {lane_name:'IN PROGRESS',lane_icon:'time',bgcolor:'#FFF6EB',strokecolor:'#FFE4C2',textcolor:'#8F4F00'},
    {lane_name:'DONE',lane_icon:'check',bgcolor:'#E9FFEA',strokecolor:'#AAF0C9',textcolor:'#3A5F3A'}
  ]
  return (
    <div className='flex flex-row'>
      <Navbar/>
      <div className=" w-[100%] px-10 py-5">
        <div className=" mr-[20px] mt-5 flex flex-row justify-between">
          <p className="text-[#0052CC] text-[33px] font-semibold">online-task-mgmt-tool</p>
          <div className='flex flex-row'>
            <button className="border-slate-400 border-2 bg-white text-slate-400 hover:text-white text-slate-400 mr-5 flex flex-row hover:bg-slate-400 group items-center">
              <IoIosSettings className=' text-2xl mr-1  group-hover:animate-spin '/>
              Settings
            </button>
            <button className="border-[#0052CC]  border-2 bg-white text-[#0052CC] hover:bg-[#0052CC] hover:text-white flex flex-row items-center group">
              <p className="text-2xl group-hover:animate-bounce mr-1">+</p>
              <p className='text-[16px]'>Add Task</p>
            </button>
          </div>
        </div>
        <div className='ml-[20px] mt-[10px] items-center'>
          <p className='text-[#0052CC] text-[28px] font-semibold'>{projectName}</p>
          <div className=' w-fit py-2 px-3 mt-[20px] rounded-3xl border-2 border-[#0052CC] '>
            <p className='flex flex-row text-[28px] font-semibold ml-[5px] text-[#0052CC]'><FaTasks className='mr-[5px]' />Task List</p>
          </div>
        </div>
        
      {/* map the task data */}
      {/* {tasks.map((task,index)=>(
        <Work key={index} task_name={task.task_name} task_description={task.task_description} task_status={task.task_status}/>
      ))} */}
      <div className="flex flex-row w-[80%] mt-6">
        {swimlanes.map((swimlane,index)=>(
        <Lane key={index} lane_name={swimlane.lane_name} lane_icon={swimlane.lane_icon} bgcolor={swimlane.bgcolor} strokecolor={swimlane.strokecolor} textcolor={swimlane.textcolor}/>
        ))}
      </div>
      
      </div>
      

    </div>
    
  );
};

export default Dashboard