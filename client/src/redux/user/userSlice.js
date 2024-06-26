import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    loading:false
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart: (state) =>{
            state.loading=false;
        },
    
    signInSuccess: (state,action)=>{
        state.currentUser=action.payload;
        state.loading=false;
    },
    signInFailure: (state)=>{
        state.loading=true;
    },
    updateStart: (state)=>{
        state.loading=true;
    },
    updateSuccess: (state,action)=>{
        state.currentUser= action.payload;
        state.loading= false;
    },
    updateFailure: (state)=>{
        state.loading=false;
    },
    deleteUserStart: (state)=>{
        state.loading=true;
    },
    deleteUserSuccess: (state)=>{
        state.currentUser=null;
        state.loading=false;
    },
    deleteUserFailure: (state)=>{
        state.loading=false;
    },
    signoutSuccess: (state)=>{
        state.currentUser=null;
        state.loading=false;
    },
},
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess}= userSlice.actions;

export default userSlice.reducer;