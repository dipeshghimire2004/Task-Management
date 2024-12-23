import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { Task } from "@/store/types";
export const taskApiSlice = createApi({
    reducerPath: "tasksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api/", // Local development base URL
        prepareHeaders: (headers) => {
            const token = Cookies.get("access");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
        credentials: "include", // Include cookies with requests
    }),
    tagTypes: ["Task"],
    endpoints: (builder) => ({
        getTasks: builder.query<Task[], void>({
            
            query: () => "tasks/",
            providesTags: (result) =>
                result ? [...result.map(({id})=>({type:'Task' as const, id})),
                    {type: 'Task', id:'LIST'},
                ]
                :
                [{type:'Task', id:'LIST'}],
        }),
        deleteTask: builder.mutation<void, number >({
            query:(taskId)=>({
                url:`/tasks/${taskId}/`,
                method:"DELETE",
            }),
            invalidatesTags:(result, error, categoryId)=>[
                {type:'Task', id:categoryId},
                {type:'Task', id:'LIST'},
            ]

        })
    }),
});


export const { useGetTasksQuery, useDeleteTaskMutation } = taskApiSlice;