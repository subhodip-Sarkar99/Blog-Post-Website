import { useEffect, useState } from "react"
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";


export default function Comment({ comments, onLike, onEdit, onDelete }) {
    //console.log('prop->',comments._id);
    //console.log('Onlike->',onLike);
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent,setEditedContent]= useState(comments.content);
    //console.log(user);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comments.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            }
            catch (error) {
                console.log(error.meessage);
            }
        };
        getUser();
    }, [comments]);

    const handleEdit = async () => {
        setIsEditing(true);
        setEditedContent(comments.content)
    };

    const handleSave= async()=>{
        try {
            const res= await fetch(`/api/comment/editComment/${comments._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    content:editedContent
                }),
            });
            if(res.ok){
                setIsEditing(false);
                onEdit(comments._id, editedContent);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="flex p-4 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3">
                <img className="w-10 h-10 rounded-full bg-gray-200" src={user.profilePicture} alt={user.username} />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username} ` : 'anonymous user'}</span>
                    <span className="text-gray-500 text-xs">
                        {moment(comments.createdAt).fromNow()} {/*Remember we need time of comments dont use user.createdAt*/}
                    </span>
                </div>
                {isEditing ? (
                    <>
                    <textarea className="textarea textarea-bordered border-teal-600 w-full mb-2" maxLength={200}
                     onChange={(e)=>setEditedContent(e.target.value)}
                     value={editedContent}
                    />
                    <div className="flex justify-end gap-2">
                    <button onClick={handleSave} className="btn btn-active btn-accent text-xs">Save</button>
                    <button onClick={()=>setIsEditing(false)} className="btn btn-outline btn-warning text-xs">Cancel</button>
                    </div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-500 pb-2">{comments.content}</p>
                        <div className="flex items-center pt-2 text-xs border-t max-w-fit gap-2">
                            <button type="button" onClick={() => onLike(comments._id)}
                                className={`text-gray-400 hover:text-blue-500 ${currentUser && comments.likes.includes(currentUser.userdata._id) && '!text-blue-500'}`}>
                                <FaThumbsUp className="text-sm" />
                            </button>
                            <p className="text-gray-400">
                                {
                                    comments.numberOfLikes > 0 && comments.numberOfLikes + " " + (comments.numberOfLikes === 1 ? 'like' : 'likes')
                                }
                            </p>
                            {
                                currentUser && (currentUser.userdata._id === comments.userId || currentUser.userdata.isAdmin) && (
                                    <>
                                    <button type="button" onClick={handleEdit} className="text-gray-400 hover:text-blue-500">Edit</button>
                                    <button type="button" onClick={()=>onDelete(comments._id)} className="text-gray-400 hover:text-red-500">Delete</button>
                                    </>        
                                )
                            }
                        </div>
                    </>

                )}

            </div>
        </div>
    );
}
