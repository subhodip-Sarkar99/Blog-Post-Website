import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


export const UpdatePost = () => {

    const [file, setFile] = useState(null);
    const [imgUploadProgress, setImgUploadProgress] = useState(null);
    const [imgUploadError, setImgUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);

    const { postId } = useParams();
    //console.log(postId);

    //console.log(formData);
    const navigate = useNavigate();
    const { currentUser }=useSelector((state)=>state.user);

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if(!res.ok){
                    console.log('error: ',data);
                    setPublishError('Error fetching response');
                }
                if(res.ok){
                    setPublishError(null);
                    setFormData(data.posts[0]); //automatically generates 0 as key{0:_id,title,.....} 
                }
            }
            fetchPost();
        } catch (error) {
            console.log(error.message);
        }

    }, [postId]);
    
    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImgUploadError('Please select an image');
                return;
            }
            setImgUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImgUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImgUploadError('Image Upload Failed');
                    setImgUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        setImgUploadProgress(null);
                        setImgUploadError(null);
                        setFormData({ ...formData, image: downloadUrl });
                    });
                }
            );

        } catch (error) {
            setImgUploadError('Image upload Failed');
            setImgUploadProgress(null);
            //console.log('img upload error');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${postId}/${currentUser.userdata._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            } else {
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    }

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen font-Montserrat">
            <h1 className="text-center tex-2xl font-semibold mb-2">Update Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row justify-between gap-2">
                    <input type="text" id="title" placeholder="Title" required className="input input-bordered input-info flex-1 p-4"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        value={formData.title}
                    />
                    <select className="select select-info"
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        value={formData.category}
                    >
                        <option disabled>Select a Topic</option>
                        <option value="uncategorized">Uncategorized</option>
                        <option value="javascript">Javascript</option>
                        <option value="reactjs">React JS</option>
                        <option value="nextjs">Next JS</option>
                    </select>
                </div>
                <div className="flex gap-4 justify-between border-4 border-teal-500 border-dotted p-4">
                    <input type="file" className="file-input"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button className="btn btn-info" onClick={handleUploadImage} disabled={imgUploadProgress}>
                        {imgUploadProgress ?
                            (<div className='w-10 h-10'>
                                <CircularProgressbar value={imgUploadProgress} text={`${imgUploadProgress || 0}%`} />

                            </div>) : ('Update Image')
                        }
                    </button>
                </div>
                {imgUploadError && (
                    <div role="alert" className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{imgUploadError}</span>
                    </div>
                )}
                {formData.image && (
                    <img src={formData.image} alt="uploaded image" className='w-full h-72 object-cover' />
                )}

                <ReactQuill theme="snow" placeholder="Write Something..." required className="h-72 mb-12"
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    value={formData.content??''}
                />
                <button type='Submit' className="btn btn-active btn-accent mt-4">Update Post</button>
                {
                    publishError && (
                        <div role="alert" className="alert alert-error mt-5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{publishError}</span>
                        </div>
                    )
                }
            </form>
        </div>
    )
}
