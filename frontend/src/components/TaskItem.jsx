import React from "react";
import { GoTrash } from "react-icons/go";
import TaskCard from "./TaskCard";
const TaskItem = ({ task, onDeleteTask, onTaskClick }) => {
  let color;
  switch (task.status) {
    case "TO DO":
      color = "#81ACFF";
      break;
    case "IN PROGRESS":
      color = "#FFE4C2";
      break;
    case "DONE":
      color = "#AAF0C9";
      break;
    default:
      color = "#AAF0C9";
      break;
  }

  const style = {
    borderColor: color,
  };

  return (
    <div
      className={`mb-2 ml-2 mt-2 max-w-full cursor-pointer rounded-2xl border-[3px] border-solid bg-white p-5 transition-transform duration-300 hover:scale-105`}
      style={style}
      onClick={onTaskClick}
    >
      <div className="flex flex-row justify-between">
        <p className="font-semibold">{task.name}</p>
        <p
          className="cursor-pointer text-[24px] text-slate-400 transition-transform duration-300 hover:scale-105 hover:text-[#D70000]"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTask(task._id);
          }}
        >
          <GoTrash />
        </p>
      </div>
      <p className="text-sm">{task.desc}</p>
    </div>
  );
};

export default TaskItem;
