import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Task } from "../store/types";
import { RootState } from "../store/store";
import axios,{isAxiosError} from "axios";
import Cookies from 'js-cookie';

interface TaskState{
    tasks: Task[]
    loading:boolean
    error: string | null
}

const initialState: TaskState={
    tasks:[],
    loading: false,
    error: null,
}


export const fetchTasks=createAsyncThunk<Task[], void, {rejectValue:string}>(
    'tasks/fetchTasks',
    async (_,{ rejectWithValue})=>{
    try {
        const token=Cookies.get('access');
        const response = await axios.get('http://127.0.0.1:8000/api/tasks/',{
            headers:{
                Authorization:`Bearer ${token}`,
            },
            withCredentials:true
        });
        console.log("apidata",response.data)
        return response.data
        
    } catch (error) {
        const errorMsg = isAxiosError(error) 
            ? error.response?.data?.message || 'Failed to fetch tasks'
            : 'An unknown error occurred';
        return rejectWithValue(errorMsg);
    }
});


const taskSlice=createSlice({
    name:'tasks',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchTasks.fulfilled, (state, action)=>{
            state.loading=false;
            state.tasks=action.payload;
        })
        .addCase(fetchTasks.rejected, (state, action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to fetch Tasks'
        })
        .addCase(fetchTasks.pending, (state)=>{
            state.loading = true;
            state.error=null;
        })
    }
})


export const selectTasks =(state:RootState)=>state.task?.tasks || [];

export const selectTasksById=(state:RootState, taskid:number)=>{
    return state.task.tasks.find(task=>task.id ===taskid)
}
    

export default taskSlice.reducer








