import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { fetchCategories, selectCategories } from '../features/categorySlice';
import { useAppDispatch, useAppSelector } from '../store/Hooks';
import { RootState } from '../store/store';
import axios from 'axios';



const Category: React.FC = () => {
    const dispatch = useAppDispatch();
   
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Select categories from the Redux store
    const categories = useAppSelector((state: RootState) => selectCategories(state));
    console.log(categories)

    const onDelete=async (categoryId: number)=>{
        if(window.confirm("Are you sure want to delete this category item"))
            try {
                await axios.delete(`http://127.0.0.1:8000/api/categories/${categoryId}/`);
                // categories(prevCategory => prevCategory.filter(category=>category.id !==categoryId) )
                dispatch(fetchCategories())
                
        // setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } catch (error) {
                console.error("error occured",error)
            }
    }
    return (
        <div className="p-6 mx-12 bg-gray-100 rounded-lg shadow-md">
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
                            <div className="flex justify-between items-center">
                                <div className="text-lg font-semibold text-gray-800">{category.name}</div>
                                <div className="flex space-x-4">
                                    <Button onClick={()=>onDelete(category.id)} bgColor="bg-red-500">Delete</Button>
                                    <Button>Details</Button>
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
        </div>
    );
};

export default Category;




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
    