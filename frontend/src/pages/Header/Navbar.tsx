import axios from 'axios';
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

// interface TaskItem{
//     title:string;
// }

const Navbar:React.FC = () => {
    // const [tasks, setTasks] = useState<TaskItem[]>([]);
    // const [searchTask, setSearchTask] = useState<string>(''); 

    // useEffect(()=>{
    //     axios.post('http://127.0.0.1:8000/api/tasks/')
    //     .then(response=>response.data)
    //     .catch(error=>console.error)
    // },[])
    // const filteredTasks = tasks.filter((task) =>
    //     task.title.toLowerCase().includes(searchTask.toLowerCase())
    // );
  return (
    <div className=' w-full px-4 top-0 fixed  bg-black text-white'>
        <nav className="flex justify-around items-center">
        <h1 className="text-3xl font-bold"><Link to='/'>Task Management System</Link></h1>
          <form className="flex items-center bg-white shadow-md rounded-lg overflow-hidden">
            <input
              type="search"
              name="search"
            //   value={searchTask}
            //   onChange={(e) => setSearchTask(e.target.value)}
              placeholder="Search tasks"
              className="px-4 py-2 text-gray-700 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition"
            >
              Search
            </button>
          </form>
          <div className='space-x-4'>
            <Link to="/tasks" className=" hover:text-blue-500 transition">Tasks</Link>
            <Link to="/categories" className=" hover:text-blue-500 transition">Categories</Link>
            <Link to="/logout" className="text-white px-3 py-2 rounded-lg bg-black hover:text-blue-500 transition">Logout</Link>
          </div>
        </nav>
    </div>
  )
}

export default Navbar