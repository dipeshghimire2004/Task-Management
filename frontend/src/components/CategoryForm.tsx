import React, { useEffect } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import Input from './Input'
import { Link,useParams,useNavigate } from 'react-router-dom'
import { fetchCategories } from '../features/categorySlice'
import { useAppDispatch,useAppSelector } from '../store/Hooks'
import { RootState } from '../store/store'
import { selectCategoryById } from '../features/categorySlice'
import Cookies from 'js-cookie'
import toast,{Toaster} from 'react-hot-toast'


interface categoryItem {
    name: string;
}
interface categoryItemProps{
    isUpdate?:boolean
}


const CategoryForm: React.FC<categoryItemProps > = () => {


    const {id}= useParams<{id:string}>()
    const isUpdate =!!id;
    const { register, handleSubmit,setValue} = useForm<{name:string}>({
        defaultValues:{
            name:''
        }
    });
    const navigate=useNavigate();
    const dispatch=useAppDispatch();
    const token=Cookies.get('access');
    useEffect(()=>{
        dispatch(fetchCategories());
    },[dispatch])

    const category = useAppSelector((state: RootState) =>
            selectCategoryById(state, Number(id))
        ) as categoryItem | undefined
    
    console.log(category)


  


    useEffect(() => {
        console.log('Fetched category:', category);
        if (isUpdate && category) {
            // reset({ name: category.name });
          setValue('name', category.name); // Sets initial value in react-hook-form
          console.log('Setting form value to:', category.name);
        }
      }, [isUpdate, category, setValue]);
    //   console.log(setValue)

    const onSubmit = async (data:{name:string}) => {
        // const { name } = data;
        try {
            if(isUpdate && id){
                await axios.put(`http://127.0.0.1:8000/api/categories/${id}/`, data,{
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`,
                    },
                    withCredentials:true
                });
                toast.success('Category updated successfully')
                navigate('/categories');
            }
            else{
                const response = await axios.post('http://127.0.0.1:8000/api/categories/', data , {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization':`Bearer ${token}`
                    },
                    withCredentials:true
                });
                toast.success('Category created successfully')
                navigate('/');
                const category_name=response.data.name
                // if(caregories.some((category)=>category.name === CreateCategories))
                console.log(category_name)
                console.log('Category created:', response.data);
            }
        } catch (error) {
            console.log("Error creating category:", error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
            <Toaster/>
            <h2>{isUpdate ? 'Update Category' : 'Create Category'}</h2>
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
          {isUpdate ? 'Update' : 'Create'}
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

// const CategoryForm: React.FC<CategoryFormProps> = ({ isUpdate = false }) => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch=useAppDispatch();
  
//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);
//   // Get the category from the Redux store using the selector
//   const category = useAppSelector((state: RootState) =>
//     selectCategoryById(state, Number(id))
// );
// console.log(category)
// console.log(id);
//   const [name, setName] = useState<string>('');

//   useEffect(() => {
//     if (isUpdate && category) {
//       setName(category.name);
//     }
//   }, [isUpdate, category]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       if (isUpdate && id) {
//         // Update existing category on the server
//         await axios.put(`http://127.0.0.1:8000/api/categories/${id}/`, { name });
//       } else {
//         // Create a new category on the server
//         await axios.post('http://127.0.0.1:8000/api/categories/', { name });
//       }
//       navigate('/categories'); // Redirect after the operation
//     } catch (error) {
//       console.error('Error updating category:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg">
//       <h2 className="text-xl font-bold">{isUpdate ? 'Update Category' : 'Create Category'}</h2>
//       <label className="block mt-4">
//         <span className="text-gray-700">Category Name</span>
//         <input
//           type="text"
//           value={category?.name}
//           onChange={(e) => setName(e.target.value)}
//           className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           required
//         />
//       </label>
//       <button
//         type="submit"
//         className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
//       >
//         {isUpdate ? 'Update' : 'Create'}
//       </button>
//     </form>
//   );
// };

// export default CategoryForm;
