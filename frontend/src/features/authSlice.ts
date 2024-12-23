import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { User } from "@/components/Types";
import Cookies from "js-cookie";

interface userState{
    userdata:User | null
    accessToken:string | null
}

const initialState:userState={
    userdata:null,
    accessToken:Cookies.get('access') ?? null
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        login:(state, action:PayloadAction<{userdata:User; accessToken:string}>)=>{
            state.userdata=action.payload.userdata;
            state.accessToken=action.payload.accessToken   

            Cookies.set('access', action.payload.accessToken,{
                expires:1,
                sameSite:"Lax"
            })
        },
        logout:(state)=>{
            state.userdata=null;
            state.accessToken=null;
            Cookies.remove('access');
        }

    }
})

export const {login, logout}=authSlice.actions

export const selectIsAuthenticated =(state:RootState)=>!!state.auth.accessToken

export default authSlice.reducer