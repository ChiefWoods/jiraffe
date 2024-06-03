import React,{useState,useEffect} from 'react'
import { GoTrash } from "react-icons/go";
import { LuBoxSelect } from "react-icons/lu";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCheckSquare } from "react-icons/fa";

const lane = ({lane_name,lane_icon,bgcolor,strokecolor,textcolor}) => {
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
    color:textcolor
  }

  return (
    <div className={`border-solid border-2 rounded-2xl mt-2 ml-2 p-5 w-[80%] `} style={style}>
      <div className=''>
        <div className='flex flex-row'>
          <p className='mr-3 text-[24px]  cursor-pointer'>{Icon && <Icon/>}</p>
          <p className='mb-4 text-[20px] font-medium'>{lane_name}</p>
        </div>
      </div>

      <div>
        <div></div>
      </div>
      
      
    </div>
  )
}

export default lane