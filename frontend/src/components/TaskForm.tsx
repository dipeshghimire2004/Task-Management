import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import { RootState } from '../store/store';
// import { useAppDispatch, useAppSelector } from '../store/Hooks';
import { useAppSelector } from '../store/Hooks';
import { selectTasksById } from '../features/taskSlice';

interface Task {
  id?: number;
  title: string;
  category: string;
  assigned_to: string;
  start_date: string;
  end_date: string;
  priority: number;
  description: string;
  location: string;
  completed?: boolean;
  category_name: string;
  user_name: string;
}

const TaskForm: React.FC = () => {
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

  // Populate form if updating an existing task
  useEffect(() => {
    if (isUpdate && currentTask) {
      Object.entries(currentTask).forEach(([key, value]) => {
        setValue(key as keyof Task, value as any);
      });
    }
  }, [isUpdate, currentTask, setValue]);

  // Handle form submission
  const onSubmit = async (data: Task) => {
    setLoading(true);
    try {
      if (isUpdate) {
        await axios.put(`http://127.0.0.1:8000/api/tasks/${taskId}/`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Task updated successfully');
      } else {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/tasks/create_task/',
          data,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        console.log('Task created successfully:', response.data);
      }
      navigate('/tasks');
      reset(); // Reset the form after submission
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

        {/* Category Input */}
        <Input
          label="Category"
          id="category"
          type="text"
          placeholder="Enter task category"
          {...register('category', { required: 'Category is required' })}
        />
        {errors.category && (
          <span className="text-red-500">{errors.category.message}</span>
        )}

        {/* Assigned To Input */}
        <Input
          label="Assigned To"
          id="assigned_to"
          type="text"
          placeholder="Assignee's name"
          {...register('assigned_to', { required: 'Assigned To is required' })}
        />
        {errors.assigned_to && (
          <span className="text-red-500">{errors.assigned_to.message}</span>
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

        {/* Priority Input */}
        <Input
          label="Priority"
          id="priority"
          type="number"
          placeholder="Priority level (1-5)"
          {...register('priority', { required: 'Priority is required' })}
        />
        {errors.priority && (
          <span className="text-red-500">{errors.priority.message}</span>
        )}

        {/* Description Input */}
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
