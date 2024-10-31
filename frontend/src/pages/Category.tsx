import axios from 'axios';
import { motion } from 'framer-motion'; // Use motion from framer-motion
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
interface CategoryItem {
    name: string;
    id: number;
}

const Category: React.FC = () => {
    const [categories, setCategories] = useState<CategoryItem[]>([]);

    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/api/categories/')
            .then((response) => setCategories(response.data))
            .catch((error) => console.error('Error while fetching categories', error));
    }, []);

    return (
        <div className="p-6 mx-12 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl text-center font-bold mb-4">Categories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            className="p-4 bg-white border border-gray-200 rounded-lg shadow transition-transform transform hover:scale-105"
                            whileHover={{ scale: 1.05 }} // Animation on hover
                            whileTap={{ scale: 0.95 }} // Animation on tap
                        >   
                            <div className='flex justify-around space-x-6'>
                            <div className="text-lg font-semibold text-gray-800">{category.name}</div>
                            <div className='flex space-x-6 ml-4'>
                                <Button bgColor='bg-red-500'>Delete</Button>
                                <Button >Details</Button>
                            </div>
                            </div>
                        </motion.div>
                    ))}
                
            </div>
        </div>
    );
};

export default Category;
