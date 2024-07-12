import { LuBoxSelect } from "react-icons/lu";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCheckSquare } from "react-icons/fa";
import TaskItem from "./TaskItem";

const Lane = ({
  lane,
  tasks,
  userRole,
  onDeleteTask,
  onTaskClick,
  onAddTaskClick,
}) => {
  const Icon =
    lane.icon === "box"
      ? LuBoxSelect
      : lane.icon === "time"
        ? GiSandsOfTime
        : lane.icon === "check"
          ? FaRegCheckSquare
          : LuBoxSelect;

  const style = {
    borderColor: lane.strokecolor,
    backgroundColor: lane.bgcolor,
    color: lane.textcolor,
    "--hover-bgcolor": lane.bgcolor,
  };

  function handleAddTaskClick() {
    onAddTaskClick(lane.name);
  }

  return (
    <div className="mx-5 flex flex-col items-center">
      <div
        className="min-w-[300px] rounded-2xl border-[3px] border-solid p-5"
        style={style}
      >
        <div className="w-full">
          <div className="flex flex-row">
            <p className="mr-3 text-[20px]">{Icon && <Icon />}</p>
            <p className="mb-4 mt-[-4px] text-[18px] font-medium">
              {lane.name}
            </p>
          </div>
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              userRole={userRole}
              onTaskClick={() => onTaskClick(task)}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      </div>

      {userRole !== "viewer" && (
        <button
          className="mt-4 w-fit content-center justify-center bg-transparent text-center"
          type="button"
        >
          <div
            className="mx-auto flex h-[40px] w-[40px] items-center justify-center rounded-3xl bg-[#0052CC] text-center text-[35px] text-white transition-transform duration-200 hover:scale-105 hover:cursor-pointer hover:bg-blue-600"
            onClick={handleAddTaskClick}
          >
            +
          </div>
        </button>
      )}
    </div>
  );
};

export default Lane;
