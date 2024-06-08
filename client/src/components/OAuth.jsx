import { FaGoogle } from "react-icons/fa";
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const OAuth = () => {

    const auth= getAuth(app);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const handleGoogleClick= async()=>{
        const provider= new GoogleAuthProvider()
        provider.setCustomParameters({prompt: 'select_account'})
        try {
            const resultFromGoogle= await signInWithPopup(auth,provider)
            //console.log(resultFromGoogle);
            const res= await fetch('/api/auth/google',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name:resultFromGoogle.user.displayName,
                    email:resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL,
                }),
            });
            const data=await res.json();
            if(res.ok){
                toast.success("Signin Successful");
                dispatch(signInSuccess(data));
                navigate('/');
            }else{
                toast.error("Signin Failed");
            }
        } catch (error) {
            console.log("OAuth Error");
        }

    }

  return (
    <>
    <button type="button" className="btn btn-outline btn-info font-Montserrat text-md w-full" onClick={handleGoogleClick}>
        <FaGoogle className="w-6 h-6" />
        Continue with Google
    </button>
    </>
  )
}
