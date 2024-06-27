import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { MdOutlineClose } from "react-icons/md";

const TaskCard = ({ task, isEditing, taskStatusOptions, onClose, availableAssignees }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    if (task) {
      setTaskTitle(task.name || '');
      setTaskStatus(task.status || '');
      setTaskDescription(task.desc || '');
      setDateCreated(task.createdAt || '');
      setAssignees(task.assignees || []);
    } else {
      setTaskTitle('');
      setTaskStatus('');
      setTaskDescription('');
      setDateCreated('');
      setAssignees([]);
    }
  }, [task]);

  const handleStatusChange = (selectedOption) => {
    setTaskStatus(selectedOption ? selectedOption.value : '');
  };

  const handleDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleAssigneeChange = (selectedOptions) => {
    setAssignees(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const handleSave = () => {
    const taskData = {
      name: taskTitle,
      status: taskStatus,
      desc: taskDescription,
      createdAt: dateCreated,
      assignees: assignees
    };

    if (isEditing) {
      // Implement update task logic here
    } else {
      // Implement add new task logic here
    }
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const assigneeOptions = availableAssignees.map(assignee => ({ value: assignee, label: assignee }));
  const statusOptions = taskStatusOptions.map(status => ({ value: status, label: status }));

  return (
    <div className='z-40 fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'>
      <div className='border-2 mx-auto bg-white px-12 py-6 rounded-md shadow-md flex flex-col w-[50%] h-[65%] max-w-full relative z-50'>
        <div className='justify-between flex flex-row h-[90%]'>
          <div className={` ${isEditing?'w-[80%]':'w-[100%]'}`}>
            <div>
              <h2></h2>
            </div>
            <div className='mb-6'>
              <h2 className='text-[30px] font-semibold mb-2 text-[#0052CC]'>{isEditing ? 'Edit Task' : 'Add Task'}</h2>
              <p className='font-semibold mb-2'>Task Name:</p>
              <input
                type='text'
                className='text-sm w-full p-2 mb-4 bg-[#ffffff] border-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'
                placeholder='Task title...'
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <p className='font-semibold mb-2'>Task Progress:</p>
              <Select
                options={statusOptions}
                value={statusOptions.find(option => option.value === taskStatus)}
                onChange={handleStatusChange}
                className='basic-single'
                classNamePrefix='select'
                placeholder="Select..."
              />

<div>
              <p className=' text-gray-700 font-semibold'>Assignee:</p>
              <Select
                isMulti
                options={assigneeOptions}
                value={assigneeOptions.filter(option => assignees.includes(option.value))}
                onChange={handleAssigneeChange}
                className='basic-multi-select'
                classNamePrefix='select'
                
              />
            </div>
            </div>
            <div className='mb-4'>
              <p className='font-semibold'>Description:</p>
              <textarea
                type='text'
                className='text-sm w-full h-[200px] p-2 bg-[#ffffff] border-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 rounded resize-none overflow-hidden'
                placeholder='Add a description...'
                value={taskDescription}
                onChange={handleDescriptionChange}
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
        <div className={` ${isEditing?'w-[80%]':'w-[100%]'}`}>
          <div className='float-end mt-4 '>
          <button className='bg-slate-400 hover:bg-slate-500 text-white py-2 px-4 rounded-md' onClick={onClose}>Cancel</button>
          <button className='bg-blue-600 hover:bg-[#0052CC] text-white py-2 px-4 rounded-md ml-3' onClick={handleSave}>{isEditing ? 'Done' : 'Add'}</button>
          </div>
        </div>
        
        
        <MdOutlineClose className='absolute top-4 right-4 font-bold text-slate-400 hover:text-slate-500 text-[35px] cursor-pointer' onClick={onClose} />
      </div>
    </div>
  );
};

export default TaskCard;
