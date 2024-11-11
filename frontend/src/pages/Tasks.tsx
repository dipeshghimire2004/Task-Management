import React, { useEffect } from 'react'
import { RootState  } from '../store/store';
import { useAppDispatch,useAppSelector } from '../store/Hooks';
import { fetchTasks, selectTasks } from '../features/taskSlice';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumb';

const Tasks:React.FC = () => {

  // const dispatch = useAppDispatch();
   
  // useEffect(() => {
  //     dispatch(fetchCategories());
  // }, [dispatch]);

  // // Select categories from the Redux store
  // const categories = useAppSelector((state: RootState) => selectCategories(state));


    const dispatch=useAppDispatch();

    useEffect(()=>{
      dispatch(fetchTasks());
      console.log(fetchTasks);
    },[dispatch]);

    const tasks=useAppSelector((state:RootState)=>selectTasks(state))
    console.log(tasks)


    const onDelete = async (taskId: number) => {
      console.log("Attempting to delete task with ID:", taskId);
      if (window.confirm('Are you sure you want to delete this task?')) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`);
          dispatch(fetchTasks());
          console.log(`Task with ID ${taskId} deleted successfully.`);
        }  catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
  
  return (
    <div className='text-black flex items-center'>
        <Breadcrumb/>
        <h1>Tasks Assigned to '......'</h1>
       
        <motion.div className="w-full col-span-2 p-6 rounded-lg shadow-md" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h3 className="font-semibold text-lg text-gray-700 mb-4">Tasks</h3>
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border text-gray-600">Title</th>
                  <th className="px-4 py-2 border text-gray-600">Category</th>
                  <th className="px-4 py-2 border text-gray-600">Assigned To</th>
                  <th className="px-4 py-2 border text-gray-600">Status</th>
                  <th className="px-4 py-2 border text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className='overflow-hidden'>
                {tasks.map((task) => (
                  <motion.tr key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hover:bg-gray-100 transition">
                    <td className="border px-4 py-2 text-gray-700">{task.title}</td>
                    <td className="border px-4 py-2 text-gray-700">{task.category_name}</td>
                    <td className="border px-4 py-2 text-gray-700">{task.user_name}</td>
                    <td className="border px-4 py-2 text-gray-700">{task.completed ? 'Yes' : 'No'}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <div>
                        <Button bgColor='bg-green-600'><Link to={`/taskdetails/${task.id}`}>Details</Link></Button>
                        <Button bgColor='bg-blue-600'><Link to={`/taskform/${task.id}`}>Edit</Link></Button>
                        <Button onClick={() => onDelete(task.id)} bgColor='bg-red-600'>Delete</Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
    </div>
  )
}

export default Tasks