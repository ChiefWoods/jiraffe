import React,{useState,useEffect} from 'react'
import { GoTrash } from "react-icons/go";
import { LuBoxSelect } from "react-icons/lu";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCheckSquare } from "react-icons/fa";
import work from './work';

const lane = ({lane_name,lane_icon,bgcolor,strokecolor,textcolor}) => {
  const tasks=[
    { task_name: 'Task 1', task_description: 'Description 1', task_status: 'TO DO' },
    { task_name: 'Task 2', task_description: 'Description 2', task_status: 'IN PROGRESS' },
    { task_name: 'Task 3', task_description: 'Description 3', task_status: 'DONE' },
    { task_name: 'Task 4', task_description: 'Description 4', task_status: 'TO DO' },
  ];
let Icon;
  switch(lane_icon){
    case 'box':
      Icon=LuBoxSelect;
      break;
    case 'time':
      Icon=GiSandsOfTime;
      break;
    case 'check':
      Icon=FaRegCheckSquare;
      break;
    default:
      Icon=LuBoxSelect;
      break;
  }

      
  const style={
    borderColor:strokecolor,
    backgroundColor:bgcolor,
    color:textcolor,
    '--hover-bgcolor': bgcolor,
  }

  const laneTasks=tasks.filter(task=>task.task_status===lane_name);

  return (
    <div className='mx-5 w-[33%]'>
          <div className={`border-solid border-2 rounded-2xl  p-5  `} style={style}>
        <div className=''>
          <div className='flex flex-row'>
            <p className='mr-3 text-[24px] '>{Icon && <Icon/>}</p>
            <p className='mb-4 text-[20px] font-medium'>{lane_name}</p>
          </div>
          {laneTasks.map((task,index)=>(
            <div key={index} className='mb-2 border-solid border-2 rounded-2xl mt-2 ml-2 p-5  bg-white min-w-[300px] cursor-pointer transition-transform duration-300 hover:scale-105 ' style={{borderColor:strokecolor}}>
              <div className='flex flex-row justify-between'>
                <p className="font-semibold">{task.task_name}</p>
                <p className='text-slate-400 hover:text-[#D70000] text-[24px] transition-transform duration-300 hover:scale-105  cursor-pointer'><GoTrash /></p>
              </div>
              
              <p className="text-sm">{task.task_description}</p>
            </div>
          ))}
        </div>      
      </div>

      <div className="  justify-center text-center content-center mt-4 ">
        <div className='bg-[#0052CC] rounded-3xl w-[40px] h-[40px] mx-auto flex text-center text-white text-[35px] justify-center items-center hover:bg-blue-600 hover:cursor-pointer transition-transform duration-300 hover:scale-110 '>
          +
        </div>
      </div>
    </div>
    
    
  )
}

export default lane