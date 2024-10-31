import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

interface TaskItem {
  id: number;
  title: string;
  category_name: string;
  user_name: string;
  completed: boolean;
  end_date: string;
  taskId: number
}

interface CategoryItem {
  name: string;
  id: number; // Ensure this is unique
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/tasks/')
      .then(response =>{ 
        setTasks(response.data)
        console.log("Fetched tasks:", response.data); // Log tasks fetched
      })
      
      .catch(error => console.error('Error fetching tasks:', error));

    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const onDelete = (taskId: number) => {
    console.log("Attempting to delete task with ID:", taskId); // Log the task ID
    if (window.confirm('Are you sure you want to delete this task?')) {
      axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`)
        .then(() => {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
          console.log(`Task with ID ${taskId} deleted successfully.`);
        })
        .catch(error => {
          console.error("Error while deleting the task", error);
          if (error.response) {
            console.error("Server responded with:", error.response.data);
          }
        });
    }
  };
  

  const filteredCategoryTask = selectedCategory 
    ? tasks.filter(task => task.category_name === selectedCategory) 
    : tasks;

  return (
    <div className="min-h-screen bg-gradient-to-b bg-black text-white p-8">
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
                <option key={category.id} value={category.name}>{category.name}</option> // Correctly using unique key
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
                  <motion.tr key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hover:bg-gray-100 transition">
                    <td className="border px-4 py-2 text-gray-700">{task.title}</td>
                    <td className="border px-4 py-2 text-gray-700">{task.category_name}</td>
                    <td className="border px-4 py-2 text-gray-700">{task.user_name}</td>
                    <td className="border px-4 py-2 text-gray-700">{task.completed ? 'Yes' : 'No'}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <div>
                      <Button bgColor='bg-green-600'><Link to={`/details/${task.id}`}>Details </Link></Button>
                    <Button bgColor='bg-blue-600'><Link to={`/taskform/${task.id}`}>Edit</Link></Button>
                      <Button onClick={() => {
                         console.log("Deleting task ID:", task.id); // Log the task ID
                        onDelete(task.id)}} bgColor='bg-red-600'>Delete</Button>
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
