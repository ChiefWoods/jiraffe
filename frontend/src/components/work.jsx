import React from 'react'
import { GoTrash } from "react-icons/go";
const work = ({task_name,task_description,task_status}) => {
  let color;
  switch(task_status){
    case 'todo':
      color='#81ACFF';
      break;
    case 'inprog':
      color="#FFE4C2";
      break;
    case 'done':
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
    <div className={`border-solid border-2 rounded-2xl mt-2 ml-2 p-5 w-[80%] `} style={style}>
      <div className=''>
        <div className='flex flex-row justify-between'>
          <p className='mb-4 text-[20px] font-medium text-[#14367B]'>{task_name}</p>
          <p className='text-[#D70000] text-[24px]  cursor-pointer'><GoTrash /></p>
        </div>
        
        <p className='text-[13px]'>{task_description}</p>
      </div>
      
      
    </div>
  )
}

export default work