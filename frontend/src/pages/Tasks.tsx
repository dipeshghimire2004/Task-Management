import React, { useState } from 'react'

interface TaskDetails{
  title: string;
  category: string;
  assigned_to: string;
  start_date: string;
  end_date: string;
  priority: number;
  description: string;
  location: string;
  completed: boolean;
}


const Tasks:React.FC = () => {
    const [taskDetail, setTaskDetail]=useState<TaskDetails>()
  return (
    <div>
        <h1>Tasks Assigned to '......'</h1>
        <div>
            
        </div>
    </div>
  )
}

export default Tasks