import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { HiArrowUp, HiDocumentText, HiOutlineUserGroup, HiOutlineMegaphone } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function DashboardComp() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    //console.table(users); console.table(posts); console.table(comments);

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers?limit=5`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.log(error.message);
            }

        };

        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/post/getposts?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await fetch('/api/comment/getcomments?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.userdata.isAdmin) {
            fetchUsers();
            fetchComments();
            fetchPosts();
        }
    }, [currentUser]);
    return (
        <div className='p-3 md:mx-auto font-Montserrat'>
            <div className='flex-wrap flex gap-4 justify-center'>
                <div className='flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-xl'>
                    <div className='flex justify-between'>
                        <div>
                            <h3 className='text-md uppercase'>Total Users</h3>
                            <p className='text-2xl'>{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-xl'>
                    <div className='flex justify-between'>
                        <div>
                            <h3 className='text-gray-500 text-md uppercase'>
                                Total Comments
                            </h3>
                            <p className='text-2xl'>{totalComments}</p>
                        </div>
                        <HiOutlineMegaphone className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowUp />
                            {lastMonthComments}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-xl'>
                    <div className='flex justify-between'>
                        <div>
                            <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap gap-2 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent users</h1>
            <button className="btn btn-outline btn-info">
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </button>
          </div>
          <table className="table-lg">
              {/* head */}
              <thead>
                <tr className="underline font-RobotoSlab">
                  <th>USER IMAGE</th>
                  <th>USER NAME</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
  
                {users && users.map((user) => {
                  return (
                    <tr className="divide-y hover:bg-orange-100 text-md" key={user._id}>
                      <td><img src={user.profilePicture} alt="user image" className="h-12 w-12 rounded-full bg-slate-300" /></td>
                        <td>{user.username}</td>
                    </tr>
                    
                  )
                })}
  
              </tbody>
            </table>
  
        </div>

       
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Comments</h1>
            <button className="btn btn-outline btn-info">
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </button>
          </div>
          <table className="table-lg">
              {/* head */}
              <thead>
                <tr className="underline font-RobotoSlab">
                  <th>COMMENTS</th>
                  <th>LIKES</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
  
                {comments && comments.map((comment) => {
                  return (
                    <tr className="divide-y hover:bg-orange-100 text-md" key={comment._id}>
                      <td className="w-16"><p className=" line-clamp-2">{comment.content}</p></td>
                        <td>{comment.numberOfLikes}</td>
                    </tr>
                    
                  )
                })}
  
              </tbody>
            </table>
  
        </div>

        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent Posts</h1>
            <button className="btn btn-outline btn-info">
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </button>
          </div>
          <table className="table-lg">
              {/* head */}
              <thead>
                <tr className="underline font-RobotoSlab">
                  <th>POST IMAGE</th>
                  <th>POST TITLE</th>
                  
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
  
                {posts && posts.map((post) => {
                  return (
                    <tr className="divide-y hover:bg-orange-100 text-md" key={post._id}>
                      <td><img src={post.image} alt="post image" className="h-12 w-16 rounded-md bg-slate-300" /></td>
                        <td className="w-16"><p className=" line-clamp-1">{post.title}</p></td>
                        
                    </tr>
                    
                  )
                })}
  
              </tbody>
            </table>
  
        </div>
        
        </div>
        </div>
    )
}
