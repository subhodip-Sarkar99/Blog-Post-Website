import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import { OAuth } from "../components/OAuth";


export const SignUp = () => {

  const [formData, setFormData] = useState({});
  //const [errorMessage,setErrorMessage]= useState(null);
  //const [loading,setLoading]= useState(false);
  
  const {loading}=useSelector((state)=>state.user);
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
     // setLoading(true);
     dispatch(signInStart());
       const response =await fetch("/api/auth/sign-up",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formData)
       });
       //console.log("res",response);
       const data=await response.json();

       if(response.ok){
        toast.success("Sign Up successful");
        setFormData({});
        dispatch(signInSuccess(data));
        //setLoading(false);
        //console.log(data);
        navigate('/');
       }else{
        //setLoading(true);
        toast.error(data.extraDetails?data.extraDetails:data.message);
        dispatch(signInFailure());
      }
     

    } catch (error) {
      console.log("Sign Up error",error);
    }
    setTimeout(()=>{
      dispatch(signInStart());
    },2000);
  }
  

  return (
    <>

      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-blue-600 sm:text-3xl font-RobotoSlab">Register</h1>

          <p className="mx-auto mt-4 max-w-md text-center">
            Fill in the details to start your blogging journey with us in <span className="font-Pacifico font-bold text-xl">Blogs</span>
          </p>

          <form onSubmit={handleSubmit} className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-slate-200">
            <p className="text-center text-lg font-medium font-Montserrat dark:text-black">Create Account</p>

            <div className="font-Montserrat text-xl">
              <label htmlFor="username" className="sr-only">Username</label>

              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-600 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter username"
                  name="username"
                  onChange={handleChange}
                />


              </div>
            </div>

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
              className="block font-Montserrat font-semibold w-full rounded-lg bg-blue-600 transition hover:scale-105 px-5 py-3 text-sm text-white"
              disabled={loading}
            >
              { loading?(<span className="loading loading-spinner loading-md"></span>) :'Sign Up' }
              
            </button>
            <OAuth />
           

            <p className="text-center text-sm text-gray-500">
              Already registered?
              <Link to="/login" className="underline"> Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
