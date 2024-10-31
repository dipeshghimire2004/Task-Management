import axios from 'axios';
import React, {useState, useEffect } from 'react';
import { useForm} from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import { RootState } from '../store/store';
import { useAppDispatch, useAppSelector } from '../store/Hooks';
// import { aboutTask } from '../features/taskSlice';
import { clearTaskDetails, addTaskToState, updateTaskToState } from '../features/taskSlice';
import { useParams } from 'react-router-dom';


const TaskForm: React.FC = () => {
  const [loading, setLoading]=useState<boolean>(false)
  const { register, handleSubmit, formState: { errors }, setValue,reset } = useForm();
  const currentTask=useAppSelector((state:RootState)=>state.task.currentTask)
  const dispatch =useAppDispatch();
  const {taskId} =useParams<{taskId?:string}>()

 useEffect(()=>{
  if(currentTask && taskId) {
    Object.keys(currentTask).forEach((key) => {
      setValue(key, currentTask[key as keyof typeof currentTask]);      
    });
  }
  else{
    dispatch(clearTaskDetails());
    reset();
  }
 },[dispatch, currentTask,taskId, setValue,reset ])


 const onSubmit = async (data: any) => {
  setLoading(true);
  try {
    if (currentTask) {
      await axios.patch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      dispatch(updateTaskToState({id:taskId, ...data}))
      console.log('Task updated successfully');
    } else {
      const response = await axios.post('http://127.0.0.1:8000/api/tasks/create_task/', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      dispatch(addTaskToState(response.data));
      console.log('Task created successfully:', response.data);
      reset(); // Reset the form after successful creation
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error while processing the task:', error.response.data);
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">{taskId ? 'Update Task' : 'Create New Task'}</h2>

        {/* Title Input */}
        <div className="mb-4">
          <Input
            label="Title"
            id="title"
            type="text"
            placeholder="Enter task title"
            {...register('title', { required: 'Title is required' })}
            className="border border-gray-300 rounded-md w-full p-2"
          />
          {errors.title && <span className="text-red-500">{(errors.title as {message:string}).message}</span>}
        </div>

        {/* Category Input */}
        <div className="mb-4">
          <Input
            label="Category"
            id="category"
            type="text"
            placeholder="Enter task category"
            {...register('category', { required: 'Category is required' })}
            className="border border-gray-300 rounded-md w-full p-2"
          />
          {errors.category && <span className="text-red-500">{(errors.category as {message:string}).message}</span>}
        </div>

        {/* Assigned To Input */}
        <div className="mb-4">
          <Input
            label="Assigned To"
            id="assigned_to"
            type="text"
            placeholder="Assignee's name"
            {...register('assigned_to', { required: 'Assigned To is required' })}
            className="border border-gray-300 rounded-md w-full p-2"
          />
          {errors.assigned_to && <span className="text-red-500">{(errors.assigned_to as {message:string}).message}</span>}
        </div>

        {/* Start Date Input */}
        <div className="mb-4">
          <Input
            label="Start Date"
            id="start_date"
            type="date"
            {...register('start_date', { required: 'Start date is required' })}
            className="border border-gray-300 rounded-md w-full p-2"
          />
          {errors.start_date && <span className="text-red-500">{(errors.start_date as { message: string }).message}</span>}
        </div>

        {/* End Date Input */}
        <div className="mb-4">
          <Input
            label="End Date"
            id="end_date"
            type="date"
            {...register('end_date', { required: 'End date is required' })}
            className="border border-gray-300 rounded-md w-full p-2"
          />
          {errors.end_date && <span className="text-red-500">{(errors.end_date as { message: string }).message}</span>}
        </div>

        {/* Priority Input */}
        <div className="mb-4">
          <Input
            label="Priority"
            id="priority"
            type="number"
            placeholder="Priority level (1-5)"
            {...register('priority', { required: 'Priority is required' })}
            className="border border-gray-300 rounded-md w-full p-2"
          />
          {errors.priority && <span className="text-red-500">{(errors.priority as { message: string }).message}</span>}
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <Input
            label="Description"
            id="description"
            type="text"
            placeholder="Task description"
            {...register('description', { required: 'Description is required' })}
            className="border border-gray-300 rounded-md w-full p-2"
          />
          {errors.description && <span className="text-red-500">{(errors.description as { message: string }).message}</span>}
        </div>

        {/* Location Input */}
        <div className="mb-4">
          <Input
            label="Location"
            id="location"
            type="text"
            placeholder="Task location"
            {...register('location', { required: 'Location is required' })}
            className="border border-gray-300 rounded-md w-full p-2"
          />
          {errors.location && <span className="text-red-500">{(errors.location as { message: string }).message}</span>}
        </div>

        {/* Completed Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="completed"
            {...register('completed')}
            className="mr-2"
          />
          <label htmlFor="completed" className="text-gray-700">Completed</label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
        >
          {/* {loading ?'Loading...' : (currentTask ? 'Update Task' : 'Create Task')} */}
          {loading ?'Loading...' : taskId ? 'Update Task' : 'Create Task'}
        </Button>

        {/* Link to Task List */}
        <div className="flex justify-center items-center mt-4">
          <p className="mr-2">Want to see all tasks?</p>
          <Link to="/tasks" className="text-blue-500 hover:underline">View Tasks</Link>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
