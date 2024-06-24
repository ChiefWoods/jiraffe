import React, { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';

const TaskCard = ({
  taskTitle = 'Task 1',
  taskStatusOptions = ['TO DO', 'IN PROGRESS', 'DONE'],
  description = 'Add a description...',
  dateCreated = 'date_created',
  assignees = ['user_name1', 'user_name2'],
  onClose, // Close modal function
}) => {
  const [taskStatus, setTaskStatus] = useState(taskStatusOptions[0]);
  const [taskDescription, setTaskDescription] = useState(description);

  const handleStatusChange = (event) => {
    setTaskStatus(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  return (
    <div className='z-40 fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'>
      <div className='border-2 mx-auto bg-white p-6 rounded-md shadow-md flex flex-col w-[600px] h-[400px] max-w-full relative z-50'>
        <div className='w-[500px]'>
          {/* Task title and status */}
          <div className='mb-6'>
            <h2 className='text-lg font-semibold mb-2 text-black'>{taskTitle}</h2>
            <select
              className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
              value={taskStatus}
              onChange={handleStatusChange}
            >
              {taskStatusOptions.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          {/* Description */}
          <div className='mb-4'>
            <p className='text-gray-700 font-semibold'>Description</p>
            <textarea
              type='text'
              className='text-sm w-full h-[200px] pt-2 bg-[#ffffff] text-black focus:outline-none focus:ring-2 focus:ring-transparent rounded resize-none overflow-hidden'
              placeholder='Add a description...'
              value={taskDescription}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>

        {/* Right section */}
        <div className='mt-6'>
          {/* Date created */}
          <div>
            <div className='mb-4'>
              <p className='text-gray-700 font-semibold'>Created</p>
              <p className='text-sm text-gray-500'>{dateCreated}</p>
            </div>
            {/* Assignee */}
            <div>
              <p className='mt-4 text-gray-700 font-semibold'>Assignee</p>
              <ul className='text-gray-500'>
                {assignees.map((assignee, index) => (
                  <li className='text-sm' key={index}>
                    {assignee}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Close button */}
        <RxCross1 className='absolute top-2 right-2 text-blue-800 text-xl cursor-pointer' onClick={onClose} />
      </div>
    </div>
  );
};

export default TaskCard;
