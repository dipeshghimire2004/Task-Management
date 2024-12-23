import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { fetchCategories, selectCategories } from '../features/categorySlice';
import { useAppDispatch, useAppSelector } from '../store/Hooks';
import { RootState } from '../store/store';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumb';
import Cookies from 'js-cookie';
import { DeleteDialogBox } from '@/components/DeleteDialogBox';
import { useDeleteCategoryMutation, useGetCategoriesQuery } from '@/features/categoriesApiSlice';
// import { DeleteDialogBox } from '../components/DeleteDialogBox';
// import Button from '../components/Button';

const Category: React.FC = () => {
   
    const {data:categories =[], isLoading, isError}= useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleDelete = async(categoryId:number)=>{
        if(window.confirm('Are you sure you want to delete this category')){    
            try{
                await deleteCategory(categoryId).unwrap();
            } catch (error) {
                console.error('Failed to delete category', error);
            }
        }
    };

    if(isLoading) return <p>Loading categories...</p>;
    if(isError) return <p>Failed to fetch categories.</p>;



    return (
        <div className="lg:p-6 lg:mx-0 bg-blue-100 rounded-lg shadow-md">
            <Breadcrumb/>
            <h1 className="text-2xl text-center font-bold mb-4">Categories</h1>
            
            {categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow transition-transform transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="flex justify-between items-center overflow-hidden">
                                <div className="text-lg font-semibold text-gray-800">{category.name}</div>
                                <div className="flex space-x-4">
                                    {/* <Button onClick={()=>onDelete(category.id)} bgColor="bg-red-500">Delete</Button> */}
                                    <DeleteDialogBox  onDelete={()=>handleDelete(category.id)}
                                        Name={category.name}/>
                                            
                                    
                                    {/* <Button className='bg-green-500'>Details</Button> */}
                                    <Button>
                                        <Link to={`/categoryform/${category.id}`}>Update</Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No categories available.</p>
            )}
            <Button className='mt-40'><Link to='/categoryform'>Create Category</Link></Button>
        </div>
    );
};

export default Category;





    // const dispatch = useAppDispatch();
   
    // useEffect(() => {
    //     dispatch(fetchCategories());
    // }, [dispatch]);

    // Sele ct categories from the Redux store
    // const categories = useAppSelector((state: RootState) => selectCategories(state));
    // console.log(categories)

    // const onDelete=async (categoryId: number)=>{
        // if(window.confirm("Are you sure want to delete this category item"))
            
            // try {
            //     const token = Cookies.get('access');
            //     await axios.delete(`http://127.0.0.1:8000/api/categories/${categoryId}/`,
            //         {headers:{
            //             Authorization:`Bearer ${token}`
            //         }

            //         }
            //     );
            //     // categories(prevCategory => prevCategory.filter(category=>category.id !==categoryId) )
            //     dispatch(fetchCategories())
                
        // setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    //         } catch (error) {
    //             console.error("error occured",error)
    //         }
    // }

    

// const [categories, setCategories] = useState<CategoryItem[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     const loadCategories = async () => {
    //         setIsLoading(true);
    //         try {
    //             const response = await axios.get<CategoryItem[]>('http://127.0.0.1:8000/api/categories/');
    //             setCategories(response.data);
    //         } catch (error) {
    //             setError('Error while fetching categories',error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     loadCategories();
    // }, []);

    // Loading state
    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    // // Error state
    // if (error) {
    //     return <div>Error: {error}</div>;
    // }
    