import { useEffect, useState } from "react"
import { MdOutlineWarningAmber } from "react-icons/md";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
// import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    //console.log(postId);
    //console.log(userPosts);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch('/api/comment/getcomments');
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 9) {
                        setShowMore(false);
                    }
                }

            } catch (error) {
                console.log(error.message);
            }
        };

        if (currentUser.userdata.isAdmin) {
            fetchComments();
        }
    }, [currentUser.userdata._id]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteComment = async () => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
                toast.success('Comment deleted');
            } else {
                toast.error(data);
            }
        } catch (error) {
            toast.error('Internal Server Error');
        }
    }


    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 min-h-screen">
            {currentUser.userdata.isAdmin && comments.length > 0 ? (
                <>

                    <table className="table-lg">
                        {/* head */}
                        <thead>
                            <tr className="underline font-RobotoSlab">
                                <th>DATE UPDATED</th>
                                <th>COMMENT CONTENT</th>
                                <th>NO. OF LIKES</th>
                                <th>POST ID</th>
                                <th>USERID</th>
                                <th>DELETE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}

                            {comments.map((comment) => {
                                return (
                                    <tr className="hover:bg-orange-100 text-md" key={comment._id}>
                                        <td>{new Date(comment.updatedAt).toLocaleDateString()}</td>
                                        <td>
                                            {comment.content}
                                        </td>
                                        <td className="text-lg font-semibold text-center">{comment.numberOfLikes}</td>
                                        <td>{comment.postId}</td>
                                        <td>{comment.userId} </td>
                                        <td>
                                            <span onClick={() => { document.getElementById('my_modal_2').showModal(); setCommentIdToDelete(comment._id) }}
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
                <p>You have no comments yet</p>
            )}
            {/* MODAL FOR DELTE POST BTN */}
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg"><MdOutlineWarningAmber className="h-12 w-12 text-red-600" /><span>Are you sure you want to delete this comment?</span></h3>
                    <div className="flex flex-row justify-between">
                        <button className="mt-6 btn btn-error text-white" onClick={handleDeleteComment}>Yes, Delete</button>
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
