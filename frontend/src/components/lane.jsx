import React, { useState } from 'react';
import { GoTrash } from "react-icons/go";
import { LuBoxSelect } from "react-icons/lu";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCheckSquare } from "react-icons/fa";
import TaskCard from './TaskCard'; // Import TaskCard component

const Lane = ({ lane, tasks, onDeleteTask }) => {
  const [showTaskCard, setShowTaskCard] = useState(false); // State for showing TaskCard
  const [newTask, setNewTask] = useState({
    taskTitle: '',
    taskDescription: '',
  });

  const handleDelete = (taskID) => {
    onDeleteTask(taskID);
  };

  const handleAddTask = () => {
    setShowTaskCard(true);
  };

  const handleCloseTaskCard = () => {
    setShowTaskCard(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  let Icon;
  switch (lane.icon) {
    case 'box':
      Icon = LuBoxSelect;
      break;
    case 'time':
      Icon = GiSandsOfTime;
      break;
    case 'check':
      Icon = FaRegCheckSquare;
      break;
    default:
      Icon = LuBoxSelect;
      break;
  }

  const style = {
    borderColor: lane.strokecolor,
    backgroundColor: lane.bgcolor,
    color: lane.textcolor,
    '--hover-bgcolor': lane.bgcolor,
  };

  return (
    <div className='mx-5 w-[33%]'>
      <div className={`border-solid border-2 rounded-2xl p-5`} style={style}>
        <div>
          <div className='flex flex-row'>
            <p className='mr-3 text-[24px]'>{Icon && <Icon />}</p>
            <p className='mb-4 text-[20px] font-medium'>{lane.name}</p>
          </div>
          {tasks.map((task, index) => (
            <div key={index} className='mb-2 border-solid border-2 rounded-2xl mt-2 ml-2 p-5 bg-white min-w-[300px] cursor-pointer transition-transform duration-300 hover:scale-105' style={{ borderColor: lane.strokecolor }}>
              <div className='flex flex-row justify-between'>
                <p className="font-semibold">{task.name}</p>
                <p className='text-slate-400 hover:text-[#D70000] text-[24px] transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleDelete(task._id)}><GoTrash /></p>
              </div>
              <p className="text-sm">{task.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TaskCard modal */}
      {showTaskCard && (
        <TaskCard
          onClose={handleCloseTaskCard}
          taskTitle={newTask.taskTitle}
          taskDescription={newTask.taskDescription}
        />
      )}

      {/* "+" button */}
      <div className="justify-center text-center content-center mt-4">
        <div className='bg-[#0052CC] rounded-3xl w-[40px] h-[40px] mx-auto flex text-center text-white text-[35px] justify-center items-center hover:bg-blue-600 hover:cursor-pointer transition-transform duration-300 hover:scale-110' onClick={handleAddTask}>
          +
        </div>
      </div>
    </div>
  );
}

export default Lane;
