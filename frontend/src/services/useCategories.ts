// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// interface CategoryItem {
//   id: number;
//   name: string;
// }

// const  useCategories = () => {
//   return useQuery<CategoryItem[], Error>({
//     queryKey: ['categories'], // Pass queryKey as part of the options object
//     queryFn: async () => {
//       const response = await axios.get<CategoryItem[]>('http://127.0.0.1:8000/api/categories/');
//       return response.data;
//     },
//   });
// };

// export default useCategories;