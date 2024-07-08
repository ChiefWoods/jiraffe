import React, { useState } from "react";
import { GoTrash } from "react-icons/go";
import { LuBoxSelect } from "react-icons/lu";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCheckSquare } from "react-icons/fa";
import TaskItem from "./TaskItem";
import TaskCard from "./TaskCard"; // Import TaskCard component

const Lane = ({ lane, tasks, onDeleteTask, onTaskClick, onAddTaskClick }) => {
  let Icon;
  switch (lane.icon) {
    case "box":
      Icon = LuBoxSelect;
      break;
    case "time":
      Icon = GiSandsOfTime;
      break;
    case "check":
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
    "--hover-bgcolor": lane.bgcolor,
  };

  const handleAddTaskClick = () => {
    onAddTaskClick(lane.name);
  };

  return (
    <div className="mx-5 w-[33%]">
      <div
        className={`rounded-2xl border-[3px] border-solid p-5`}
        style={style}
      >
        <div className="max-w-full">
          <div className="flex flex-row">
            <p className="mr-3 text-[24px]">{Icon && <Icon />}</p>
            <p className="mb-4 text-[20px] font-medium">{lane.name}</p>
          </div>
          {tasks.map((task, index) => (
            <TaskItem
              key={task._id}
              task={task}
              onDeleteTask={onDeleteTask}
              onTaskClick={() => onTaskClick(task)}
            />

            // <div key={index} className='mb-2 border-solid border-2 rounded-2xl mt-2 ml-2 p-5 bg-white min-w-[300px] cursor-pointer transition-transform duration-300 hover:scale-105' style={{ borderColor: lane.strokecolor }} onClick={handleAddTask}>
            //   <div className='flex flex-row justify-between'>
            //     <p className="font-semibold">{task.name}</p>
            //     <p className='text-slate-400 hover:text-[#D70000] text-[24px] transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleDelete(task._id)}><GoTrash /></p>
            //   </div>
            //   <p className="text-sm">{task.desc}</p>
            // </div>
          ))}
        </div>
      </div>

      {/* "+" button */}
      <div className="mt-4 content-center justify-center text-center">
        <div
          className="mx-auto flex h-[40px] w-[40px] items-center justify-center rounded-3xl bg-[#0052CC] text-center text-[35px] text-white transition-transform duration-300 hover:scale-110 hover:cursor-pointer hover:bg-blue-600"
          onClick={handleAddTaskClick}
        >
          +
        </div>
      </div>
    </div>
  );
};

export default Lane;
