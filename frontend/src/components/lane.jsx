import React, { useState } from 'react';
import { LuBoxSelect } from "react-icons/lu";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCheckSquare } from "react-icons/fa";
import TaskItem  from './TaskItem ';

const Lane = ({ lane, tasks, userRole ,onDeleteTask, onTaskClick, onAddTaskClick }) => {

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

  const handleAddTaskClick=()=>{
    onAddTaskClick(lane.name)
  }

  return (
    <div className='mx-5 w-[33%]'>
      <div className={`border-solid border-[3px] rounded-2xl p-5`} style={style}>
        <div>
          <div className='flex flex-row'>
            <p className='mr-3 text-[20px]'>{Icon && <Icon />}</p>
            <p className='mb-4 mt-[-4px] text-[18px] font-medium'>{lane.name}</p>
          </div>
          {tasks.map((task, index) => (
              <TaskItem  key={task._id} task={task} onDeleteTask={onDeleteTask} userRole={userRole} onTaskClick={() => onTaskClick(task)} />
          ))}
        </div>
      </div>

      {/* "+" button */}
      {userRole==='viewer' ? (
      <div className="justify-center text-center content-center mt-4">
        <div 
          className='bg-[#0052CC] rounded-3xl w-[40px] h-[40px] mx-auto flex text-center text-white text-[35px] justify-center items-center hover:bg-blue-600 hover:cursor-not-allowed transition-transform duration-200 hover:scale-105 opacity-50'>
          +
        </div>
      </div>
      ):(
      <div className="justify-center text-center content-center mt-4">
        <div 
          className='bg-[#0052CC] rounded-3xl w-[40px] h-[40px] mx-auto flex text-center text-white text-[35px] justify-center items-center hover:bg-blue-600 hover:cursor-pointer transition-transform duration-200 hover:scale-105' 
          onClick={handleAddTaskClick}>
          +
        </div>
      </div>
      )}
    </div>
  );
}

export default Lane;
