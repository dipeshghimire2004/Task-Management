import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'
import { Category } from '@/store/types'


export const categoriesApiSlice = createApi({
    reducerPath:'categoriesApi',
    baseQuery: fetchBaseQuery({
        baseUrl:'http://127.0.0.1:8000/api/',
        prepareHeaders: (headers:Headers)=>{
            const token = Cookies.get('access');
            if(token){
                headers.set('Authorization',`Bearer ${token}`);
            }
            return headers;
        },
        credentials:'include',
    }),
    tagTypes:['Category'],
    endpoints:(builder)=>({
        getCategories: builder.query<Category[], void>({
            query:()=>'categories/',
                providesTags:(result:Category[] | undefined)=>
                   result?[...result.map(({id}) => ({type:'Category' as const, id})), 
                    {type:'Category', id:'LIST'}]
                    : [{type:'Category', id:"LIST"}],
        }),
        deleteCategory: builder.mutation<void, number>({
        query:(categoryId)=>({
            url:`categories/${categoryId}/`,
            method: 'DELETE',
        }),
        invalidatesTags:(result, error, categoryId)=>[
            {type:'Category', id:categoryId},// invalidating cache (specific category)
            {type:'Category', id:"LIST"},   //invalidating entire list categories
        ],
        }),

        createCategory: builder.mutation<Category, Partial<Category>>({
            query:(newCategory)=>({
                url:'categories/',
                method:'POST',
                body:newCategory,
            }),
            invalidatesTags:[{type:'Category', id:'LIST'}],
        }),
        updateCategory: builder.mutation<Category, {id:number; data: Partial<Category>}>({
            query:({id, data})=>({
                url:`categories/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags:(result, error, {id})=>[
                {type:'Category', id},
                {type:'Category', id:"LIST"},
            ]
        })
    }),
});


export const { useGetCategoriesQuery,useCreateCategoryMutation,useUpdateCategoryMutation, useDeleteCategoryMutation } = categoriesApiSlice;






