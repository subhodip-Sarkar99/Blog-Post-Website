import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice.js";


export const Login = () => {

  const [formData, setFormData] = useState({});

 const {loading}=useSelector((state) => state.user);
  const dispatch=useDispatch();

  const navigate=useNavigate();

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value.trim();

    setFormData({
      ...formData, [name]: value,
    });
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();
    //console.log(formData);
    try {
      dispatch(signInStart());
      const response= await fetch("/api/auth/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formData)
      });
      const data=await response.json();

      if(response.ok){
        toast.success("Login successful");
        setFormData({});
        navigate('/');
        dispatch(signInSuccess(data));
        //console.log(data);
       
      }else{
        dispatch(signInFailure());
        toast.error(data.extraDetails?data.extraDetails:data.message);
      }
    } catch (error) {
      console.log("Login Error",error);
    }
    setTimeout(()=>{
      dispatch(signInStart());
    },2000);
    //console.log(loading);
  }


  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-blue-600 sm:text-3xl font-RobotoSlab">Welcome Back!</h1>

          <p className="mx-auto mt-4 max-w-md text-center">
           Start Posting
          </p>

          <form onSubmit={handleSubmit} className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-slate-200">
            <p className="text-center text-lg font-medium font-Montserrat dark:text-black">Login</p>

            <div className="font-Montserrat text-xl">
              <label htmlFor="email" className="sr-only">Email</label>

              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-lg border-gray-600 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                />


              </div>
            </div>

            <div className="font-Montserrat">
              <label htmlFor="password" className="sr-only">Password</label>

              <div className="relative">
                <input
                  type="password"
                  className="w-full rounded-lg border-gray-600 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter password"
                  name="password"
                  onChange={handleChange}
                />

              </div>
            </div>
            <button
              type="submit"
              className="block w-full rounded-lg bg-blue-600 transition hover:scale-105 px-5 py-3 text-sm font-medium text-white"
              disabled={loading}
            >
              {loading?(<span className="loading loading-spinner loading-md"></span>):'Login'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Not registered?
              <Link to="/sign-up" className="underline" href="#"> Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
