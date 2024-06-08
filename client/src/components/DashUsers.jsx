import { useEffect, useState } from "react"
import { MdOutlineWarningAmber } from "react-icons/md";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {

    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [userId, setUserId] = useState(null);
    //console.log(postId);
    //console.log(userPosts);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await fetch(`/api/user/getusers`);
          const data = await res.json();
          if (res.ok) {
            setUsers(data.users);
            if (data.users.length <9) {
              setShowMore(false);
            }
          }
  
        } catch (error) {
          console.log(error.message);
        }
      };
  
      if (currentUser.userdata.isAdmin) {
        fetchUsers();
      }
    }, [currentUser.userdata._id]);
  
    const handleShowMore = async () => {
      const startIndex = users.length;
      try {
        const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
          setUsers((prev) => [...prev, ...data.users]);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleDeleteUser=async ()=>{
        try {
            const res= await fetch(`/api/user/delete/${userId}`,{
                method: 'DELETE'
            });
            const data=await res.json();
            if(res.ok){
              setUsers((prev)=> prev.filter((user)=>user._id !== userId));
              toast.success('User deleted');  
            }else{
                toast.error(data);
            }
        } catch (error) {
            toast.error('Internal Server Error');
        }    
    }
  
     
    return (
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 min-h-screen">
        {currentUser.userdata.isAdmin && users.length > 0 ? (
          <>
  
            <table className="table-lg">
              {/* head */}
              <thead>
                <tr className="underline font-RobotoSlab">
                  <th>DATE CREATED</th>
                  <th>USER IMAGE</th>
                  <th>USERNAME</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                  <th>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
  
                {users.map((user) => {
                  return (
                    <tr className="hover:bg-orange-100 text-md" key={user._id}>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <img src={user.profilePicture} alt={user.username} className="w-20 h-20 object-cover rounded-full bg-slate-500" />
                      </td>
                      <td className="text-lg font-semibold text-center">{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? (<FaCheck className=" text-green-600"/>):(<FaTimes className=" text-red-600" />)}
                      
                      </td>
                      <td>
                        <span onClick={() => { document.getElementById('my_modal_2').showModal(); setUserId(user._id) }}
                          className="text-red-500 hover:underline cursor-pointer font-semibold"
                        >
                          Delete
                        </span>
                      </td>
                     
                    </tr>
                    
                  )
                })}
  
              </tbody>
            </table>
  
            {showMore && (
              <button onClick={handleShowMore} className="btn btn-outline btn-accent w-full py-4">Show More</button>
            )}
          </>
        ) : (
          <p></p>
        )}
        {/* MODAL FOR DELTE POST BTN */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg"><MdOutlineWarningAmber className="h-12 w-12 text-red-600" /><span>Are you sure you want to delete this user?</span></h3>
            <div className="flex flex-row justify-between">
              <button className="mt-6 btn btn-error text-white" onClick={handleDeleteUser}>Yes, Delete</button>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn font-bold">Close</button>
                </form>
              </div>
            </div>
  
          </div>
        </dialog>
  
      </div>
    );
  }
  
 

