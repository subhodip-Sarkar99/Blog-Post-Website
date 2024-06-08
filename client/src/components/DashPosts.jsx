import { useEffect, useState } from "react"
import { MdOutlineWarningAmber } from "react-icons/md";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


export const DashPosts = () => {

  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [postId, setPostId] = useState(null);
  //console.log(postId);
  //console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser.userdata._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }

      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.userdata.isAdmin) {
      fetchPosts();
    }
  }, [currentUser.userdata._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser.userdata._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/post/deletepost/${postId}/${currentUser.userdata._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        //console.log(data);
        toast.error(data);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postId)
        );
        toast.success('Post deleted');
      }
    } catch (error) {
      toast.error('Internal server error');
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 min-h-screen">
      {currentUser.userdata.isAdmin && userPosts.length > 0 ? (
        <>

          <table className="table-lg">
            {/* head */}
            <thead>
              <tr className="underline font-RobotoSlab">
                <th>DATE UPDATED</th>
                <th>POST IMAGE</th>
                <th>POST TITLE</th>
                <th>CATEGORY</th>
                <th>DELETE</th>
                <th><span>EDIT</span></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}

              {userPosts.map((post) => {
                return (
                  <tr className="hover:bg-orange-100" key={post._id}>
                    <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/post/${post.slug}`}><img src={post.image} alt={post.title} className="w-20 h-10 bg-gray-500" /></Link>
                    </td>
                    <td className="underline lg:text-xl font-semibold text-center"><Link to={`/post/${post.slug}`}>{post.title}</Link></td>
                    <td>{post.category}</td>
                    <td>
                      <span onClick={() => { document.getElementById('my_modal_2').showModal(); setPostId(post._id) }}
                        className="text-red-500 hover:underline cursor-pointer font-semibold"
                      >
                        Delete
                      </span>
                    </td>
                    <td>
                      <Link to={`/update-post/${post._id}`}> <span className="text-teal-500 font-semibold hover:underline cursor-pointer">Edit</span></Link>
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
          <h3 className="font-bold text-lg"><MdOutlineWarningAmber className="h-12 w-12 text-red-600" /><span>Are you sure you want to delete this post?</span></h3>
          <div className="flex flex-row justify-between">
            <button className="mt-6 btn btn-error text-white" onClick={handleDeletePost}>Yes, Delete</button>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn font-bold">Close</button>
              </form>
            </div>
          </div>

        </div>
      </dialog>


    </div>
  )
}
