import React from 'react'
import { Work,Lane } from '../components'

const Dashboard = () => {
  const tasks=[
    { task_name: 'Task 1', task_description: 'Description 1', task_status: 'todo' },
    { task_name: 'Task 2', task_description: 'Description 2', task_status: 'inprog' },
    { task_name: 'Task 3', task_description: 'Description 3', task_status: 'done' },
  ];
  const swimlanes=[
    {lane_name:'TO DO',lane_icon:'box',bgcolor:'#DEDCFF',strokecolor:'#81ACFF',textcolor:'#0046AF'},
    {lane_name:'IN PROGRESS',lane_icon:'time',bgcolor:'#FFF6EB',strokecolor:'#FFE4C2',textcolor:'#8F4F00'},
    {lane_name:'DONE',lane_icon:'check',bgcolor:'#E9FFEA',strokecolor:'#AAF0C9',textcolor:'#3A5F3A'}
  ]
  return (
    <div>
      {/* map the task data */}
      {tasks.map((task,index)=>(
        <Work key={index} task_name={task.task_name} task_description={task.task_description} task_status={task.task_status}/>
      ))}
      {swimlanes.map((swimlane,index)=>(
        <Lane key={index} lane_name={swimlane.lane_name} lane_icon={swimlane.lane_icon} bgcolor={swimlane.bgcolor} strokecolor={swimlane.strokecolor} textcolor={swimlane.textcolor}/>
      ))}

    </div>
    
  );
};

export default Dashboard