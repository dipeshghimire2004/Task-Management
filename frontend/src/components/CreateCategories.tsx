import React from 'react'
import axios from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'
import Input from './Input'
import { Link } from 'react-router-dom'

interface CategoryForm {
    name: string;
}

const CreateCategories: React.FC = () => {
    const { register, handleSubmit } = useForm<CategoryForm>();

    const onSubmit: SubmitHandler<CategoryForm> = async (data) => {
        const { name } = data;
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/categories/create_category/', { name }, {
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const category_name=response.data.name
            // if(caregories.some((category)=>category.name === CreateCategories))
            console.log(category_name)
            console.log('Category created:', response.data);
        } catch (error) {
            console.log("Error creating category:", error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
            <h2>Create Category</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="text"
                    {...register('name', { required: true })}
                    placeholder="Category Name"
                />
                {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Create Task
        </button>

        {/* Link to Task List */}
        <div className="flex justify-center items-center mt-4">
          <p className="mr-2">Want to see all Category?</p>
          <Link to="/tasks" className="text-blue-500 hover:underline">View Category</Link>
        </div>
            </form>
            {/* <p>{name}</p> */}
        </div>
    );
}

export default CreateCategories;
