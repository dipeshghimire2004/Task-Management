import { configureStore } from "@reduxjs/toolkit"
import taskReducer from '../features/taskSlice'

const store=configureStore({
    reducer:{
        task:taskReducer,
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        }),
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;

export default store