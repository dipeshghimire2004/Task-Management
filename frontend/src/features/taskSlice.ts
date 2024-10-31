import { ConfigureStoreOptions,createSlice,PayloadAction } from "@reduxjs/toolkit";
// import { act } from "react";
import { RootState } from "../store/store";

interface Task {
    // id?:number;
    id:string;
    title: string;
    category: string;
    assigned_to: string;
    start_date: string;
    end_date: string;
    priority: number;
    description: string;
    location: string;
    completed?: boolean;
  }

  
  interface TaskState{
    tasks:Task[];
    // currentTask: Task | null;
    currentTask?:Task;
  }

  const initialState:TaskState={
    tasks:[],
    // currentTask:null,
    currentTask:undefined,
  };

  const taskSlice = createSlice({
    name:'task',
    initialState,
    reducers:{
        setTaskDetail(state, action:PayloadAction<Task>){
            state.currentTask = action.payload;
        },
        clearTaskDetails(state){
            state.currentTask=undefined
        },

        addTaskToState(state, action:PayloadAction<Task>){
          state.tasks.push(action.payload)
        },
        updateTaskToState(state, action:PayloadAction<Task>){
          const index=state.tasks.findIndex(task => task.id === action.payload.id);
          if(index ! == -1){
            state.tasks[index]=action.payload;
          }
          if(state.currentTask && state.currentTask.id ===action.payload.id){
            state.currentTask =action.payload
          }
        }
    }
  });

  export const {setTaskDetail, addTaskToState, updateTaskToState, clearTaskDetails } =taskSlice.actions

  export const selectTasks=(state:RootState)=> state.task.tasks
  export const  selectCurrentTask=(state: RootState)=> state.task.currentTask

  export default taskSlice.reducer;