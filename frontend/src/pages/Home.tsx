import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { fetchTasks, selectTasks } from '../features/taskSlice';
import { useAppDispatch, useAppSelector } from '../store/Hooks';
import { fetchCategories, selectCategories } from '../features/categorySlice';
import { RootState } from '../store/store';
import { DeleteDialogBox } from '@/components/DeleteDialogBox';
import { useGetCategoriesQuery } from '@/features/categoriesApiSlice';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/features/taskApiSlice';

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(fetchCategories());
  //   dispatch(fetchTasks());
  // }, [dispatch]);

  const {data:categories, error, isLoading} = useGetCategoriesQuery();

  // const categories = useAppSelector((state: RootState) => selectCategories(state));
  // const tasks = useAppSelector((state: RootState) => selectTasks(state));

  const {data:tasks=[]} = useGetTasksQuery();
  const [deleteTask] =useDeleteTaskMutation();

  const onDelete = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId).unwrap();
        // await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`);
        // dispatch(fetchTasks());
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const filteredCategoryTask = selectedCategory
    ? tasks.filter((task) => task.category_name === selectedCategory)
    : tasks;

    if(isLoading) return <div>Loading....</div>
  return (
    <div className="flex items-center justify-start min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-1 lg:p-10">
      <motion.main
        className="w-full mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Section */}
          <motion.div
            className="p-2 bg-gray-800 rounded-lg shadow-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h3 className="font-bold text-3xl mb-6 text-center">Categories</h3>
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory || ''}
              className="w-full lg:1/5 px-10 rounded text-gray-900 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Tasks Section */}
          <motion.div
            className="w-full lg:w-4/5 p-6 bg-gray-800 rounded-lg shadow-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-bold text-3xl mb-6 text-center">Tasks</h3>
            <table className="w-full table-auto border-collapse overflow-hidden bg-gray-900 rounded-lg">
              <thead>
                <tr className="bg-gray-700 lg:text-lg">
                  <th className="lg:px-4 lg:py-3 border-b ">Title</th>
                  <th className="lg:px-4 lg:py-3 border-b ">Category</th>
                  <th className="lg:px-4 lg:py-3 border-b ">Assigned To</th>
                  <th className="lg:px-4 lg:py-3 border-b ">Status</th>
                  <th className="lg:px-4 lg:py-3 border-b ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategoryTask.map((task) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800 hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-3 border-b border-gray-700">{task.title}</td>
                    <td className="px-4 py-3 border-b border-gray-700">{task.category_name}</td>
                    <td className="px-4 py-3 border-b border-gray-700">{task.user}</td>
                    <td className="px-4 py-3 border-b border-gray-700">
                      {task.completed ? (
                        <span className="text-green-500 font-bold">Completed</span>
                      ) : (
                        <span className="text-red-500 font-bold">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-700 space-x-2">
                      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button variant="outline" className="bg-blue-600 hover:bg-blue-500 text-white">
                          <Link to={`/taskdetails/${task.id}`}>Details</Link>
                        </Button>
                        <Button variant="outline" className="bg-green-600 hover:bg-green-500 text-white">
                          <Link to={`/taskform/${task.id}`}>Update</Link>
                        </Button>
                        <DeleteDialogBox onDelete={() => onDelete(task.id)} Name={task.title} />
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
