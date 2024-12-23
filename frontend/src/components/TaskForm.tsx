import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import { RootState } from '../store/store';
import { useAppSelector } from '../store/Hooks';
import { selectTasksById } from '../features/taskSlice';
import { Task } from "../store/types";
import Cookies from 'js-cookie';
import toast,{Toaster} from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
}
interface User {
  id: string;
  email: string;
}

const TaskForm: React.FC = () => {
  const [categories,setCategories]=useState<Category[]>([])
  const [users, setUsers]=useState<User[]>([])
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const { taskId } = useParams<{ taskId: string }>();
  const isUpdate = !!taskId;

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Task>();

  const currentTask = useAppSelector((state: RootState) =>
    selectTasksById(state, Number(taskId))
  );

  const [loading, setLoading] = useState(false);


  useEffect(()=>{
    const fetchData=async()=>{
      const token =Cookies.get('access')
      try {
        const categoryResponse = await axios.get('http://127.0.0.1:8000/api/categories/',{
          headers:{
            Authorization: `Bearer ${token}`
          },
          withCredentials:true
        })
        setCategories(categoryResponse.data)

        const userResponse = await axios.get('http://127.0.0.1:8000/api/users/',{
          headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials:true
        })
        setUsers(userResponse.data)
        console.log(userResponse.data)
      } catch (error) {
        console.error("error occured while fetching data",error)
      }
    }
    fetchData();
  },[])



  // Populate form if updating an existing task
   
  useEffect(() => {
    if (isUpdate && currentTask) {
      Object.entries(currentTask).forEach(([key, value]) => {
        if (key === 'start_date' || key === 'end_date') {
          // Convert date to 'YYYY-MM-DD' format
          setValue(key as keyof Task, value ? value.split('T')[0] : '');
        } else {
          setValue(key as keyof Task, value as any)
        }
      });
    }
  }, [isUpdate, currentTask, setValue]);

  // Handle form submission
  const onSubmit = async (data: Task) => {
    setLoading(true);
    try {
      const token=Cookies.get('access')
      if (isUpdate) {
        await axios.put(`http://127.0.0.1:8000/api/tasks/${taskId}/`, data, {
          headers: { 'Content-Type': 'application/json',
                      'Authorization':`Bearer ${token}`
           },
        });
        toast.success("Task Updated Successfully")
        navigate('/taskslist')
        console.log('Task updated successfully');
      } else {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/tasks/',
          data,
          {
            headers: {
               'Content-Type': 'application/json',
               'Authorization':`Bearer ${token}`
             },
             withCredentials:true
          }
        );

        toast.success("Task Created Successfully")
        console.log('Task created successfully:', response.data);
      }
      navigate('/taskslist');
      reset(); // Reset the form after submission
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error while processing the task:', error.response.data);
        toast.error('Error occured',error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-900 p-4">
      <Toaster/>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">
          {isUpdate ? 'Update Task' : 'Create New Task'}
        </h2>

        {/* Title Input */}
        <Input
          label="Title"
          id="title"
          type="text"
          placeholder="Enter task title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}


<div className="mb-4">
  <label htmlFor="category" className="block text-gray-700">Category</label>
  <select
    id="category"
    className="w-full p-2 border border-gray-700 rounded-lg"
    {...register('category', { required: 'Category is required' })}
  >
    <option value="">Select Category</option>
    {categories.map((category: Category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
  {errors.category && <span className="text-red-500">{errors.category.message}</span>}
</div>
{/* <div className="mb-4">
  <label htmlFor="category_name" className="block text-gray-700">Category</label>
  <select
    id="category_name"
    
    className="w-full p-2 border border-gray-700 rounded-lg"
    {...register('category_name', { required: 'Category is required' })}
  >
    <option value="">Select Category</option>
    {categories.map((category: Category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
  {errors.category_name && <span className="text-red-500">{errors.category_name.message}</span>}
</div> */}
{isUpdate ?(


    <div className="mb-4">
      <label htmlFor="user" className="block text-gray-700">Assigned To(update)</label>
      <select
        id="user"
        className="w-full p-2 border border-gray-300 rounded-lg"
        {...register('user', { required: false })}
      >
        <option value="">Select User</option>
        {users.map((user: User) => (
          <option key={user.id} value={user.email}>
            {user.email}
          </option>
        ))}
      </select>
      {errors.user && <span className="text-red-500">{errors.user.message}</span>}
    </div>
):(
    <div className="mb-4">
      <label htmlFor="assigned_to_email" className="block text-gray-700">Assigned To(create)</label>
      <select
        id="assigned_to_email"
        className="w-full p-2 border border-gray-300 rounded-lg"
        {...register('assigned_to_email', { required: false})}
      >
        <option value="">Select User</option>
        {users.map((user: User) => (
          <option key={user.id} value={user.email}>
            {user.email}
          </option>
        ))}
      </select>
      {errors.assigned_to_email && <span className="text-red-500">{errors.assigned_to_email.message}</span>}
    </div>
)}

       
       {/* Start Date Input */}
        <Input
          label="Start Date"
          id="start_date"
          type="date"
          {...register('start_date', { required: 'Start date is required' })}
        />
        {errors.start_date && (
          <span className="text-red-500">{errors.start_date.message}</span>
        )}
        {/* End Date Input */}
        <Input
          label="End Date"
          id="end_date"
          type="date"
          {...register('end_date', { required: 'End date is required' })}
        />
        {errors.end_date && (
          <span className="text-red-500">{errors.end_date.message}</span>
        )}

        <div className='flex flex-col mb-4'>
          <label htmlFor="priority">Priority</label>
          {/* Priority Input */}
          <select
            // label="Priority"
            id="priority"
            className="w-full p-2 border border-gray-300 rounded-lg"
            {...register('priority', { required: 'Priority is required' })}
            >
                <option value="">Priority order</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
          </select>
          {errors.priority && (
            <span className="text-red-500">{errors.priority.message}</span>
          )}
        </div>

        {/* Description */}
        <Input
          label="Description"
          id="description"
          type="text"
          placeholder="Task description"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}

        {/* Location */}
        <Input
          label="Location"
          id="location"
          type="text"
          placeholder="Location"
          {...register('location', { required: 'Location is required' })}
        />
        {errors.location && (
          <span className="text-red-500">{errors.location.message}</span>
        )}

        {/* Completed Checkbox */}
        <div className="mb-4 flex items-center">
          <input type="checkbox" {...register('completed')} />
          <label className="ml-2">Completed</label>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isUpdate ? 'Update Task' : 'Create Task'}
        </Button>

        {/* Link to Task List */}
        <div className="flex justify-center items-center mt-4">
          <p className="mr-2">Want to see all tasks?</p>
          <Link to="/tasks" className="text-blue-500 hover:underline">
            View Tasks
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;


// <div className="mb-4">
//   <label htmlFor="category" className="block text-gray-700">Category</label>
//   <select
//     id="category"
//     className="w-full p-2 border border-gray-700 rounded-lg"
//     {...register('category', { required: 'Category is required' })}
//   >
//     <option value="">Select Category</option>
//     {categories.map((category: Category) => (
//       <option key={category.id} value={category.id}>
//         {category.name}
//       </option>
//     ))}
//   </select>
//   {errors.category && <span className="text-red-500">{errors.category.message}</span>}
// </div>

 {/* Assigned To Input */}
        {/* <Input
          label="Assigned To"
          id="user"
          type="text"
          placeholder="Assignee's name"
          {...register('user', { required: 'Assigned To is required' })}
        />
        {errors.user && (
          <span className="text-red-500">{errors.user.message}</span>
        )} */}

        



{/* 
for creating task */}