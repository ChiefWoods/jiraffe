import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { MdOutlineClose } from 'react-icons/md';
import { RiErrorWarningFill } from "react-icons/ri";

const TaskCard = ({ task, isEditing, taskStatusOptions, onClose, availableAssignees, projectID,userRole }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [taskStatus, setTaskStatus] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [assignees, setAssignees] = useState([]);

  const mapAssigneesToObjects = (assigneeIds) => {
    return assigneeIds.map(id => {
      const assignee = availableAssignees.find(user => user.id === id);
      return assignee ? { value: assignee.id, label: assignee.name } : null;
    }).filter(assignee => assignee !== null); // Filter out null values if any
  };

  console.log(task.assignees)

  useEffect(() => {
    if (task) {
      setTaskTitle(task.name || '');
      setTaskStatus(task.status || '');
      setTaskDescription(task.desc || '');
      setDateCreated(task.createdAt || '');
      if (task.assignees && Array.isArray(task.assignees)) {
        setAssignees(mapAssigneesToObjects(task.assignees));
      } else {
        setAssignees([]);
      }
    } else {
      setTaskTitle('');
      setTaskStatus('');
      setTaskDescription('');
      setDateCreated('');
      setAssignees([]);
    }
  }, [task, availableAssignees]);

  const handleStatusChange = (selectedOption) => {
    setTaskStatus(selectedOption ? selectedOption.value : '');
  };

  const handleDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleAssigneeChange = (selectedOptions) => {
    setAssignees(selectedOptions || []);
  };

  const handleSave = async () => {
    console.log(projectID);
    setSubmitted(true);
    if (taskTitle.trim() === '' || taskDescription.trim() === '') {
      return; // Do not proceed if taskTitle or taskDescription is empty
    }
    const taskData = {
      name: taskTitle,
      status: taskStatus,
      desc: taskDescription,
      createdAt: dateCreated,
      assignees: assignees.map(assignee => assignee.value) // Only send the IDs
    };
    console.log(taskData);

    const requestOptions = {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/${isEditing ? `task/${task._id}` : `project/${projectID}/task`}`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      window.location.reload();
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const assigneeOptions = availableAssignees.map(assignee => ({
    value: assignee.id,
    label: assignee.name
  }));
  const statusOptions = taskStatusOptions.map(status => ({ value: status, label: status }));

  return (
    <div className='z-40 fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'>
      <div className='border-2 mx-auto bg-white px-12 py-6 rounded-md shadow-md flex flex-col w-[50%] h-[65%] max-w-full relative z-50'>
        <form>
          <div className='justify-between flex flex-row h-[90%]'>
            <div className={` ${isEditing ? 'w-[80%]' : 'w-[100%]'}`}>
              <div className=''>
                <h2 className='text-[30px] font-semibold mb-2 text-[#0052CC]'>{isEditing ? 'Edit Task' : 'Add Task'}</h2>
                <div>
                  <div className='flex flex-row mb-2'>
                    <p className='font-semibold  mr-4'>Task Title:</p>
                    {submitted && taskTitle.trim() === '' && (
                      <div className='flex items-center'>
                        <RiErrorWarningFill className='text-red-500 text-[14px] mr-1' />
                        <p className='text-red-500 italic text-[14px]'>Task title is required</p>
                      </div>
                    )}
                  </div>
                  <input
                    type='text'
                    className='text-sm w-full p-2 mb-2 bg-[#ffffff] border-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'
                    placeholder='Task title...'
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>

                <div className='mb-2'>
                  <p className='font-semibold mb-2'>Task Progress:</p>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === taskStatus)}
                    onChange={handleStatusChange}
                    className='basic-single'
                    classNamePrefix='select'
                    placeholder='Select...'
                    required
                  />
                </div>
                <div>
                  <p className='font-semibold mb-2'>Assignee:</p>
                  <Select
                    isMulti
                    options={assigneeOptions}
                    value={assignees}
                    onChange={handleAssigneeChange}
                    className='basic-multi-select mb-4'
                    classNamePrefix='select'
                  />
                </div>
              </div>
              <div className='mb-4'>
                <div className='flex flex-row mb-2'>
                  <p className='font-semibold mr-4'>Description:</p>
                  {submitted && taskDescription.trim() === '' && (
                    <div className='flex items-center'>
                      <RiErrorWarningFill className='text-red-500 text-[14px] mr-1' />
                      <p className='text-red-500 italic text-[14px]'>Description is required</p>
                    </div>
                  )}
                </div>
                <textarea
                  type='text'
                  className='text-sm w-full p-2 bg-[#ffffff] border-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 rounded resize-none overflow-hidden'
                  placeholder='Add a description...'
                  value={taskDescription}
                  onChange={handleDescriptionChange}
                  required
                />
              </div>
            </div>
            {isEditing && (
              <div className='mt-6 mr-6 '>
                <div className='mb-4'>
                  <p className='text-gray-700 font-semibold'>Created:</p>
                  <p className='text-sm text-gray-500'>{dateCreated ? formatDate(dateCreated) : 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
          <div className={` ${isEditing ? 'w-[80%]' : 'w-[100%]'}`}>
            <div className='float-end'>
              <button
                type='button'
                className='bg-slate-400 hover:bg-slate-500 text-white py-2 px-4 rounded-md'
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type='button'
                className='bg-blue-600 hover:bg-[#0052CC] text-white py-2 px-4 rounded-md ml-3'
                onClick={handleSave}
              >
                {isEditing ? 'Done' : 'Add'}
              </button>
            </div>
          </div>
        </form>
        <MdOutlineClose
          className='absolute top-4 right-4 font-bold text-slate-400 hover:text-slate-500 text-[35px] cursor-pointer'
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default TaskCard;
