import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { color, motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import Cookies from 'js-cookie';



interface TaskDetailsProps {
  title: string;
  category_name: string;
  assigned_to: string;
  start_date: string;
  end_date: string;
  priority: number;
  description: string;
  location: string;
  completed: boolean;
  user:string;
}

const TaskDetails: React.FC = () => {
  const [taskDetails, setTaskDetails] = useState<TaskDetailsProps | null>(null);
  const [error, setError] = useState<string | null>(null); // State to hold error messages
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading]=useState<boolean>(false)

  const token=Cookies.get('access')
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        // const token=Cookies.get('access')
        const response = await axios.get<TaskDetailsProps>(`http://127.0.0.1:8000/api/tasks/${id}/`,{
          headers:{
            'Authorization':`Bearer ${token}` 
          }
        });
        setTaskDetails(response.data);
        console.log(response.data);
      } catch (err) {
        console.error('Error occurred:', err);
        setError('Failed to load task details. Please try again later.'); // Set error message
      }
    };

    fetchTaskDetails();
  }, [id]);

  
  const markAsCompleted = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('access');
      const response = await axios.put(
        `http://127.0.0.1:8000/api/tasks/${id}/`,
        { completed: true },  // Data to be updated
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      // Update the task details in the frontend after successful update
      setTaskDetails((prevState) => ({
        ...prevState!,
        completed: true,
      }));
      setLoading(false);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to mark task as completed. Please try again later.');
      setLoading(false);
    }
  };


  // const PriorityColor = ({ priority }: { priority: number }) => {
  //   let color = '';
  
  //   // Define colors based on priority levels
  //   if (priority < 2) {
  //     color = 'bg-green-500';  // Low priority
  //   } else if (priority <3) {
  //     color = 'bg-yellow-500'; // Medium priority
  //   } else {
  //     color = 'bg-red-500';    // High priority
  //   }
  
  //   return (
  //     <div className={`w-6 h-6 px-2 rounded-full ${color}`} >{priority}</div>
  //   );
  // };
  
  const PriorityColor=({priority}:{priority:number})=>{
    let color='';
    if(priority<=1){
      color='bg-green-600'
    }
    else if(priority<=2){
      color='bg-yellow-600'
    }
    else{
      color='bg-red-600'
    }
    return(
      <div className={`h6 w-6 rounded-full px-2 ${color}`}>{priority}</div>
    )
  }



  if (error) {
    return <div className="text-red-500 text-center">{error}</div>; // Display error message if it exists
  }

  if (!taskDetails) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-black shadow-lg rounded-lg mx-auto max-w-2xl mt-12"
    >
      <h2 className="text-3xl font-bold text-center mb-6">{taskDetails.title}</h2>

      <div className="space-y-4 text-gray-700">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-100 p-4 rounded-lg shadow-md"
        >
          <p><span className="font-semibold">Category:</span> {taskDetails.category_name}</p>
          <p><span className="font-semibold">Assigned To:</span> {taskDetails.user}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-100 p-4 rounded-lg shadow-md"
        >
          <p><span className="font-semibold">Start Date:</span> {taskDetails.start_date}</p>
          <p><span className="font-semibold">End Date:</span> {taskDetails.end_date}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-100 p-4 rounded-lg shadow-md"
        >
           <p className='flex space-x-4'><span className="font-semibold ">Priority:</span> <PriorityColor priority={taskDetails.priority} /></p>
          <p><span className="font-semibold">Location:</span> {taskDetails.location}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-100 p-4 rounded-lg shadow-md"
        >
          <p><span className="font-semibold">Description:</span> {taskDetails.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-100 p-4 rounded-lg shadow-md"
        >
          <p>
            <span className="font-semibold">Completed:</span>{' '}
            {taskDetails.completed ? 'Yes' : 'No'}
          </p>
        </motion.div>
      </div>

      <div className='flex space-x-4 mt-4'>
        <Button bgColor='bg-green-500' onClick={markAsCompleted} disabled={taskDetails.completed || loading} className="duration-300">{loading ?'Updating':'Mark as Completed'}</Button>
        {/* <Button className=' '><Link to={`/taskform/${task.id}`}>Update</Link></Button> */}
      </div>

    </motion.div>
  );
};

export default TaskDetails;
