import React from 'react';
import { GoTrash } from "react-icons/go";

const TaskItem = ({ task, onDeleteTask, userRole, onTaskClick }) => {
  let color;
  switch(task.status){
    case 'TO DO':
      color = '#81ACFF';
      break;
    case 'IN PROGRESS':
      color = "#FFE4C2";
      break;
    case 'DONE':
      color = "#AAF0C9";
      break;
    default:
      color = "#AAF0C9";
      break;
  }

  const style = {
    borderColor: color
  }

  return (
    <div 
      className={`ml-[2px] mb-2 border-solid border-[3px] rounded-2xl mt-2 ml-2 p-5 bg-white min-w-[300px] transition-transform duration-200 hover:scale-105 ${userRole === 'viewer' ? 'cursor-pointer opacity-75' : 'cursor-pointer'}`} 
      style={style} 
      onClick={onTaskClick}
    >
      <div className='mb-[6px] flex flex-row justify-between'>
        <p className="font-semibold">{task.name}</p>
        {userRole !== 'viewer' && (
          <p 
            className='text-slate-400 hover:text-[#D70000] text-[22px] transition-transform duration-300 hover:scale-105 cursor-pointer' 
            onClick={(e) => { 
              e.stopPropagation(); 
              onDeleteTask(task._id); 
            }}
          >
            <GoTrash />
          </p>
        )}
      </div>
      <p className="text-sm">{task.desc}</p>
    </div>
  )
}

export default TaskItem;
