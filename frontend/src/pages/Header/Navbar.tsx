
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store/Hooks';
import { useNavigate } from 'react-router-dom';
import { setSearchQuery } from '../../features/searchSlice';
import clock from '../../assets/clock.gif'
import { logoutUser } from '@/api/auth';
import { Button } from '@/components';
import toast,{Toaster} from 'react-hot-toast';
import { useAuth0 } from "@auth0/auth0-react";

// interface TaskItem{
//     title:string;
// }

const Navbar:React.FC = () => {
      const { loginWithRedirect } = useAuth0();

      const [input, SetInput]=useState<string>('');
      const dispatch = useAppDispatch();
      const navigate =  useNavigate();

      const handleSearch=(e:React.FormEvent)=>{
        e.preventDefault();
        dispatch(setSearchQuery(input));
        navigate('/searchresults');
      };

      const handleLogout=async()=>{
        logoutUser()
        toast.success("logout successfully")
        navigate('/login')

      }


  return (
    <div className=' w-full p-4 top-0 fixed  bg-black pb-6 text-white'>
      <Toaster/>
        <nav className="flex justify-around items-center">
          <div>
            <img className='h-10 w-10 object-cover' src={clock} alt="" />
          </div>
        <h1 className="text-bold lg:text-3xl font-bold"><Link to='/'>Task Management System</Link></h1>
          <form onSubmit={handleSearch} className="flex items-center bg-white shadow-md rounded-lg overflow-hidden">
            <input
              type="search"
              name="search"

              value={input}
              onChange={(e)=>SetInput(e.target.value)}
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
          <div className='flex items-center space-x-2'>
            <Link to="/taskslist" className=" hover:text-blue-500 transition">Tasks</Link>
            <Link to="/categories" className=" hover:text-blue-500 transition">Categories</Link>
            {/* <Link to="/logout" className="text-white px-3 py-2 rounded-lg bg-black hover:text-blue-500 transition">Logout</Link> */}
            <Button onClick={handleLogout} className='w-20 bg-transparent font-bold hover:text-red-500 transition'>Logout</Button>
            <button onClick={() => loginWithRedirect()}>LogIn</button>
          </div>
        </nav>
    </div>
  )
}

export default Navbar