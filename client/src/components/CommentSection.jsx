import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Comment from './Comment';
import { MdOutlineWarningAmber } from 'react-icons/md';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector(state => state.user);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState([]);
  const [commentToDelete,setCommentToDelete]= useState(null);
  //console.log(showComments);
  //console.log('commentSingular->',comment);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {

      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment, postId, userId: currentUser.userdata._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        toast.success('Comment Sent');
        setShowComments([data, ...showComments]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setShowComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getComments();
  }, [postId]);

const handleLike= async(commentId)=>{
  //console.log(commentId);
  try {
    if(!currentUser){
      navigate('/login');
      return;
    }
    const res= await fetch(`/api/comment/likeComment/${commentId}`,{
      method: 'PUT',
    });
    // const data= await res.json();
    // console.log(data);
    if(res.ok){
      const data= await res.json();
      setShowComments(showComments.map((comm)=>
        comm._id === commentId ?{
          ...comm,
          likes:data.likes,
          numberOfLikes:data.likes.length,

        }: comm
        
      ));
    }
  } catch (error) {
    console.log(error.message);
  }
};

const handleEdit =async(commentId,editedContent)=>{
  //console.table(commentId,editedContent)
  setShowComments(
    showComments.map((c)=>
      c._id=== commentId ? {...c, content: editedContent} : c
    )
  );
};

const handleDelete= async(commentId)=>{
  try {
      if(!currentUser){
        navigate('/login');
        return;
      }
      const res= await fetch(`/api/comment/deleteComment/${commentId}`,{
        method:'DELETE'
      });
      if(res.ok){
        const data=await res.json();
        toast.success(data);
        setShowComments(showComments.filter((comment)=> comment._id!==commentId));
      }else{
        toast.error('Error deleting comment');
      }
  } catch (error) {
    console.log(error.message);
  }
}

  return (
    <div className='font-Montserrat max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500'>
          <p>Signed in as: </p>
          <img className='h-10 w-10 object-cover rounded-full ml-1' src={currentUser.userdata.profilePicture} alt={currentUser.userdata.email} />
          <Link to={'/dashboard?tab=profile'} className='text-md text-cyan-600 hover:underline'>
            @{currentUser.userdata.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You Must Login To Comment.
          <Link to={'/login'} className='font-semibold text-blue-600 hover:underline'>Login </Link>
        </div>
      )}

      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
          <textarea placeholder="Add Comment..." className="textarea textarea-bordered w-full" rows={3} maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            required
          />

          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-sm'>{200 - comment.length} character remaining</p>
            <button className="btn btn-outline btn-accent">Submit</button>
          </div>
        </form>
      )}
      {showComments.length === 0 ? (
        <p className='text-sm my-5 '>No Comments Yet</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-500 py-1 px-2 rounded-sm'>
              <p>{showComments.length}</p>
            </div>
          </div>
              {
                showComments.map(comment=>{
                  return <Comment
                  key={comment._id}
                  comments={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId)=>{
                    document.getElementById('my_modal_2').showModal()
                    setCommentToDelete(commentId)
                  }}

                  />
                })
              }
        </>

      )}
      {/* MODAL */}
      <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg"><MdOutlineWarningAmber className="h-12 w-12 text-red-600" /><span>Are you sure you want to delete this comment?</span></h3>
            <div className="flex flex-row justify-between">
              <button className="mt-6 btn btn-error text-white" onClick={()=>handleDelete(commentToDelete)}>Yes, Delete</button>
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
