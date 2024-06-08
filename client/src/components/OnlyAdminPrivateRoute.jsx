import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {

    const { currentUser }=useSelector((state)=>state.user);
    //console.log(currentUser);

    try {
        return currentUser.userdata && currentUser.userdata.isAdmin ? <Outlet /> : <Navigate to='/login' />
    } catch (error) {
        //console.log('Error',error);
    }
     
   
  
}

export default OnlyAdminPrivateRoute;