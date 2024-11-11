import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { fetchTasks, selectTasks } from '../features/taskSlice';
import { useAppDispatch, useAppSelector } from '../store/Hooks';
import { fetchCategories, selectCategories } from '../features/categorySlice';
import { RootState } from '../store/store';



const Home: React.FC = () => {

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const dispatch=useAppDispatch();
  useEffect(() => {
   
      // try {
    
        dispatch(fetchCategories());
        dispatch(fetchTasks());
        console.log(fetchTasks);
    
      // } catch (error) {
      //   console.error('Error fetching data:', error);
      // }

  }, [dispatch]);

  const categories=useAppSelector((state:RootState)=>selectCategories(state));
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



  const filteredCategoryTask = selectedCategory 
    ? tasks.filter(task => task.category_name === selectedCategory) 
    : tasks;

  return (
    <div className="flex items-center h-full w-full  bg-black fixed text-white p-8">
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <div className="w-full ml-2 grid sm:grid-cols-1  lg:grid-cols-3 gap-6">
          <motion.div className="bg-blue-50 col-span-1 p-6 text-white rounded-lg shadow-md" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <select onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory || ''} 
                className="w-full p-2 rounded text-gray-900"
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </motion.div>

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
                {filteredCategoryTask.map((task) => (
                  <motion.tr key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hover:shadow-xl transition">
                    <td className="border px-4 py-2 ">{task.title}</td>
                    <td className="border px-4 py-2 ">{task.category_name}</td>
                    <td className="border px-4 py-2 ">{task.assigned_to}</td>
                    <td className="border px-4 py-2 ">{task.completed ? 'Yes' : 'No'}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <div>
                        <Button bgColor='bg-green-600'><Link to={`/tasks/${task.id}`}>TaskList</Link></Button>
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
      </motion.main>
    </div>
  );
};

export default Home;
