import { GoTrash } from "react-icons/go";

const TaskItem = ({ task, onDeleteTask, userRole, onTaskClick }) => {
  const style = {
    borderColor:
      task.status === "TO DO"
        ? "#81ACFF"
        : task.status === "IN PROGRESS"
          ? "#FFE4C2"
          : "#AAF0C9",
  };

  return (
    <div
      className={`mb-2 ml-[2px] mt-2 w-full cursor-pointer rounded-2xl border-[3px] border-solid bg-white p-5 transition-transform duration-200 hover:scale-105 ${userRole === "viewer" ? "opacity-75" : ""}`}
      style={style}
      onClick={onTaskClick}
    >
      <div className="mb-[6px] flex flex-row justify-between">
        <p className="font-semibold">{task.name}</p>
        {userRole !== "viewer" && (
          <p
            className="cursor-pointer text-[22px] text-slate-400 transition-transform duration-300 hover:scale-105 hover:text-[#D70000]"
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
  );
};

export default TaskItem;
