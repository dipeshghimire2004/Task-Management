import { configureStore } from "@reduxjs/toolkit"
import taskReducer from '../features/taskSlice'
import categoryReducer from '../features/categorySlice';
import searchReducer from '../features/searchSlice'
import authReducer from '../features/authSlice'
import { categoriesApiSlice } from "@/features/categoriesApiSlice";
import { taskApiSlice } from "@/features/taskApiSlice";



const store=configureStore({
    reducer:{
        auth:authReducer,
        task:taskReducer,
        category:categoryReducer,
        search:searchReducer,
        [taskApiSlice.reducerPath]: taskApiSlice.reducer,
        [categoriesApiSlice.reducerPath]: categoriesApiSlice.reducer
    },
    // middleware:(getDefaultMiddleware)=>
    //     getDefaultMiddleware({
    //         serializableCheck:false,
    //     }),
    
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware().concat(categoriesApiSlice.middleware).concat(taskApiSlice.middleware),
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;

export default store;