import { configureStore } from "@reduxjs/toolkit"
import taskReducer from '../features/taskSlice'
import categoryReducer from '../features/categorySlice';
import searchReducer from '../features/searchSlice'


const store=configureStore({
    reducer:{
        task:taskReducer,
        category:categoryReducer,
        search:searchReducer
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        }),
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;

export default store