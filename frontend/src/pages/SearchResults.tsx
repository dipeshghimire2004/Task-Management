import { useAppSelector } from '../store/Hooks';
import { RootState } from '../store/store';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components';
import Cookies from 'js-cookie';

// Define a type for the task results
interface TaskType {
  id: number;
  title: string;
  category: string;
  assigned_to:string;
  completed:boolean;
}

const SearchResults: React.FC = () => {
  // Get the search query from the Redux store
  const searchTerm = useAppSelector((state: RootState) => state.search.query);
  
  // State to hold search results with type safety
  const [results, setResults] = useState<TaskType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch search results based on the query
    const fetchData = async () => {
      const token=Cookies.get('access')
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks/?searchTerm=${searchTerm}`,{
          headers:{
            
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          },
          withCredentials:true
        });
        setResults(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
        setError('Error fetching search results.');
      }
    };

    // Fetch data only if a query is present
    if (searchTerm) {
      fetchData();
    } else {
      setResults([]); // Clear results when query is empty
    }
  }, [searchTerm]);

  const onDelete = async (taskId: number) => {
    console.log("Attempting to delete task with ID:", taskId);
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`);
        // dispatch(fetchTasks());
        console.log(`Task with ID ${taskId} deleted successfully.`);
      }  catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  return (
    <div>
      <h2>Search Results for "{searchTerm}"</h2>
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 ? (
        <ul>
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
                {results.map((task) => (
                  <motion.tr key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hover:shadow-xl transition">
                    <td className="border px-4 py-2 ">{task.title}</td>
                    <td className="border px-4 py-2 ">{task.category}</td>
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
        </ul>
      ) : (
        !error && <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
