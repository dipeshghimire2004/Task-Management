import React, { useEffect } from 'react'
// import axios from 'axios'
import { useForm } from 'react-hook-form'
import Input from './Input'
import { Link,useParams,useNavigate } from 'react-router-dom'
// import { fetchCategories } from '../features/categorySlice'
// import { useAppDispatch,useAppSelector } from '../store/Hooks'
// import { RootState } from '../store/store'
// import { selectCategoryById } from '../features/categorySlice'
// import Cookies from 'js-cookie'
import toast,{Toaster} from 'react-hot-toast'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/features/categoriesApiSlice'


interface categoryItem {
    name: string;
}
interface categoryItemProps{
    isEditing?:boolean;
    initialData?:{id:number; name:string}
    onSuccess?: () => void;
};


const CategoryForm: React.FC<categoryItemProps> = ({isEditing=false, initialData, onSuccess}:categoryItemProps) => {

    // const {id}= useParams<{id:string}>()
    // const isUpdate =!!id;
    const { register, handleSubmit, reset, setValue} = useForm<categoryItem>({
        defaultValues:{
            name:''
        }
    });
    const [createCategory, {isLoading : isCreating}] = useCreateCategoryMutation();
    const [updateCategory, {isLoading: isUpdating}] = useUpdateCategoryMutation();
    const navigate=useNavigate();

    useEffect(()=>{
        if(isEditing && initialData){
            setValue('name',initialData.name);
        }
    },[isEditing, initialData, setValue])
    
    const onSubmit = async (data:categoryItem) => {
        // const { name } = data;
        try {
            if(isEditing && initialData){
                await updateCategory({id: initialData.id, data}).unwrap();
                // await axios.put(`http://127.0.0.1:8000/api/categories/${id}/`, data,{
                //     headers:{
                //         'Content-Type':'application/json',
                //         'Authorization':`Bearer ${token}`,
                //     },
                //     withCredentials:true
                // });
                toast.success('Category updated successfully')
                navigate('/categories');
            }
            else{
                await createCategory(data).unwrap();
                // const response = await axios.post('http://127.0.0.1:8000/api/categories/', data , {
                //     headers: {
                //         'Content-type': 'application/json',
                //         'Authorization':`Bearer ${token}`
                //     },
                //     withCredentials:true
                // });

                toast.success('Category created successfully')
                navigate('/');
                // const category_name=response.data.name
                // if(caregories.some((category)=>category.name === CreateCategories))
                // console.log(category_name)
                // console.log('Category created:', response.data);
            }
            reset();
            if(onSuccess) onSuccess();
        } catch (error) {
            console.log("Error creating category:", error);
        }
    }
    
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
            <Toaster/>
            <h2>{isEditing ? 'Update Category' : 'Create Category'}</h2>
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
          {isUpdating || isCreating ? 'Saving' : isEditing ? 'Update' : 'create'}
        </button>

        {/* Link to Task List */}
        <div className="flex justify-center items-center mt-4">
          <p className="mr-2">Want to see all Category?</p>
          <Link to="/categories" className="text-blue-500 hover:underline">View Category</Link>
        </div>
            </form>
            {/* <p>{name}</p> */}
        </div>
    );
}

export default CategoryForm;








// const dispatch=useAppDispatch();
// const token=Cookies.get('access');
// useEffect(()=>{
//     dispatch(fetchCategories());
// },[dispatch])

// const category = useAppSelector((state: RootState) =>
//         selectCategoryById(state, Number(id))
//     ) as categoryItem | undefined

// console.log(category)



// useEffect(() => {
//     console.log('Fetched category:', category);
//     if (isUpdate && category) {
//       setValue('name', category.name); // Sets initial value in react-hook-form
//       console.log('Setting form value to:', category.name);
//     }
//   }, [isUpdate, category, setValue]);
//   console.log(setValue)




// import React, { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '../store/Hooks';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { RootState } from '../store/store';;
// import { selectCategoryById } from '../features/categorySlice';
// import { fetchCategories } from '../features/categorySlice';


// interface CategoryFormProps {
    //   isUpdate?: boolean;
    // }
    