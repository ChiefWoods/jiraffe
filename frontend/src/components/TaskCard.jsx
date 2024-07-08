import React, { useState, useEffect } from "react";
import Select from "react-select";
import { MdOutlineClose } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";

const TaskCard = ({
  task,
  isEditing,
  taskStatusOptions,
  onClose,
  availableAssignees,
  projectID,
  setTasks,
  userMapping,
}) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [assignees, setAssignees] = useState([]);

  const mapAssigneesToObjects = (assigneeIds) => {
    return assigneeIds
      .map((id) => {
        const assignee = availableAssignees.find((user) => user.id === id);
        return assignee ? { value: assignee.id, label: assignee.name } : null;
      })
      .filter((assignee) => assignee !== null);
  };

  const handleStatusChange = (selectedOption) => {
    setTaskStatus(selectedOption ? selectedOption.value : "");
  };

  const handleDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleAssigneeChange = (selectedOptions) => {
    setAssignees(
      selectedOptions ? selectedOptions.map((option) => option.value) : [],
    );
  };

  const handleSave = async () => {
    console.log(projectID);
    setSubmitted(true);
    if (taskTitle.trim() === "" || taskDescription.trim() === "") {
      return; // Do not proceed if taskTitle or taskDescription is empty
    }
    const taskData = {
      name: taskTitle,
      status: taskStatus,
      desc: taskDescription,
      createdAt: dateCreated,
      assignees,
    };

    const requestOptions = {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    };

    try {
      const res = isEditing
        ? await fetch(
            `${import.meta.env.VITE_BACK_END_URL}/task/${task._id}`,
            requestOptions,
          )
        : await fetch(
            `${import.meta.env.VITE_BACK_END_URL}/project/${task.projectID}/task`,
            requestOptions,
          );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      window.location.reload();
      onClose();
      setTasks((prev) => {
        if (isEditing) {
          return prev.map((task) =>
            task._id === data.task._id ? data.task : task,
          );
        } else {
          return [...prev, data.task];
        }
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const assigneeOptions = availableAssignees.map((assignee) => ({
    value: assignee,
    label: assignee,
  }));

  const statusOptions = taskStatusOptions.map((status) => ({
    value: status,
    label: status,
  }));

  useEffect(() => {
    setTaskTitle(task.name ?? "");
    setTaskStatus(task.status ?? "");
    setTaskDescription(task.desc ?? "");
    setDateCreated(task.createdAt ?? "");
    setAssignees(
      userMapping ? task.assignees?.map((id) => userMapping[id]) : [],
    );
  }, [task]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative z-50 mx-auto flex w-[50%] max-w-full flex-col rounded-md border-2 bg-white px-12 py-6 shadow-md">
        <form>
          <div className="flex h-[90%] flex-row justify-between">
            <div className={` ${isEditing ? "w-[80%]" : "w-[100%]"}`}>
              <div className="">
                <h2 className="mb-2 text-[30px] font-semibold text-[#0052CC]">
                  {isEditing ? "Edit Task" : "Add Task"}
                </h2>
                <div>
                  <div className="mb-2 flex flex-row">
                    <p className="mr-4 font-semibold">Task Title:</p>
                    {submitted && taskTitle.trim() === "" && (
                      <div className="flex items-center">
                        <RiErrorWarningFill className="mr-1 text-[14px] text-red-500" />
                        <p className="text-[14px] italic text-red-500">
                          Task title is required
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    className="mb-2 w-full rounded border-2 bg-[#ffffff] p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Task title..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <p className="mb-2 font-semibold">Task Progress:</p>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(
                      (option) => option.value === taskStatus,
                    )}
                    onChange={handleStatusChange}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select..."
                    required
                  />
                </div>
                <div>
                  <p className="mb-2 font-semibold">Assignee:</p>
                  <Select
                    isMulti
                    options={assigneeOptions}
                    value={assigneeOptions.filter((option) =>
                      assignees?.includes(option.value),
                    )}
                    onChange={handleAssigneeChange}
                    className="basic-multi-select mb-4"
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="mb-2 flex flex-row">
                  <p className="mr-4 font-semibold">Description:</p>
                  {submitted && taskDescription.trim() === "" && (
                    <div className="flex items-center">
                      <RiErrorWarningFill className="mr-1 text-[14px] text-red-500" />
                      <p className="text-[14px] italic text-red-500">
                        Description is required
                      </p>
                    </div>
                  )}
                </div>
                <textarea
                  type="text"
                  className="w-full resize-none overflow-hidden rounded border-2 bg-[#ffffff] p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a description..."
                  value={taskDescription}
                  onChange={handleDescriptionChange}
                  required
                />
              </div>
            </div>
            {isEditing && (
              <div className="mr-6 mt-6">
                <div className="mb-4">
                  <p className="font-semibold text-gray-700">Created:</p>
                  <p className="text-sm text-gray-500">
                    {dateCreated ? formatDate(dateCreated) : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className={` ${isEditing ? "w-[80%]" : "w-[100%]"}`}>
            <div className="float-end">
              <button
                type="button"
                className="rounded-md bg-slate-400 px-4 py-2 text-white hover:bg-slate-500"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ml-3 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-[#0052CC]"
                onClick={handleSave}
              >
                {isEditing ? "Done" : "Add"}
              </button>
            </div>
          </div>
        </form>
        <MdOutlineClose
          className="absolute right-4 top-4 cursor-pointer text-[35px] font-bold text-slate-400 hover:text-slate-500"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default TaskCard;
