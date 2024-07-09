import React from 'react'
import { GoTrash } from "react-icons/go";
import TaskCard from './TaskCard';
const TaskItem  = ({task,onDeleteTask,userRole,onTaskClick}) => {
  let color;
  switch(task.status){
    case 'TO DO':
      color='#81ACFF';
      break;
    case 'IN PROGRESS':
      color="#FFE4C2";
      break;
    case 'DONE':
      color="#AAF0C9";
      break;
    default:
      color="#AAF0C9";
      break;
  }

  const style={
    borderColor:color
  }


  return (
    <>
    {userRole ==='viewer'?(
      <div className={`mb-2 border-solid border-[3px] rounded-2xl mt-2 ml-2 p-5 bg-white min-w-[300px] cursor-not-allowed transition-transform duration-300 hover:scale-105 opacity-75 `} style={style} >
      <div className='flex flex-row justify-between'>
        <p className="font-semibold">{task.name}</p>
        <p className='text-slate-400 hover:text-[#D70000] text-[24px] transition-transform duration-300 hover:scale-105 cursor-not-allowed' ><GoTrash /></p>
      </div>
      <p className="text-sm">{task.desc}</p>

    </div>
    ):(
      <div className={`mb-2 border-solid border-[3px] rounded-2xl mt-2 ml-2 p-5 bg-white min-w-[300px] cursor-pointer transition-transform duration-300 hover:scale-105 `} style={style} onClick={onTaskClick}>
      <div className='flex flex-row justify-between'>
        <p className="font-semibold">{task.name}</p>
        <p className='text-slate-400 hover:text-[#D70000] text-[24px] transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={(e) => { e.stopPropagation(); onDeleteTask(task._id); }}><GoTrash /></p>
      </div>
      <p className="text-sm">{task.desc}</p>

    </div>
    )}
    </>
    
  )
}

export default TaskItem 