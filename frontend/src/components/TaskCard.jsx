import { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext.jsx";
import { addTask, editTask, getProjectRole } from "../utils.js";
import { Toast } from "./index.js";
import Select from "react-select";
import { MdOutlineClose } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";

const TaskCard = ({
  sessionUserID,
  projectID,
  task,
  isEditing,
  taskStatusOptions,
  availableAssignees,
  closeCard,
  setTasks,
}) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userRole, setUserRole] = useState("viewer");
  const { toastMessage, setToastMessage } = useToast();

  const assigneeOptions = availableAssignees.map((assignee) => ({
    value: assignee.id,
    label: assignee.name,
  }));

  const statusOptions = taskStatusOptions.map((status) => ({
    value: status,
    label: status,
  }));

  function handleStatusChange(selectedOption) {
    setTaskStatus(selectedOption ? selectedOption.value : "");
  }

  function handleDescriptionChange(e) {
    setTaskDescription(e.target.value);
  }

  function handleAssigneeChange(selectedOptions) {
    setAssignees(
      selectedOptions ? selectedOptions.map((option) => option.value) : [],
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    closeCard();

    if (userRole === "viewer") {
      return;
    }

    setSubmitted(true);

    if (taskTitle.trim() === "" || taskDescription.trim() === "") {
      return;
    }

    const taskData = {
      name: taskTitle,
      status: taskStatus,
      desc: taskDescription,
      assignees,
    };

    const result = isEditing
      ? await editTask(task._id, taskData)
      : await addTask(projectID, taskData);

    setTasks((prev) => {
      return isEditing
        ? prev.map((task) =>
            task._id === result.task._id ? result.task : task,
          )
        : [...prev, result.task];
    });

    setToastMessage(result.message);
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
    option: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  useEffect(() => {
    async function fetchData() {
      const role = await getProjectRole(projectID, sessionUserID);
      setUserRole(role);
    }

    setTaskTitle(task.name || "");
    setTaskStatus(task.status || "");
    setTaskDescription(task.desc || "");
    setAssignees(task.assignees ?? []);

    fetchData();
  }, [task, availableAssignees]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative z-50 mx-auto flex h-[560px] w-[50%] max-w-full flex-col rounded-md border-2 bg-white pl-[40px] pr-[50px] pt-[30px] shadow-md">
        <form>
          <div className="flex h-[90%] flex-row justify-between gap-x-4">
            <div className="w-[80%]">
              <div>
                <h2 className="mb-2 text-[30px] font-semibold text-[#0052CC]">
                  {userRole === "viewer" ? "View" : "Edit"} Details
                </h2>
                <div>
                  <div className="mb-2 mt-[24px] flex flex-row">
                    <p className="mb-[-4px] mr-4 text-[18px] font-semibold">
                      Task Title:
                    </p>
                    {submitted && taskTitle.trim() === "" && (
                      <div className="flex items-center">
                        <RiErrorWarningFill className="mr-1 text-[14px] text-red-500" />
                        <p className="text-[14px] italic text-red-500">
                          Title is required.
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    className={`w-full rounded border-[0.8px] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${userRole === "viewer" ? "pointer-events-none border-[#e6e6e6] bg-[#f2f2f2] text-[#999999]" : "border-[#cccccc] bg-[#ffffff] text-black"}`}
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    readOnly={userRole === "viewer"}
                    required
                  />
                </div>

                <div className="mb-2 mt-[20px]">
                  <p className="mb-[4px] text-[18px] font-semibold">
                    Task Progress:
                  </p>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(
                      (option) => option.value === taskStatus,
                    )}
                    onChange={handleStatusChange}
                    styles={customStyles}
                    placeholder="Select..."
                    isDisabled={userRole === "viewer"}
                  />
                </div>
                <div className="mt-[20px]">
                  <p className="mb-[4px] text-[18px] font-semibold">
                    Assignees:
                  </p>
                  <Select
                    isMulti
                    options={assigneeOptions}
                    value={assigneeOptions.filter((option) =>
                      assignees.includes(option.value),
                    )}
                    onChange={handleAssigneeChange}
                    styles={customStyles}
                    classNamePrefix="select"
                    isDisabled={userRole === "viewer"}
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="mb-2 mt-[20px] flex flex-row">
                  <p className="mb-[-4px] mr-4 text-[18px] font-semibold">
                    Description:
                  </p>
                  {submitted && taskDescription.trim() === "" && (
                    <div className="flex items-center">
                      <RiErrorWarningFill className="mr-1 text-[14px] text-red-500" />
                      <p className="text-[14px] italic text-red-500">
                        Description is required.
                      </p>
                    </div>
                  )}
                </div>
                <textarea
                  type="text"
                  className={`w-full resize-none overflow-hidden rounded border-[0.8px] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${userRole === "viewer" ? "pointer-events-none border-[#e6e6e6] bg-[#f2f2f2] text-[#999999]" : "border-[#cccccc] bg-[#ffffff] text-black"}`}
                  placeholder="Add a description..."
                  value={taskDescription}
                  onChange={handleDescriptionChange}
                  readOnly={userRole === "viewer"}
                  required
                />
              </div>
            </div>
            <div className="mr-6 mt-[60px]">
              {task.createdAt && (
                <div className="mb-4">
                  <p className="font-semibold text-gray-700">Created:</p>
                  <p className="mt-[4px] text-sm text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          {userRole !== "viewer" && (
            <div className="mt-[2px] w-[80%]">
              <div className="float-end">
                <button
                  type="button"
                  className="rounded-md bg-slate-400 px-4 py-2 text-white hover:bg-slate-500"
                  onClick={closeCard}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ml-[30px] rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-[#0052CC]"
                  onClick={handleSave}
                >
                  {isEditing ? "Done" : "Add"}
                </button>
              </div>
            </div>
          )}
        </form>
        <MdOutlineClose
          className="absolute right-[30px] top-[24px] cursor-pointer text-[35px] font-bold text-slate-400 hover:text-slate-500"
          onClick={closeCard}
        />
      </div>
      {toastMessage && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default TaskCard;
